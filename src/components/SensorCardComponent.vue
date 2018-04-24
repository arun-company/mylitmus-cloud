<template>
    <div class="content" v-if="sensor">
        <v-layout class="hidden">{{alertTemp = getAlertTemperature(sensor.currentMeasures), alertHumi = getAlertHumidity(sensor.currentMeasures)}} {{ alert= (alertTemp || alertHumi) ? 'alerts':getAlertClass(sensor.currentMeasures)}} {{white=getWhiteClass(alert)}} {{activeSensor = alertSensorClass(sensor.activeAt)}}</v-layout>
            <div class="div-block-12">
              <div class="div-block-11 card">
                <div v-bind:class="alert + ' div-block-2 viewall w-inline-block'">
                  <div class="div-block-16 partial cardtitle">
                    <div v-bind:class="alert + ' text-block-3 viewall'">{{sensor.name}}</div>
                    <div class="div-block-8">
                      <div class="div-block-7 ">
                        <img v-bind:src="'public/images/battery'+white+'.png'" width="20" height="20" title="배터리" class="image-3">
                        <img v-bind:src="'public/images/working'+activeSensor+white+'.png'" width="20" height="20" title="센서 작동 상태" class="image-3"></div>
                    </div>
                  </div>
                  <div class="div-block-16 partial">
                    <div class="div-block-17 center">
                      <img v-bind:src="'public/images/thermometer'+alertTemp+white+'.png'"  width="20" height="20" title="온도">
                    </div>
                    <div class="div-block-17 right">
                      <div v-if="minmax" v-bind:class="alert + ' text-block-9'">최고 {{minmax.temp.max}}</div>
                    </div>
                    <div class="div-block-17">
                      <div v-bind:class="alert + ' text-block-8'">{{getTemperature(sensor.currentMeasures)}}</div>
                    </div>
                    <div class="div-block-17 right">
                      <div v-if="minmax"  v-bind:class="alert + ' text-block-9'">최저 {{minmax.temp.min}}</div>
                    </div>
                  </div>
                  <div class="div-block-16 partial">
                    <div class="div-block-17 center">
                      <img v-bind:src="'public/images/humidity'+alertHumi+white+'.png'" width="20" height="20" title="습도"></div>
                    <div class="div-block-17 right">
                      <div v-if="minmax" v-bind:class="alert + ' text-block-9'">최고 {{minmax.humi.max}}</div>
                    </div>
                    <div class="div-block-17">
                      <div v-bind:class="alert + ' text-block-8'">{{getHumidity(sensor.currentMeasures)}}</div>
                    </div>
                    <div class="div-block-17 right">
                      <div v-if="minmax" v-bind:class="alert + ' text-block-9'">최저 {{minmax.humi.min}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="div-block-11">
                <div class="div-block-16">
                  <v-layout row wrap v-if="loading">
                    <v-progress-circular v-bind:indeterminate="true" size="40"></v-progress-circular>
                  </v-layout>
                    <template class="" v-if="chartData.temperature">
                      <highcharts :options="chartData.temperature"></highcharts>
                    </template>
                </div>
              </div>
              <div class="div-block-11">
                <div class="div-block-16">
                    <v-layout row wrap v-if="loading">
                      <v-progress-circular v-bind:indeterminate="true" size="40"></v-progress-circular>
                    </v-layout>
                    <template class="" v-if="chartData.humidity">
                      <highcharts :options="chartData.humidity"></highcharts>
                    </template>
                </div>
              </div>
            </div>
        </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import ZoneComponent from '@/components/ZoneComponent'
  // import TextCard from '@/components/dashboard/TextCard'
  // import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import { toFixedNumber } from '@/util'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'
  export default {
    props: {
      sensor: {type: Object},
      minMaxTemp: {type: Array},
      minMaxHumi: {type: Array}
    },
    watch: {
      
    },
    data () {
      return {
        // sensor: this.key,
        alarmEvents: [],
        alarmRules: [],
        measures : [],
        sensorTypes: [{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"min_value":5.0,"max_value":40.0},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"min_value":0.0,"max_value":100.0}],
        duration: '-24h',
        chartType: 'line',
        chartData: { 'temperature': null, 'humidity': null },
        loading: true,
        minmax:null,
        countAlert:false,
        tempMeasure:[],
        humiMeasure:[],
      }
    },
     created() {
     
    },
    mounted () {
	    this.loading = true
      const NODE_MEASURES_API = `${API_BASE}/nodes/${this.sensor.id}/measures`
      const NEW_NODE_TEMP_MEASURES_API = `${API_BASE}/nodes/${this.sensor.id}/sensorTypes/temperature/measures`
      const NEW_NODE_HUMI_MEASURES_API = `${API_BASE}/nodes/${this.sensor.id}/sensorTypes/humidity/measures`
			axios.all([
        axios.get(NODE_MEASURES_API, { params: { dateFrom: this.duration }}),
        axios.get(NEW_NODE_TEMP_MEASURES_API, { params: { dateFrom: this.duration }}),
        axios.get(NEW_NODE_HUMI_MEASURES_API, { params: { dateFrom: this.duration }}),
				// axios.get(EVENTS_API, { params: { dateFrom: this.duration }}),
				// axios.get(RULES_API),
			]).then(res => {
        this.measures = res[0].data.measures
        this.tempMeasure = res[1].data.measures
        this.humiMeasure = res[2].data.measures
				// this.alarmEvents = res[1].data.filter(event => event.nodeId === id)
				// this.alarmRules = res[2].data.alarmRules
				this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', this.getMinMax('temperature', 'min_value'), this.getMinMax('temperature', 'max_value'), '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
        this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', this.getMinMax('humidity', 'min_value'), this.getMinMax('humidity', 'max_value'), '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')
        this.loading = false
        var humidity = this.measures.filter(measure => measure.sensorType.uid === 'humidity');
        var temperature = this.measures.filter(measure => measure.sensorType.uid === 'temperature');
        this.minmax = {'temp': this.getMinMaxMeasure(temperature) , 'humi': this.getMinMaxMeasure(humidity) }
        this.$emit('count-alert', this.countAlert)
			});
     
    },
    methods: {
      getMinMaxMeasure(measures) {
        var temp = true
        var min='-', max='-',unit=''
        for(var i=0; i<measures.length; i++) {
            if (measures[i].value != null) {
                if (temp) {
                  min = measures[i].value
                  max = measures[i].value
                  unit = measures[i].sensorType.unit
                  temp=false
                  continue;
                }
                if (min > measures[i].value) min = measures[i].value;
                if (max < measures[i].value) max = measures[i].value;
            }
        }
        return {'min':min + unit, 'max':max + unit}
      },
      setZoneLocal: function(zone) {
        var self=this;
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        this.$router.push('/zone/'+  zone.name)
        return
      },
      getAlertTemperature(currentMeasures) {
        if (currentMeasures && currentMeasures[0]) {
            if (this.minMaxTemp[0] && this.minMaxTemp[1])
              return currentMeasures[0].value > this.minMaxTemp[0] && currentMeasures[0].value < this.minMaxTemp[1] ? "":"alerts"
            else if (this.minMaxTemp[0])
              return currentMeasures[0].value > this.minMaxTemp[0] ? "":"alerts"
            else if (this.minMaxTemp[1])
              return currentMeasures[0].value < this.minMaxTemp[1] ? "":"alerts"
        }
        return ''
      },
      getAlertHumidity(currentMeasures) {
        if (currentMeasures && currentMeasures[1]) {
            if (this.minMaxHumi[0] && this.minMaxHumi[1])
              return currentMeasures[1].value > this.minMaxHumi[0] && currentMeasures[1].value < this.minMaxHumi[1] ? "":"alerts"
            else if (this.minMaxHumi[0])
              return currentMeasures[1].value > this.minMaxHumi[0] ? "":"alerts"
            else if (this.minMaxHumi[1])
              return currentMeasures[1].value < this.minMaxHumi[1] ? "":"alerts"
        }
        return ''
      },
      getAlertClass(checkValue) {
         return (checkValue[0]&&checkValue[1])? '':'alerts'
      },
      getWhiteClass(alertClass) {
        if (alertClass) {
          this.countAlert = true
          return ".fff"
        }
        return ""
      },
      alertSensorClass(activeDate) {
        return (new Date() - new Date(activeDate)) > (24 * 3600 * 1000)?'-not':''
      },
      getHumidity(currentMeasures) {
        if (currentMeasures && currentMeasures[1]) {
            return currentMeasures[1].value + currentMeasures[1].unit
        }
        return '-'
      },
      getTemperature(currentMeasures) {
         if (currentMeasures && currentMeasures[0]) {
            return currentMeasures[0].value + currentMeasures[0].unit
        }
        return '-'
      },
      getSensorTypes() {     
        this.chartData = {}
        const SENSOR_MIN_MAX_API = `${API_BASE}/zones/${zoneid}/sensorTypes`;
        axios.get(SENSOR_MIN_MAX_API).then(res => {
          this.sensorTypes = res.data
        })
		  },
      chart_data(title, yAxisTitle, color, min, max, unit, seriesTitle, measures, sensorType) {
			// TODO 알람이 과거에는 존재하고 현재 없어진 경우, plotband subtitle에는 표시되지 않는 이슈가 있다.
			return {
        chart: { type: this.chartType, zoomType: 'x' ,
        height: 160 },
				title: { text: ''},
				subtitle: {
				  text: this.alarmRules.filter(rule => rule.sensorType.uid === sensorType).map(rule => `<span style="background-color: ${rule.color || '#FFC4C4'}; margin: 2px;">${rule.name}</span>`).join(''),
				  useHTML: true,
				  // verticalAlign: 'bottom'
        },
				xAxis: { 
          visible: false,
					type: 'datetime',
					dateTimeLabelFormats: {
						day: '%b %e일'
					},
				  // plotBands: this.getPlotBands(sensorType),
				},
			    yAxis: {
			      title: null,
				  min, max
				},
			    tooltip: { valueSuffix: unit },
			    legend: {
            enabled: false,
			      layout: 'vertical',
			      align: 'right',
			      verticalAlign: 'middle',
			      borderWidth: 0
				},
				series: [{
				name: seriesTitle,
        color,
        // measures:{},
        data: measures.map(measure => [moment(measure.measuredAt).valueOf(), toFixedNumber(measure.value, 2)])
				}]
			}
    },
    getMinMax(uid, minmax) {
			const sensorType = this.sensorTypes.find(element => element.sensorType.uid === uid) || {}
			return sensorType[minmax] || 0
		},
    getChartData() {
      // this.measures = [{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":null,"measuredAt":"2018-03-31T05:48:00.849849Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":null,"measuredAt":"2018-03-31T05:48:00.849849Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.39,"measuredAt":"2018-03-31T05:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.97,"measuredAt":"2018-03-31T05:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.46,"measuredAt":"2018-03-31T06:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.89,"measuredAt":"2018-03-31T06:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.45,"measuredAt":"2018-03-31T06:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.97,"measuredAt":"2018-03-31T06:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.48,"measuredAt":"2018-03-31T06:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.89,"measuredAt":"2018-03-31T06:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.48,"measuredAt":"2018-03-31T06:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.91,"measuredAt":"2018-03-31T06:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.54,"measuredAt":"2018-03-31T06:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.79,"measuredAt":"2018-03-31T06:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.52,"measuredAt":"2018-03-31T06:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.79,"measuredAt":"2018-03-31T06:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.53,"measuredAt":"2018-03-31T07:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.75,"measuredAt":"2018-03-31T07:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.52,"measuredAt":"2018-03-31T07:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.77,"measuredAt":"2018-03-31T07:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.56,"measuredAt":"2018-03-31T07:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.7,"measuredAt":"2018-03-31T07:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.6,"measuredAt":"2018-03-31T07:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.65,"measuredAt":"2018-03-31T07:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.58,"measuredAt":"2018-03-31T07:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.67,"measuredAt":"2018-03-31T07:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.61,"measuredAt":"2018-03-31T07:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.61,"measuredAt":"2018-03-31T07:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.64,"measuredAt":"2018-03-31T08:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.49,"measuredAt":"2018-03-31T08:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.6,"measuredAt":"2018-03-31T08:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.58,"measuredAt":"2018-03-31T08:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.59,"measuredAt":"2018-03-31T08:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.56,"measuredAt":"2018-03-31T08:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.59,"measuredAt":"2018-03-31T08:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.54,"measuredAt":"2018-03-31T08:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.62,"measuredAt":"2018-03-31T08:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.41,"measuredAt":"2018-03-31T08:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.58,"measuredAt":"2018-03-31T08:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.44,"measuredAt":"2018-03-31T08:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.56,"measuredAt":"2018-03-31T09:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.36,"measuredAt":"2018-03-31T09:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.53,"measuredAt":"2018-03-31T09:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.33,"measuredAt":"2018-03-31T09:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.51,"measuredAt":"2018-03-31T09:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.25,"measuredAt":"2018-03-31T09:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.45,"measuredAt":"2018-03-31T09:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.26,"measuredAt":"2018-03-31T09:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.4,"measuredAt":"2018-03-31T09:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.2,"measuredAt":"2018-03-31T09:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.36,"measuredAt":"2018-03-31T09:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.17,"measuredAt":"2018-03-31T09:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.31,"measuredAt":"2018-03-31T10:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.18,"measuredAt":"2018-03-31T10:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.28,"measuredAt":"2018-03-31T10:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.11,"measuredAt":"2018-03-31T10:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.21,"measuredAt":"2018-03-31T10:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.12,"measuredAt":"2018-03-31T10:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.21,"measuredAt":"2018-03-31T10:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.06,"measuredAt":"2018-03-31T10:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.14,"measuredAt":"2018-03-31T10:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.05,"measuredAt":"2018-03-31T10:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.08,"measuredAt":"2018-03-31T10:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.05,"measuredAt":"2018-03-31T10:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.03,"measuredAt":"2018-03-31T11:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.04,"measuredAt":"2018-03-31T11:00:00Z"}]
      // this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', this.getMinMax('temperature', 'min_value'), this.getMinMax('temperature', 'max_value'), '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
      // this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', this.getMinMax('humidity', 'min_value'), this.getMinMax('humidity', 'max_value'), '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')
        this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', this.getMinMax('temperature', 'min_value'), this.getMinMax('temperature', 'max_value'), '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
        this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', this.getMinMax('humidity', 'min_value'), this.getMinMax('humidity', 'max_value'), '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')    
    },
    getPlotBands(sensorType) {
			const bands = this.alarmEvents.filter(e => e.sensorType.uid === sensorType).map(alarmEvent => {
				return {
					color: this.getBandColor(alarmEvent),
					from: moment(alarmEvent.startedAt).valueOf(),
					to: moment(alarmEvent.finishedAt).valueOf(),
				}
			})
			return bands
		},
    }
  }
</script>

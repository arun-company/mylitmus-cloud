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
      zoneid:0,
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
        sensorTypes: [],
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
      const SENSOR_MIN_MAX_API = `${API_BASE}/zones/${this.zoneid}/sensorTypes`;
			axios.all([
        axios.get(NODE_MEASURES_API, { params: { dateFrom: this.duration }}),
        axios.get(NEW_NODE_TEMP_MEASURES_API, { params: { dateFrom: this.duration }}),
        axios.get(NEW_NODE_HUMI_MEASURES_API, { params: { dateFrom: this.duration }}),
        axios.get(SENSOR_MIN_MAX_API),
			]).then(res => {
        this.measures = res[0].data.measures
        this.tempMeasure = res[1].data.measures
        this.humiMeasure = res[2].data.measures
        this.sensorTypes = res[3].data
        
				
        this.loading = false
        var humidity = this.measures.filter(measure => measure.sensorType.uid === 'humidity');
        var temperature = this.measures.filter(measure => measure.sensorType.uid === 'temperature');
        this.minmax = {'temp': this.getMinMaxMeasure(temperature) , 'humi': this.getMinMaxMeasure(humidity) }
        this.$emit('count-alert', this.countAlert)
        var minmaxTemp = this.sensorTypes.find(element => element.sensorType.uid === 'temperature') || {}
        var minmaxHumi = this.sensorTypes.find(element => element.sensorType.uid === 'humidity') || {}
        console.log(minmaxTemp['min_value'])
        console.log(minmaxTemp['max_value'])
        this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', minmaxTemp['min_value'], minmaxTemp['max_value'], '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
        this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', minmaxHumi['min_value'], minmaxHumi['max_value'], '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')    
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
          min:min,
          max:max
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

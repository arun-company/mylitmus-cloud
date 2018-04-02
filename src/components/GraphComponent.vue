<template>

    <div class="div-block-11 graph">
      <div class="div-block-16">
          <template class="" v-if="chartData.temperature">
            <highcharts :options="chartData.temperature"></highcharts>
          </template>
      </div>
       <div class="div-block-16">
          <template class="" v-if="chartData.humidity">
            <highcharts :options="chartData.humidity"></highcharts>
          </template>
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
    props: ['sensorid','zoneid'],
    watch: {
      
    },
    data () {
      return {
        alarmEvents: [],
        alarmRules: [],
        measures : [],
        sensorTypes: [{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"min_value":5.0,"max_value":40.0},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"min_value":0.0,"max_value":100.0}],
        duration: '-24h',
        chartType: 'line',
        chartData: { 'temperature': null, 'humidity': null },
        
        
      }
    },
     created() {
     
    },
    mounted () {
          // var NODES = `${API_BASE}/zones/`+ this.zoneid + '/nodes'
          // axios.get(NODES).then(response => {
          //     this.sensors = response.data
          // })
	    
			const NODE_MEASURES_API = `${API_BASE}/nodes/${this.sensorid}/measures`
			// const EVENTS_API = `${API_BASE}/zones/${this.zoneId}/alarmEvents`
			// const RULES_API = `${API_BASE}/zones/${this.zoneId}/alarmRules`
			axios.all([
				axios.get(NODE_MEASURES_API, { params: { dateFrom: this.duration }}),
				// axios.get(EVENTS_API, { params: { dateFrom: this.duration }}),
				// axios.get(RULES_API),
			]).then(res => {
				this.measures = res[0].data.measures
				// this.alarmEvents = res[1].data.filter(event => event.nodeId === id)
				// this.alarmRules = res[2].data.alarmRules
				this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', this.getMinMax('temperature', 'min_value'), this.getMinMax('temperature', 'max_value'), '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
				this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', this.getMinMax('humidity', 'min_value'), this.getMinMax('humidity', 'max_value'), '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')
				
			});
     
    },
    methods: {

      
      setZoneLocal: function(zone) {
        var self=this;
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        this.$router.push('/zone/'+  zone.name)
        return
      },

      getAlertClass(checkValue) {
         return (checkValue[0]&&checkValue[1])? '':'alerts'
      },
      getWhiteClass(alertClass){
        return alertClass?".fff":""
      },
      alertSensorClass(activeDate) {
        return (new Date() - new Date(activeDate)) > (24 * 3600 * 1000)?'-not':''
      },
      getHumidity(currentMeasures) {
        if (currentMeasures && currentMeasures[0]) {
            return currentMeasures[0].value + currentMeasures[0].unit
        }
        return '-'
      },
      getTemperature(currentMeasures) {
         if (currentMeasures && currentMeasures[1]) {
            return currentMeasures[1].value + currentMeasures[1].unit
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

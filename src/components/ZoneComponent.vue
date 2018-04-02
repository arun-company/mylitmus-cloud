<template>
  <div>
    <v-progress-linear v-bind:indeterminate="true" v-if="!sensors"></v-progress-linear>
    <div class="div-block-10"><a href="#" @click="setZoneLocal({id:zoneid, name:zonename})" class="heading-4">Zone - {{zonename}}</a>
            <div class="div-block-alerts">
              <div class="div-block-13">
                <div class="div-block-13">
                  <div class="text-block-7">센서</div>
                  <div class="text-block-7">000개</div>
                </div>
                <div class="div-block-13"><img src="public/images/alert_red.png" width="20" height="20" class="image-3">
                  <div class="text-block-7">000개</div>
                </div>
              </div>
            </div>
          </div>
          <template>
              <!-- {{tempZone}} -->
                <div  v-for="sensor in sensors" v-bind:key="sensor.id" class="content">
                  <v-layout class="hidden">{{ alert= getAlertClass(sensor.currentMeasures)}} {{white=getWhiteClass(alert)}} {{activeSensor = alertSensorClass(sensor.activeAt)}}</v-layout>
                  <div class="div-block-12">
                    <div class="div-block-11 card">
                      <div v-bind:class="alert + ' div-block-2 viewall w-inline-block'">
                        <div class="div-block-16 partial cardtitle">
                          <div v-bind:class="alert + ' text-block-3 viewall'">{{sensor.name}}</div>
                          <div class="div-block-8">
                            <div class="div-block-7"><img v-bind:src="'public/images/battery'+alert+white+'.png'" width="20" height="20" title="배터리" class="image-3">
                            <img v-bind:src="'public/images/working'+activeSensor+white+'.png'" width="20" height="20" title="센서 작동 상태" class="image-3"></div>
                          </div>
                        </div>
                        <div class="div-block-16 partial">
                          <div class="div-block-17">
                            <img v-bind:src="'public/images/thermometer'+alert+white+'.png'"  width="20" height="20" title="온도">
                          </div>
                          <div class="div-block-17 right">
                            <div v-bind:class="alert + ' text-block-9'">최고 - ℃</div>
                          </div>
                          <div class="div-block-17">
                            <div v-bind:class="alert + ' text-block-8 alerts'">{{getTemperature(sensor.currentMeasures)}}</div>
                          </div>
                          <div class="div-block-17 right">
                            <div v-bind:class="alert + ' text-block-9'">최저 -℃</div>
                          </div>
                        </div>
                        <div class="div-block-16 partial">
                          <div class="div-block-17"><img src="public/images/humidity.fff.png" width="20" height="20" title="습도"></div>
                          <div class="div-block-17 right">
                            <div v-bind:class="alert + ' text-block-9'">최고 -%</div>
                          </div>
                          <div class="div-block-17">
                            <div v-bind:class="alert + ' text-block-8'">{{getHumidity(sensor.currentMeasures)}}</div>
                          </div>
                          <div class="div-block-17 right">
                            <div v-bind:class="alert + ' text-block-9'">최저 -%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <graph-component v-bind:sensorid="sensor.id"></graph-component>
                  </div>
              </div>
          </template>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import GraphComponent from '@/components/GraphComponent'
  // import TextCard from '@/components/dashboard/TextCard'
  // import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import { toFixedNumber } from '@/util'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'
  export default {
    components: { GraphComponent },
    props: ['zonename','zoneid'],
    watch: {
      
    },
    data () {
      return {
        sensors : []
      }
    },
     created() {
     
    },
    mounted () {
          var NODES = `${API_BASE}/zones/`+ this.zoneid + '/nodes'
          axios.get(NODES).then(response => {
              this.sensors = response.data
          })

     
    },
    methods: {

      getChartTemperature: function(nodeId) {
            nodeId = 1000005
            var NODE_MESEARED = `${API_BASE}/nodes/${nodeId}/measures?dateFrom=-24h`
            axios.get(NODE_MESEARED).then(response => {
              this.measures= response.data    
              this.getChartData()
            })
          
      },
      setZoneLocal: function(zone) {
        var self=this;
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        this.$router.push('/zone/'+  zone.name)
        return
      },
      getSensors(zoneId) {

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
        const SENSOR_MIN_MAX_API = `${API_BASE}/zones/3/sensorTypes`;
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

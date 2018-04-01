<template>
    <div class="section">
    <div class="w-container">
      <h1 class="heading">{{headerTitle}}</h1>
    </div>
    <div class="reporting-all">
      <div class="div-block-reporting">
        <div class="div-block-10"><router-link to="/site" class="heading-3">Site -Dafult</router-link>
          <div class="div-block-alerts">
            <div class="div-block-13">
              <div class="text-block-7">존</div>
              <div class="text-block-7">00곳</div>
            </div>
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
        <div class="content">
          <div class="div-block-7 view-all"><img src="public/images/call.png" width="20" height="20" title="센서">
            <div class="text-block-6">(0666) 7777-8888</div>
          </div>
          <div class="div-block-7 view-all"><img src="public/images/email.png" width="20" height="20" title="센서">
            <div class="text-block-6">alias-alias@email.com</div>
          </div>
          <div class="div-block-7 view-all address"><img src="public/images/location.png" width="20" height="20" title="센서">
            <div class="text-block-6">전라남도 진안군 성삼읍</div>
          </div>
        </div>  
        <!-- END OF SITE DETAIL -->
        <div v-for="zone in zones" class="div-block-reporting">
          <div class="div-block-10"><a href="#" @click="setZoneLocal(zone)" class="heading-4">Zone - {{zone.name}}</a>
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
          <!-- END OF ZONE -->
          <template  v-if="tempZone=getSensors(zone.id)">
              <!-- {{tempZone}} -->
                <div v-for="sensor in tempZone.nodes" v-bind:key="sensor.id" class="content">
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
                            <div v-bind:class="alert + ' text-block-9'">최고 {{tempZone.settings[0].max_value}}℃</div>
                          </div>
                          <div class="div-block-17">
                            <div v-bind:class="alert + ' text-block-8 alerts'">{{getTemperature(sensor.currentMeasures)}}</div>
                          </div>
                          <div class="div-block-17 right">
                            <div v-bind:class="alert + ' text-block-9'">최저 {{tempZone.settings[0].min_value}}℃</div>
                          </div>
                        </div>
                        <div class="div-block-16 partial">
                          <div class="div-block-17"><img src="public/images/humidity.fff.png" width="20" height="20" title="습도"></div>
                          <div class="div-block-17 right">
                            <div v-bind:class="alert + ' text-block-9'">최고 {{tempZone.settings[1].max_value}}%</div>
                          </div>
                          <div class="div-block-17">
                            <div v-bind:class="alert + ' text-block-8'">{{getHumidity(sensor.currentMeasures)}}</div>
                          </div>
                          <div class="div-block-17 right">
                            <div v-bind:class="alert + ' text-block-9'">최저 {{tempZone.settings[1].min_value}}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="div-block-11">
                      <div class="div-block-16">
                          <template class="" v-if="chartData.temperature">
                            <highcharts :options="chartData.temperature"></highcharts>
                          </template>
                      </div>
                    </div>
                    <div class="div-block-11">
                      <div class="div-block-16">
                          <template class="" v-if="chartData.humidity">
                            <highcharts :options="chartData.humidity"></highcharts>
                          </template>
                      </div>
                    </div>
                  </div>
              </div>
          </template>
          
        

          </div>
          <!-- END OF SENSOR -->
          
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  // import TextCard from '@/components/dashboard/TextCard'
  // import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import { toFixedNumber } from '@/util'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'

  export default {
    // components: { EventGraph },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/', class:''},
          {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'View', icon:'003-signs.png', path:'/view-all' , class:'w--current'},

        ]
      return {
         // measures:{},
        measures : [],
        tempZone:'',
        search: '',
        zones:[],
        open: this.drawer,
        headerTitle: 'Organization',
        searchTitle: 'Search sites ...',
        detail_zone: this.$store.state.detail_zone,
        items: [
          {id:1, name:"Default",description:""},
        ],
        sensorTypes: [{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"min_value":5.0,"max_value":40.0},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"min_value":0.0,"max_value":100.0}],
        alarmEvents: [],
        alarmRules: [],
        loading: { list: true, info: false },
        duration: '-24h',
        chartType: 'line',
        chartData: { 'temperature': null, 'humidity': null },
      }
    },
    computed:
    {
      filteredItems:function()
      {
        var self=this
        return this.items.filter(function(item){return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
      }
      
    },
    mounted () {
      this.getAllZones()
      this.getChartData()
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
      getSensors(zoneId) {
          if (localStorage.getItem('detail_zone'+zoneId))
            return JSON.parse(localStorage.getItem('detail_zone'+zoneId))
          return []
      },
      getAllZones () {
          axios.get(ZONES_API).then(res => {
          this.zones = res.data;
          localStorage.setItem('zones', JSON.stringify(this.zones))
          // this.zones = JSON.parse(localStorage.getItem('zones'));

          for(var i=0; i < res.data.length; i++) {
            var id = res.data[i].id
            if (localStorage.getItem('detail_zone'+ id)){
              this.$store.state.detail_zone[id] = JSON.parse(localStorage.getItem('detail_zone'+ id))
            } else {
              var zone = `${API_BASE}/zones/`+ id
              var node = zone + '/nodes'
              var sensorType = zone + '/sensorTypes';
              https://mylitmus.cloud/v1/v1/zones/2/sensorTypes
              axios.all([
                  axios.get(zone),
                  axios.get(node),
                  axios.get(sensorType)
              ]).then(response => {
                this.$store.state.detail_zone[id] = response[0].data
                this.$store.state.detail_zone[id].nodes = response[1].data
                localStorage.setItem('detail_zone' + response[0].data.id, JSON.stringify({'data':response[0].data,'nodes':response[1].data, 'settings':response[2].data}))
              })
            }
          }
        })
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
				  plotBands: this.getPlotBands(sensorType),
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
      this.measures = [{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":null,"measuredAt":"2018-03-31T05:48:00.849849Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":null,"measuredAt":"2018-03-31T05:48:00.849849Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.39,"measuredAt":"2018-03-31T05:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.97,"measuredAt":"2018-03-31T05:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.46,"measuredAt":"2018-03-31T06:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.89,"measuredAt":"2018-03-31T06:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.45,"measuredAt":"2018-03-31T06:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.97,"measuredAt":"2018-03-31T06:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.48,"measuredAt":"2018-03-31T06:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.89,"measuredAt":"2018-03-31T06:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.48,"measuredAt":"2018-03-31T06:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.91,"measuredAt":"2018-03-31T06:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.54,"measuredAt":"2018-03-31T06:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.79,"measuredAt":"2018-03-31T06:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.52,"measuredAt":"2018-03-31T06:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.79,"measuredAt":"2018-03-31T06:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.53,"measuredAt":"2018-03-31T07:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.75,"measuredAt":"2018-03-31T07:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.52,"measuredAt":"2018-03-31T07:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.77,"measuredAt":"2018-03-31T07:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.56,"measuredAt":"2018-03-31T07:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.7,"measuredAt":"2018-03-31T07:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.6,"measuredAt":"2018-03-31T07:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.65,"measuredAt":"2018-03-31T07:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.58,"measuredAt":"2018-03-31T07:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.67,"measuredAt":"2018-03-31T07:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.61,"measuredAt":"2018-03-31T07:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.61,"measuredAt":"2018-03-31T07:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.64,"measuredAt":"2018-03-31T08:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.49,"measuredAt":"2018-03-31T08:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.6,"measuredAt":"2018-03-31T08:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.58,"measuredAt":"2018-03-31T08:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.59,"measuredAt":"2018-03-31T08:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.56,"measuredAt":"2018-03-31T08:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.59,"measuredAt":"2018-03-31T08:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.54,"measuredAt":"2018-03-31T08:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.62,"measuredAt":"2018-03-31T08:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.41,"measuredAt":"2018-03-31T08:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.58,"measuredAt":"2018-03-31T08:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.44,"measuredAt":"2018-03-31T08:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.56,"measuredAt":"2018-03-31T09:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.36,"measuredAt":"2018-03-31T09:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.53,"measuredAt":"2018-03-31T09:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.33,"measuredAt":"2018-03-31T09:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.51,"measuredAt":"2018-03-31T09:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.25,"measuredAt":"2018-03-31T09:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.45,"measuredAt":"2018-03-31T09:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.26,"measuredAt":"2018-03-31T09:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.4,"measuredAt":"2018-03-31T09:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.2,"measuredAt":"2018-03-31T09:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.36,"measuredAt":"2018-03-31T09:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.17,"measuredAt":"2018-03-31T09:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.31,"measuredAt":"2018-03-31T10:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.18,"measuredAt":"2018-03-31T10:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.28,"measuredAt":"2018-03-31T10:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.11,"measuredAt":"2018-03-31T10:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.21,"measuredAt":"2018-03-31T10:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.12,"measuredAt":"2018-03-31T10:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.21,"measuredAt":"2018-03-31T10:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.06,"measuredAt":"2018-03-31T10:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.14,"measuredAt":"2018-03-31T10:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.05,"measuredAt":"2018-03-31T10:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.08,"measuredAt":"2018-03-31T10:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.05,"measuredAt":"2018-03-31T10:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.03,"measuredAt":"2018-03-31T11:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":36.04,"measuredAt":"2018-03-31T11:00:00Z"}]
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

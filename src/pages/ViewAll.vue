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
                        <v-card class="" v-if="chartData.temperature">
                              <!-- <duration-selector :duration.sync="duration" /> -->
                              <!-- <v-btn-toggle mandatory v-model="chartType" class="mt-2 mb-2">
                                <v-btn flat value="column">
                                    <span>Column</span>
                                </v-btn>
                                <v-btn flat value="line">
                                    <span>Line</span>
                                </v-btn>
                                <v-btn flat value="scatter">
                                    <span>Scatter</span>
                                </v-btn>
                            </v-btn-toggle> -->
                            <highcharts :options="chartData.temperature"></highcharts>
                          </v-card>
                      </div>
                    </div>
                    <div class="div-block-11">
                      <div class="div-block-16">
                              <v-card class="" v-if="chartData.temperature && chartData.humidity">
                                <!-- <duration-selector :duration.sync="duration" /> -->
                                <!-- <v-btn-toggle mandatory v-model="chartType" class="mt-2 mb-2">
                                  <v-btn flat value="column">
                                      <span>Column</span>
                                  </v-btn>
                                  <v-btn flat value="line">
                                      <span>Line</span>
                                  </v-btn>
                                  <v-btn flat value="scatter">
                                      <span>Scatter</span>
                                  </v-btn>
                                </v-btn-toggle> -->
                                <highcharts :options="chartData.temperature"></highcharts>
                              </v-card>
                          
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
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import { toFixedNumber } from '@/util'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/view-all', class:''},
          {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'View', icon:'003-signs.png', path:'/view-all' , class:'w--current'},

        ]
      return {
        
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
        measures: [],
        sensorTypes: [],
        alarmEvents: [],
        alarmRules: [],
        loading: { list: true, info: false },
        // headers: [{text: '센서ID', value: 'id', align: 'center'}],
        node_headers: [{text: '데이터', value: 'info', align: 'center'}, {text: '값', value: 'info', align: 'center'}],
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
      this.getSensorTypes()
      this.getChartData()
    },
    methods: {
      setZoneLocal: function(zone) {
        var self=this;
        // self.$store.zone = null
        // self.$store.dispatch('setZone', { zoneId: zone.id, shouldClear: false})
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
				chart: { type: this.chartType, zoomType: 'x' },
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
			      title: { text: yAxisTitle },
				  min, max
				},
			    tooltip: { valueSuffix: unit },
			    legend: {
			      layout: 'vertical',
			      align: 'right',
			      verticalAlign: 'middle',
			      borderWidth: 0
				},
				plotOptions: {
				  scatter: {
            marker: {
                radius: 2,
                states: {
                    hover: {
                        enabled: true,
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.key}</b><br>',
                pointFormat: '{series.name} {point.y}{unit}'
            }
        	}
				},
				series: [{
				name: seriesTitle,
        color,
        measures:{},
        data: measures.map(measure => [moment(measure.measuredAt).valueOf(), toFixedNumber(measure.value, 2)])
				}]
			}
    },
    getMinMax(uid, minmax) {
			const sensorType = this.sensorTypes.find(element => element.sensorType.uid === uid) || {}
			return sensorType[minmax] || 0
		},
    getChartData() {
      this.measures = [{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":null,"measuredAt":"2018-03-31T02:56:47.062141Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":null,"measuredAt":"2018-03-31T02:56:47.062141Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.15,"measuredAt":"2018-03-31T03:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.86,"measuredAt":"2018-03-31T03:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.2,"measuredAt":"2018-03-31T03:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.88,"measuredAt":"2018-03-31T03:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.24,"measuredAt":"2018-03-31T03:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.89,"measuredAt":"2018-03-31T03:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.29,"measuredAt":"2018-03-31T03:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.9,"measuredAt":"2018-03-31T03:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.34,"measuredAt":"2018-03-31T03:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.89,"measuredAt":"2018-03-31T03:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.39,"measuredAt":"2018-03-31T03:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.89,"measuredAt":"2018-03-31T03:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.44,"measuredAt":"2018-03-31T04:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.87,"measuredAt":"2018-03-31T04:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.49,"measuredAt":"2018-03-31T04:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.86,"measuredAt":"2018-03-31T04:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.54,"measuredAt":"2018-03-31T04:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.85,"measuredAt":"2018-03-31T04:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.58,"measuredAt":"2018-03-31T04:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.82,"measuredAt":"2018-03-31T04:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.63,"measuredAt":"2018-03-31T04:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.82,"measuredAt":"2018-03-31T04:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.69,"measuredAt":"2018-03-31T04:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.79,"measuredAt":"2018-03-31T04:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.74,"measuredAt":"2018-03-31T05:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.78,"measuredAt":"2018-03-31T05:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.81,"measuredAt":"2018-03-31T05:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.76,"measuredAt":"2018-03-31T05:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.87,"measuredAt":"2018-03-31T05:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.75,"measuredAt":"2018-03-31T05:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.92,"measuredAt":"2018-03-31T05:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.72,"measuredAt":"2018-03-31T05:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.95,"measuredAt":"2018-03-31T05:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.71,"measuredAt":"2018-03-31T05:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.99,"measuredAt":"2018-03-31T05:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.67,"measuredAt":"2018-03-31T05:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.04,"measuredAt":"2018-03-31T06:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.63,"measuredAt":"2018-03-31T06:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.07,"measuredAt":"2018-03-31T06:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.63,"measuredAt":"2018-03-31T06:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.1,"measuredAt":"2018-03-31T06:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.58,"measuredAt":"2018-03-31T06:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.12,"measuredAt":"2018-03-31T06:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.55,"measuredAt":"2018-03-31T06:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.15,"measuredAt":"2018-03-31T06:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.52,"measuredAt":"2018-03-31T06:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.16,"measuredAt":"2018-03-31T06:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.47,"measuredAt":"2018-03-31T06:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.18,"measuredAt":"2018-03-31T07:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.44,"measuredAt":"2018-03-31T07:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.19,"measuredAt":"2018-03-31T07:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.42,"measuredAt":"2018-03-31T07:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.2,"measuredAt":"2018-03-31T07:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.38,"measuredAt":"2018-03-31T07:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.23,"measuredAt":"2018-03-31T07:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.34,"measuredAt":"2018-03-31T07:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.25,"measuredAt":"2018-03-31T07:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.31,"measuredAt":"2018-03-31T07:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.25,"measuredAt":"2018-03-31T07:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.28,"measuredAt":"2018-03-31T07:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.26,"measuredAt":"2018-03-31T08:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.23,"measuredAt":"2018-03-31T08:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.26,"measuredAt":"2018-03-31T08:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.23,"measuredAt":"2018-03-31T08:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.27,"measuredAt":"2018-03-31T08:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.18,"measuredAt":"2018-03-31T08:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.27,"measuredAt":"2018-03-31T08:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.16,"measuredAt":"2018-03-31T08:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.27,"measuredAt":"2018-03-31T08:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.13,"measuredAt":"2018-03-31T08:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.25,"measuredAt":"2018-03-31T08:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.1,"measuredAt":"2018-03-31T08:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.25,"measuredAt":"2018-03-31T09:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.05,"measuredAt":"2018-03-31T09:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.22,"measuredAt":"2018-03-31T09:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.02,"measuredAt":"2018-03-31T09:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.19,"measuredAt":"2018-03-31T09:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":35.0,"measuredAt":"2018-03-31T09:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.16,"measuredAt":"2018-03-31T09:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.97,"measuredAt":"2018-03-31T09:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.13,"measuredAt":"2018-03-31T09:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.93,"measuredAt":"2018-03-31T09:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.09,"measuredAt":"2018-03-31T09:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.94,"measuredAt":"2018-03-31T09:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.05,"measuredAt":"2018-03-31T10:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.93,"measuredAt":"2018-03-31T10:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":26.0,"measuredAt":"2018-03-31T10:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.91,"measuredAt":"2018-03-31T10:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.95,"measuredAt":"2018-03-31T10:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.62,"measuredAt":"2018-03-31T10:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.91,"measuredAt":"2018-03-31T10:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.55,"measuredAt":"2018-03-31T10:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.87,"measuredAt":"2018-03-31T10:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.57,"measuredAt":"2018-03-31T10:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.83,"measuredAt":"2018-03-31T10:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.56,"measuredAt":"2018-03-31T10:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.79,"measuredAt":"2018-03-31T11:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.49,"measuredAt":"2018-03-31T11:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.74,"measuredAt":"2018-03-31T11:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.5,"measuredAt":"2018-03-31T11:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.7,"measuredAt":"2018-03-31T11:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.47,"measuredAt":"2018-03-31T11:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.66,"measuredAt":"2018-03-31T11:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.46,"measuredAt":"2018-03-31T11:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.62,"measuredAt":"2018-03-31T11:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.4,"measuredAt":"2018-03-31T11:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.57,"measuredAt":"2018-03-31T11:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.38,"measuredAt":"2018-03-31T11:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.54,"measuredAt":"2018-03-31T12:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.34,"measuredAt":"2018-03-31T12:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.5,"measuredAt":"2018-03-31T12:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.32,"measuredAt":"2018-03-31T12:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.47,"measuredAt":"2018-03-31T12:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.29,"measuredAt":"2018-03-31T12:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.44,"measuredAt":"2018-03-31T12:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.22,"measuredAt":"2018-03-31T12:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.41,"measuredAt":"2018-03-31T12:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.2,"measuredAt":"2018-03-31T12:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.39,"measuredAt":"2018-03-31T12:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.16,"measuredAt":"2018-03-31T12:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.36,"measuredAt":"2018-03-31T13:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.1,"measuredAt":"2018-03-31T13:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.34,"measuredAt":"2018-03-31T13:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.1,"measuredAt":"2018-03-31T13:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.31,"measuredAt":"2018-03-31T13:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.07,"measuredAt":"2018-03-31T13:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.29,"measuredAt":"2018-03-31T13:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.06,"measuredAt":"2018-03-31T13:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.27,"measuredAt":"2018-03-31T13:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.06,"measuredAt":"2018-03-31T13:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.25,"measuredAt":"2018-03-31T13:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.05,"measuredAt":"2018-03-31T13:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.24,"measuredAt":"2018-03-31T14:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.01,"measuredAt":"2018-03-31T14:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.21,"measuredAt":"2018-03-31T14:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.01,"measuredAt":"2018-03-31T14:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.2,"measuredAt":"2018-03-31T14:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.02,"measuredAt":"2018-03-31T14:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.18,"measuredAt":"2018-03-31T14:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.02,"measuredAt":"2018-03-31T14:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.16,"measuredAt":"2018-03-31T14:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.02,"measuredAt":"2018-03-31T14:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.15,"measuredAt":"2018-03-31T14:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.02,"measuredAt":"2018-03-31T14:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.13,"measuredAt":"2018-03-31T15:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.02,"measuredAt":"2018-03-31T15:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.12,"measuredAt":"2018-03-31T15:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.03,"measuredAt":"2018-03-31T15:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.1,"measuredAt":"2018-03-31T15:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.04,"measuredAt":"2018-03-31T15:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.1,"measuredAt":"2018-03-31T15:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.04,"measuredAt":"2018-03-31T15:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.09,"measuredAt":"2018-03-31T15:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.05,"measuredAt":"2018-03-31T15:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.07,"measuredAt":"2018-03-31T15:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.07,"measuredAt":"2018-03-31T15:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.06,"measuredAt":"2018-03-31T16:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.07,"measuredAt":"2018-03-31T16:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.05,"measuredAt":"2018-03-31T16:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.08,"measuredAt":"2018-03-31T16:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.04,"measuredAt":"2018-03-31T16:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.09,"measuredAt":"2018-03-31T16:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.02,"measuredAt":"2018-03-31T16:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.12,"measuredAt":"2018-03-31T16:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.01,"measuredAt":"2018-03-31T16:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.11,"measuredAt":"2018-03-31T16:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.01,"measuredAt":"2018-03-31T16:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.12,"measuredAt":"2018-03-31T16:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.01,"measuredAt":"2018-03-31T17:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.12,"measuredAt":"2018-03-31T17:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.99,"measuredAt":"2018-03-31T17:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.14,"measuredAt":"2018-03-31T17:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.98,"measuredAt":"2018-03-31T17:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.15,"measuredAt":"2018-03-31T17:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.98,"measuredAt":"2018-03-31T17:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.16,"measuredAt":"2018-03-31T17:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.97,"measuredAt":"2018-03-31T17:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.18,"measuredAt":"2018-03-31T17:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.97,"measuredAt":"2018-03-31T17:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.18,"measuredAt":"2018-03-31T17:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.97,"measuredAt":"2018-03-31T18:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.17,"measuredAt":"2018-03-31T18:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.96,"measuredAt":"2018-03-31T18:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.19,"measuredAt":"2018-03-31T18:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.95,"measuredAt":"2018-03-31T18:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.21,"measuredAt":"2018-03-31T18:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.94,"measuredAt":"2018-03-31T18:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.22,"measuredAt":"2018-03-31T18:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.94,"measuredAt":"2018-03-31T18:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.23,"measuredAt":"2018-03-31T18:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.93,"measuredAt":"2018-03-31T18:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.26,"measuredAt":"2018-03-31T18:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.94,"measuredAt":"2018-03-31T19:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.24,"measuredAt":"2018-03-31T19:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.93,"measuredAt":"2018-03-31T19:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.26,"measuredAt":"2018-03-31T19:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.92,"measuredAt":"2018-03-31T19:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.27,"measuredAt":"2018-03-31T19:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.91,"measuredAt":"2018-03-31T19:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.27,"measuredAt":"2018-03-31T19:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.92,"measuredAt":"2018-03-31T19:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.29,"measuredAt":"2018-03-31T19:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.91,"measuredAt":"2018-03-31T19:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.3,"measuredAt":"2018-03-31T19:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.9,"measuredAt":"2018-03-31T20:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.3,"measuredAt":"2018-03-31T20:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.9,"measuredAt":"2018-03-31T20:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.29,"measuredAt":"2018-03-31T20:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.89,"measuredAt":"2018-03-31T20:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.31,"measuredAt":"2018-03-31T20:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.89,"measuredAt":"2018-03-31T20:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.31,"measuredAt":"2018-03-31T20:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.9,"measuredAt":"2018-03-31T20:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.31,"measuredAt":"2018-03-31T20:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.88,"measuredAt":"2018-03-31T20:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.34,"measuredAt":"2018-03-31T20:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.88,"measuredAt":"2018-03-31T21:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.33,"measuredAt":"2018-03-31T21:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.87,"measuredAt":"2018-03-31T21:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.33,"measuredAt":"2018-03-31T21:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.87,"measuredAt":"2018-03-31T21:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.36,"measuredAt":"2018-03-31T21:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.86,"measuredAt":"2018-03-31T21:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.36,"measuredAt":"2018-03-31T21:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.86,"measuredAt":"2018-03-31T21:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.37,"measuredAt":"2018-03-31T21:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.85,"measuredAt":"2018-03-31T21:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.36,"measuredAt":"2018-03-31T21:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.85,"measuredAt":"2018-03-31T22:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.39,"measuredAt":"2018-03-31T22:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.84,"measuredAt":"2018-03-31T22:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.38,"measuredAt":"2018-03-31T22:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.84,"measuredAt":"2018-03-31T22:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.4,"measuredAt":"2018-03-31T22:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.84,"measuredAt":"2018-03-31T22:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.41,"measuredAt":"2018-03-31T22:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.84,"measuredAt":"2018-03-31T22:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.41,"measuredAt":"2018-03-31T22:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.83,"measuredAt":"2018-03-31T22:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.43,"measuredAt":"2018-03-31T22:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-03-31T23:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.45,"measuredAt":"2018-03-31T23:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-03-31T23:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.47,"measuredAt":"2018-03-31T23:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-03-31T23:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.5,"measuredAt":"2018-03-31T23:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-03-31T23:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.53,"measuredAt":"2018-03-31T23:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-03-31T23:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.52,"measuredAt":"2018-03-31T23:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-03-31T23:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.55,"measuredAt":"2018-03-31T23:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-04-01T00:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.58,"measuredAt":"2018-04-01T00:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.82,"measuredAt":"2018-04-01T00:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.59,"measuredAt":"2018-04-01T00:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.83,"measuredAt":"2018-04-01T00:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.6,"measuredAt":"2018-04-01T00:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.83,"measuredAt":"2018-04-01T00:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.64,"measuredAt":"2018-04-01T00:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.84,"measuredAt":"2018-04-01T00:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.65,"measuredAt":"2018-04-01T00:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.85,"measuredAt":"2018-04-01T00:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.66,"measuredAt":"2018-04-01T00:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.86,"measuredAt":"2018-04-01T01:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.64,"measuredAt":"2018-04-01T01:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.87,"measuredAt":"2018-04-01T01:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.61,"measuredAt":"2018-04-01T01:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.89,"measuredAt":"2018-04-01T01:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.6,"measuredAt":"2018-04-01T01:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.9,"measuredAt":"2018-04-01T01:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.59,"measuredAt":"2018-04-01T01:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.92,"measuredAt":"2018-04-01T01:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.62,"measuredAt":"2018-04-01T01:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.93,"measuredAt":"2018-04-01T01:50:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.67,"measuredAt":"2018-04-01T01:50:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.95,"measuredAt":"2018-04-01T02:00:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.73,"measuredAt":"2018-04-01T02:00:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.97,"measuredAt":"2018-04-01T02:10:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.79,"measuredAt":"2018-04-01T02:10:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":24.99,"measuredAt":"2018-04-01T02:20:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.85,"measuredAt":"2018-04-01T02:20:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.0,"measuredAt":"2018-04-01T02:30:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.87,"measuredAt":"2018-04-01T02:30:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":25.03,"measuredAt":"2018-04-01T02:40:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":34.88,"measuredAt":"2018-04-01T02:40:00Z"},{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"value":null,"measuredAt":"2018-04-01T02:56:00Z"},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"value":null,"measuredAt":"2018-04-01T02:56:00Z"}]
      this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', this.getMinMax('temperature', 'min_value'), this.getMinMax('temperature', 'max_value'), '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
      this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', this.getMinMax('humidity', 'min_value'), this.getMinMax('humidity', 'max_value'), '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')
      console.log(this.chartData);
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

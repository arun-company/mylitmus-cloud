<template>
  <div class="section">
    <div class="div-block-3 home">
      <div class="div-block-4">
          <router-link class="link" to="/">
            Home
          </router-link>
        <div class="text-block-5">&gt;</div>
          <router-link to="/site" class="link">
            Default
          </router-link>
        <div class="text-block-5">&gt;</div>
        <div v-if="zonename" class="text-block-5">{{zonename}}</div>
      </div>
      <div class="div-block-4 search">
        <input id="search-box" keyup="reverseMessage" v-model="search" class="w-input" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
    </div>

    <div class="w-container">
      <h1 class="heading">{{zonename}}</h1>
    </div>
    <div class="div-block-5">
      <div class="text-block-4" style="width: 100%; height: 100%;">
        <node-map @onSelectNode="selectNode($event.id)"></node-map>
      </div>
    </div>
  
    <div class="div-block-9">
      <div class="div-block-2 w-inline-block" v-for="(key,index) in filteredItems" v-bind:key="index" >
        <div  @click="selectNode(key.id)" @click.stop="dialog = true" class="text-block-3">{{ key.name }}</div> 
      </div>
    </div>

    <div>
    <v-layout>
      <v-dialog
        v-model="dialog"
        :fullscreen="true"
        transition="dialog-bottom-transition"
      >
        <v-card tile >
          
          <v-slide-y-transition mode="out-in">
            <v-layout grid-list-lg text-xs-center>
              <v-layout row wrap>
                <v-flex xs10 offset-xs1 popup-box >
                  <v-toolbar card color="primary">
                    <v-btn icon @click.native="dialog = false">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-layout row wrap>
                    <v-progress-linear v-bind:indeterminate="true" v-if="loading.info"></v-progress-linear>
                    <v-flex xs4 v-for="info in node_info" :key="info ? info.key : null" v-if="card">
                      <text-card size="4" :data="info ? { desc: info.key, value: info.value, subtitle: info.subtitle } : null"></text-card>
                    </v-flex>
                  </v-layout>
                  <v-card class="mt-2" v-if="chartData.temperature && chartData.humidity">
                    <duration-selector :duration.sync="duration" />
                    <v-btn-toggle mandatory v-model="chartType" class="mt-2 mb-2">
                      <v-btn flat value="column">
                          <span>Column</span>
                      </v-btn>
                      <v-btn flat value="line">
                          <span>Line</span>
                      </v-btn>
                      <v-btn flat value="scatter">
                          <span>Scatter</span>
                      </v-btn>
                    </v-btn-toggle>
                    <highcharts :options="chartData.temperature"></highcharts>
                    <highcharts :options="chartData.humidity"></highcharts>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-slide-y-transition>

          <div style="flex: 1 1 auto;"/>
        </v-card>
      </v-dialog>
      
    
    </v-layout>
  </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import { API_BASE, DASHBOARD_REFRESH_TIME } from '@/global'
  import NodeMap from '@/components/NodeMap'
  import DurationSelector from '@/components/DurationSelector'
  import { toFixedNumber } from '@/util'
  export default {
    props: ['id'],
    components: { EventGraph, TextCard, ServiceStatusBar,NodeMap,DurationSelector  },
    data () {
        this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/zone', class:''},
          {id:3, name:'Reporting', icon:'002-sign.png', path:'/report', class:''},
          {id:4, name:'Notifications', icon:'004-alarm-clock.png', path:'/alarmrules' , class:''},
          {id:5, name:'Settings', icon:'001-cogwheel.png', path:'/settings', class:''},
        ]
        events_grouped_by_id: [];
        this.$store.state.menu = true
        var zoneObj=null
        if (localStorage.getItem('zone'))
          zoneObj = JSON.parse(localStorage.getItem('zone'))
        var zonename=null
        if (localStorage.getItem('zonename'))
            zonename = localStorage.getItem('zonename')
        return {
          zoneId : localStorage.getItem('zoneid'),
          search: '',
          sensors:[],
          zone: zoneObj,
          zonename: zonename,
          searchTitle: "Search sensors ...",
          items: [],
          node: null,
          measures: [],
          sensorTypes: [],
          alarmEvents: [],
          alarmRules: [],
          loading: { list: true, info: false },
          headers: [{text: '센서ID', value: 'id', align: 'center'}],
          node_headers: [{text: '데이터', value: 'info', align: 'center'}, {text: '값', value: 'info', align: 'center'}],
          duration: '-24h',
          chartType: 'line',
          chartData: { 'temperature': null, 'humidity': null },
          card: false,
          dialog: false,
        }
      },
      watch: {
        '$store.state.zone': function () {
          this.getSensorTypes()
        },
        id: function () {
          this.selectNode(this.id)
        },
        duration: function () {
          this.getMeasuresFromRemote(this.id)
        },
        chartType: function () {
          this.getMeasuresFromRemote(this.id)
        },
      },
      id: function () {
			  this.selectNode(this.id)
		  },
      computed:
      {
        filteredItems:function()
        {
          var self=this;
          return this.items.filter(function(item){
            if (item.name)
              return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;
            
            }
          );
        },
        node_info () {
          if (!this.node) { return new Array(3) }
          return [
            {key: '센서 이름', value: this.node.name, subtitle: this.node.name === this.node.id ?  '' : `(${this.node.id})`},
            {key: '온도', value: `${this.getMeasureString(this.node, 'temperature')}`},
            {key: '습도', value: `${this.getMeasureString(this.node, 'humidity')}`},
          ]
        }

      },
      mounted () {
        this.$store.dispatch('setZone', { zoneId: this.zoneId, shouldClear: false})
    	  this.getSummaryValue()
      },
      methods: {
    	getSummaryValue () {
        const EVENT_API = `${API_BASE}/zones/${this.zoneId}/nodes`
        axios.get(EVENT_API).then(res => {
          this.items = res.data 
        })

        const GET_ZONE = `${API_BASE}/zones/${this.zoneId}`
        axios.get(GET_ZONE,{params:{}}).then(res => {
          this.zone = res.data
        })
        const ALARMS_API = `${API_BASE}/zones/${this.zone.id}/alarmRules`
        axios.get(ALARMS_API).then(res => {
          this.alarmRules = res.data.alarmRules
          this.eventSeries = this.alarmRules.map(rule => ({
            name: rule.name, data: [], color: rule.color,
          }))
          if (this.eventSeries.length < 1) {
            this.alarmRules = null
            this.eventSeries = []
            this.eventChartData = null
            return
          }
          const EVENT_TIMESERIES_API = `${API_BASE}/zones/${this.zoneId}/alarmEvents/timeSeries`
          axios.get(EVENT_TIMESERIES_API, { params: { dateFrom: '-24h' }}).then(res => {
            this.eventChartData = this.chart_data('알람 현황', res.data.timeSeries)
          })
        })
      },
      getSensorTypes() {     
        this.chartData = {}
        const SENSOR_MIN_MAX_API = `${API_BASE}/zones/${this.zoneId}/sensorTypes`;
        axios.get(SENSOR_MIN_MAX_API).then(res => {
          this.sensorTypes = res.data
        })
		  },
		selectNode(id) {
			this.chartData = {}
			this.node = null


			if (id !== this.id) {
				this.$router.push(`/zone/${id}`)
			}
			
      this.loading.info = true
      this.card = true
			const NODE_API = `${API_BASE}/nodes/${id}`
			axios.get(NODE_API).then(res => {
				this.node = res.data
			});
			this.getMeasuresFromRemote(id)
		},
		getMeasuresFromRemote(id) {
      // var zoneid = localStorage.getItem('zoneid')
			this.loading.info = true
			const NODE_MEASURES_API = `${API_BASE}/nodes/${id}/measures`
			const EVENTS_API = `${API_BASE}/zones/${this.zoneId}/alarmEvents`
			const RULES_API = `${API_BASE}/zones/${this.zoneId}/alarmRules`
			axios.all([
				axios.get(NODE_MEASURES_API, { params: { dateFrom: this.duration }}),
				axios.get(EVENTS_API, { params: { dateFrom: this.duration }}),
				axios.get(RULES_API),
			]).then(res => {
				this.measures = res[0].data.measures
				this.alarmEvents = res[1].data.filter(event => event.nodeId === id)
				this.alarmRules = res[2].data.alarmRules
				this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', this.getMinMax('temperature', 'min_value'), this.getMinMax('temperature', 'max_value'), '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
				this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', this.getMinMax('humidity', 'min_value'), this.getMinMax('humidity', 'max_value'), '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')
				this.loading.info = false
			});
		},
		getMeasureString(node, measureType) {
			const measure = this.node.currentMeasures.find(measure => measure.uid === measureType)
			if (!measure) { return '값 없음' }
			return `${measure.value.toFixed(2)}${measure.unit}`
		},
		getMinMax(uid, minmax) {
			const sensorType = this.sensorTypes.find(element => element.sensorType.uid === uid) || {}
			return sensorType[minmax] || 0
		},
		chart_data(title, yAxisTitle, color, min, max, unit, seriesTitle, measures, sensorType) {
			// TODO 알람이 과거에는 존재하고 현재 없어진 경우, plotband subtitle에는 표시되지 않는 이슈가 있다.
			return {
				chart: { type: this.chartType, zoomType: 'x' },
				title: { text: title },
				subtitle: {
				  text: this.alarmRules.filter(rule => rule.sensorType.uid === sensorType).map(rule => `<span style="background-color: ${rule.color || '#FFC4C4'}; margin: 2px;">${rule.name}</span>`).join(''),
				  useHTML: true,
				  verticalAlign: 'bottom'
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
					data: measures.map(measure => [moment(measure.measuredAt).valueOf(), toFixedNumber(measure.value, 2)])
				}]
			}
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
		getBandColor(event) {
			const rule = this.alarmRules.find(rule => rule.name === event.alarmName) || {}
			return rule.color || '#FFC4C4'
		},
      add_count(timeSeries) {
        timeSeries.forEach(series => {
          this.eventSeries.forEach(group => {
            const foundEvent = series.alarmEvents.find(event => event.alarmName === group.name)
            group.data.push(foundEvent ? [moment(series.measuredAt).valueOf(), foundEvent.nodeCount]: [moment(series.measuredAt).valueOf(), 0])
          })
        })
      }
    }


  }
</script>

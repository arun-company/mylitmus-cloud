<template>
  <div class="section">
    <div class="div-block-3 home">
      <div class="div-block-4">
          <router-link class="link" to="/">
            홈
          </router-link>
        <div class="text-block-5">&gt;</div>
          <router-link to="/site" class="link">
            Default
          </router-link>
        <div class="text-block-5">&gt;</div>
        <div v-if="zonename" class="text-block-5">{{zonename}}</div>
      </div>
      <div class="div-block-4 search">
        <input id="search-box" keyup="reverseMessage" v-model="search" class="w-input" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image" title="검색"></a></div>
    </div>

    <div class="w-container">
      <h1 class="heading">{{zonename}}</h1>
    </div>
    <div class="div-block-5">
        <v-layout row wrap  v-if="loading_map">
          <v-progress-circular v-bind:indeterminate="true" size="40"></v-progress-circular>
        </v-layout>
        <node-map v-bind:imageLink="imageLink"  @onSelectNode="filterResult($event)" ></node-map>
    </div>
    <div class="div-block-9">
      <template  v-for="(key,index) in filteredItems"> 
          <v-layout v-bind:key="index+'_0'" class="hidden">{{alertTemp = getAlertTemperature(key.currentMeasures), alertHumi = getAlertHumidity(key.currentMeasures)}} {{ alert= (alertTemp || alertHumi) ? 'alerts':getAlertClass(key.currentMeasures)}} {{white=getWhiteClass(alert)}} {{activeSensor = alertSensorClass(key.activeAt)}}</v-layout>
          <div v-bind:class="getActiveClass(activeItem, key.id) + ' ' + alert + ' div-block-2 w-inline-block sensor-card'" @click.stop="setActiveItem(key.id)" v-bind:key="index+'_a'">
            <div v-bind:class="alert+' text-block-3'">{{key.name}}</div>
            <div v-bind:class="'div-block-8'">
              <div class="div-block-7"><img v-bind:src="'public/images/thermometer'+alertTemp+white+'.png'" width="20" height="20" title="온도" class="image-2">
                <div v-bind:class="alert + ' text-block-6'"> {{key.currentMeasures[0]?key.currentMeasures[0].value + key.currentMeasures[0].unit:"-"}}</div>
              </div>
              <div class="div-block-7"><img v-bind:src="'public/images/humidity'+alertHumi+white+'.png'" width="20" height="20" title="습도">
                <div v-bind:class="alert + ' text-block-6'"> {{key.currentMeasures[1]?key.currentMeasures[1].value + key.currentMeasures[1].unit:"-"}}</div>
              </div>
              <div class="div-block-7"><img v-bind:src="'public/images/battery'+white+'.png'" width="20" height="20" title="배터리" class="image-3">
              <img v-bind:src="'public/images/working'+activeSensor+white+'.png'" width="20" height="20" title="센서 작동 상태" class="image-3"></div>
            </div>
            <div class="div-block-8">
              <div class="div-block-7 zoneexpand" ><img v-bind:class="getActiveClass(activeItem, key.id)" v-bind:src="'public/images/expand'+white+'.png'" width="20" height="20"></div>
            </div>
          </div>
          <div class="card-detail-1" v-bind:key="index+'_b'">
             <v-container fluid v-if="key.id == activeItem">
                  <v-layout row wrap>
                    
                    <v-progress-circular v-bind:indeterminate="true" style="{color:red;}" v-if="loading.info"></v-progress-circular>
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
             </v-container>
          </div>
          <div class="card-detail-2" v-if="(index+1)%2 == 0 || (index+1) == filteredItems.length" v-bind:key="index+'_c'">
               <v-container  fluid v-if="key.id == activeItem || (index%2 > 0 && filteredItems[index-1].id == activeItem)">
                  <v-layout row wrap>
                    <v-progress-circular v-bind:indeterminate="true" style="{color:red;}" v-if="loading.info"></v-progress-circular>
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
             </v-container>
          </div>
          
          <div class="card-detail-3" v-if="(index+1)%3 == 0 || (index+1) == filteredItems.length" v-bind:key="index+'_d'">
             <v-container fluid v-if="key.id == activeItem || (index%3 > 0 && filteredItems[index-1].id == activeItem) || (index%3 > 1 && filteredItems[index-2].id == activeItem)">
                  <v-layout row wrap>
                    <v-progress-circular v-bind:indeterminate="true" size="40"  v-if="loading.info"></v-progress-circular>
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
             </v-container>
          </div>
          <div class="card-detail-4" v-if="(index+1)%4 == 0 || (index+1) == filteredItems.length" v-bind:key="index+'_e'">
             <v-container fluid v-if="(key.id == activeItem) || ((index%4 > 0)  && (filteredItems[index-1].id == activeItem)) || (index%4 > 1 && filteredItems[index-2].id == activeItem) || (index%4 > 2 && filteredItems[index-3].id == activeItem)">
                  <v-layout row wrap>
                    <v-progress-circular v-bind:indeterminate="true" size="40" v-if="loading.info"></v-progress-circular>
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
             </v-container>
          </div>
      </template>
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
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/zone', class:'w--current'},
          {id:3, name:'보고서', icon:'004-profit-report.png', path:'/zone-reporting', class:''},
          {id:4, name:'알림', icon:'notificationsalerts.fff.png', path:'/zone-notifications' , class:''},
          {id:5, name:'설정', icon:'001-cogwheel.png', path:'/zone-settings', class:''},
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
          imageLink:'',
          loading_map:true,
          zonename: zonename,
          searchTitle: "센서 검색 ...",
          items: [],
          activeItem: null,
          node: null,
          measures: [],
          sensorTypes: [],
          alarmEvents: [],
          alarmRules: [],
          loading: { list: true, info: false },
          headers: [{text: '센서ID', value: 'id', align: 'center'}],
          duration: '-24h',
          chartType: 'line',
          chartData: { 'temperature': null, 'humidity': null },
          card: false,
          dialog: false,
          tempMin: null,
          tempMax: null,
          humiMin: null,
          humiMax: null,
          sNodes:[]
        }
      },
      watch: {
        '$store.state.zone': function () {
          this.getSensorTypes()
          this.getMeasuresFromRemote(this.id)
          this.imageLink = this.$store.state.zone.floor_map
          this.loading_map = false
          // this.setActiveItem(this.id)
        },
        // id: function () {
        //   this.selectNode(this.id)
        // },
        duration: function () {
          this.getMeasuresFromRemote(this.id)
        },
        chartType: function () {
          this.getMeasuresFromRemote(this.id)
        },
      },
      // id: function () {
			//   this.selectNode(this.id)
		  // },
      computed:
      {
        filteredItems:function()
        {
          var self=this;
          return self.items.filter(function(item) {
            if (self.sNodes.length) {
              return self.sNodes.indexOf(item.id) >= 0 && item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;
            }
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
        this.getMeasuresFromRemote(this.id)
        this.setActiveItem(this.id)
        
      },
      methods: {
        filterResult(selectedNodes) {
          this.sNodes = selectedNodes
          return;
          this.items.filter(function(item){
            
            // console.log(selectedNodes)
            console.log(selectedNodes.indexOf(item.id) >= 0)
            if (item.id)
              return selectedNodes.indexOf(item.id) > 0;
            }
          )
          console.log(this.items)
        },
         setAlameRule(alarm_rules) {
          for(var i=0; i<alarm_rules.length; i++) {
            if (alarm_rules[i].sensorType.uid == 'temperature') {
              this.checkTempartureRule(alarm_rules[i].rule)
            } else if (alarm_rules[i].sensorType.uid == 'humidity'){
              this.checkHumidityRule(alarm_rules[i].rule)
            }
          }
        },
        checkTempartureRule(rule_condition) {
          var rule_value = rule_condition.split('value ')[1]
          if (rule_value.indexOf(">") >= 0) {
                this.tempMax = rule_value.split('>')[1] * 1
          }
            
          if(rule_value.indexOf("<") >= 0) {
            this.tempMin = rule_value.split('<')[1] * 1
          }
            
      },
      checkHumidityRule(rule_condition) {
          var rule_value = rule_condition.split('value ')[1]
          if ( rule_value.indexOf(">") >= 0)
              this.humiMax = rule_value.split('>')[1] * 1
          if( rule_value.indexOf("<") >= 0) 
            this.humiMin = rule_value.split('<')[1] * 1
      },
      getAlertTemperature(currentMeasures) {
        if (currentMeasures && currentMeasures[0]) {
            if (this.tempMin && this.tempMax)
              return currentMeasures[0].value > this.tempMin && currentMeasures[0].value < this.tempMax? "":"alerts"
            else if (this.tempMin)
              return currentMeasures[0].value > this.tempMin ? "":"alerts"
            else if (this.tempMax)
              return currentMeasures[0].value < this.tempMax ? "":"alerts"
        }
        return ''
      },
      getAlertHumidity(currentMeasures) {
        if (currentMeasures && currentMeasures[1]) {
            if (this.humiMin && this.humiMax)
              return currentMeasures[1].value > this.humiMin && currentMeasures[1].value < this.humiMax ? "":"alerts"
            else if (this.humiMin)
              return currentMeasures[1].value > this.humiMin ? "":"alerts"
            else if (this.humiMax)
              return currentMeasures[1].value < this.humiMax ? "":"alerts"
        }
        return ''
      },
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
          this.setAlameRule(this.alarmRules)
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
      if (this.id == this.activeItem) {
        // alert("Hello World")
        this.activeIte=null
        return ''
      }
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
      if (!(id * 1)) return ''
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
      setAlameRule(alarm_rules) {
          for(var i=0; i<alarm_rules.length; i++) {
            if (alarm_rules[i].sensorType.uid == 'temperature') {
              this.checkTempartureRule(alarm_rules[i].rule)
            } else if (alarm_rules[i].sensorType.uid == 'humidity'){
              this.checkHumidityRule(alarm_rules[i].rule)
            }
          }
      },
      checkTempartureRule(rule_condition) {
          var rule_value = rule_condition.split('value ')[1]
          if (rule_value.indexOf(">") >= 0) {
                this.tempMax = rule_value.split('>')[1] * 1
          }
            
          if(rule_value.indexOf("<") >= 0) {
            this.tempMin = rule_value.split('<')[1] * 1
          }
            
      },
      checkHumidityRule(rule_condition) {
          var rule_value = rule_condition.split('value ')[1]
          if ( rule_value.indexOf(">") >= 0)
              this.humiMax = rule_value.split('>')[1] * 1
          if( rule_value.indexOf("<") >= 0) 
            this.humiMin = rule_value.split('<')[1] * 1
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
        measures:{},
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
    },
    setActiveItem(nodeId) {
      if (this.activeItem == nodeId) {
        this.activeItem = null
        return
      }
      this.activeItem = nodeId
      this.selectNode(nodeId)
    },
    getActiveClass(activeItem, nodeId) {
      if (activeItem == nodeId) {
        return 'active-sensor'
      } else {
        return ''
      }
    },
    getAlertClass(checkValue) {
      return (checkValue[0]&&checkValue[1])? '':'alerts'
    },
    getWhiteClass(alertClass){
      return alertClass?".fff":""

    },
    alertSensorClass(activeDate) {
      return new Date() - new Date(activeDate) > (12 * 3600 * 1000)?'-not':''
    }

    }


  }
</script>

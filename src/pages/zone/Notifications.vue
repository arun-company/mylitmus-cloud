<template>
  <div class="section">
      <div class="div-block-3">
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
    </div>
    <div class="w-container">
      <h1 class="heading">Notifications</h1>
    </div>
    <div class="w-container">
      <div class="reporting-all">
        <div class="div-block-reporting">
          <div class="content">
            <div class="text-content">Sensor Notificaitons</div>
            <div class="div-block-12">
              <div class="div-block-11"  v-for="rule in alarmRules" :key="rule.name">
                <div class="div-block-18" >
                  <v-card>
                      <v-card-title primary-title>
                        <v-layout align-content-space-between>
                          <div class="notification-name-block">
                              <div class="notification-name-block-title"
                              :style="{
                                'border-bottom': `4px solid ${rule.color || '#FFC4C4'}`}">{{ rule.name }}
                            </div>
                            <div style="font-size:12px; line-height: 20px;">  {{ rule.sensorType.name }} </div>
                          </div>
                            <div class="text-block-8 notification">
                              {{ rule.rule.split('value ')[1] }}{{ rule.sensorType.unit }}
                            </div>
                        </v-layout>
                      </v-card-title>
                    </v-card>
                </div>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="text-content">Notification Chart</div>
            <div class="div-block-12">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-card>
                    <highcharts :options="eventChartData" v-if="eventChartData"></highcharts>
                    <div v-else-if="eventSeries && eventSeries.length === 0">알람이 설정되지 않았습니다.</div>
                    <v-layout row wrap v-else>
                      <v-progress-circular v-bind:indeterminate="true" size="40"></v-progress-circular>
                    </v-layout>


                  </v-card>
                </v-flex>
              </v-layout>
            </div>
          </div>
          <div class="content">
            <div class="text-content">Notification List</div>
            <div class="div-block-12">
              <v-layout>
                <v-flex xs12>
                  <v-data-table
                    :headers="event_table_headers"
                    :items="event_table_items"
                    hide-actions
                    class="elevation-1"
                  >
                    <template slot="items" scope="props">
                      <tr @click="$router.push(`/zone/${props.item.nodeId}`)" style="cursor: pointer">
                        <td class="text-xs-right">{{ props.item.nodeName }}</td>
                        <td class="text-xs-right">{{ props.item.value }}</td>
                        <td class="text-xs-right">{{ props.item.date }}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </div>
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

  import { API_BASE, DASHBOARD_REFRESH_TIME } from '@/global'
  import ZoneIdMixin from '@/mixins/ZoneIdMixin'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    mixins: [ZoneIdMixin],
    
    data () {
      // if (localStorage.getItem('zonename'))
      //       zonename = localStorage.getItem('zonename')
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/zone', class:''},
          {id:3, name:'Reporting', icon:'004-profit-report.png', path:'/zone-reporting', class:''},
          {id:4, name:'Notifications', icon:'notificationsalerts.fff.png', path:'/zone-notifications' , class:'w--current'},
          {id:5, name:'Settings', icon:'001-cogwheel.png', path:'/zone-settings', class:''},
        ]
      var zoneId = localStorage.getItem('zoneid');
      
      return {
        zoneId :zoneId,
        settings:null,
        sensors:null,
        alarmRules:null,
        zonename:localStorage.getItem('zonename'),
        zone: null,
      	events: [],
        alarmRules: null,
        events_grouped_by_id: [],
        events_timeseries: [],
        event_table_headers: [
          {text: '센서ID', value: 'nodeId'}, {text: '알람 값', value: 'value'}, {text: '알람 시간', value: 'insertedAt'}
        ],
        eventChartData: null,
        eventSeries: null,
        timer:null,
      }
    },
    watch: {
    	'$store.state.zone': function () {
        this.getSummaryValue()
    	}
    },
    mounted () {
      this.getSettings()
      
      var ZONE_DETAIL = `${API_BASE}/zones/`+ this.zoneId 
    	axios.get(ZONE_DETAIL).then(response => {
        this.zone = response.data
        this.getSummaryValue()
      })
    },
    destroyed () {
    	clearInterval(this.timer)
    },
    computed: {
      loading () {
        return !this.zone
      },
    	active_ratio () {
        if (this.loading) { return null }
    		return this.zone.activeNodes / this.zone.totalNodes
    	},
    	node_count_string () {
        if (this.loading) { return null }
    		return `${this.zone.activeNodes} / ${this.zone.totalNodes}`
    	},
    	event_count () {
        if (this.loading) { return null } 
    		return `${this.zone.alarmEventNodeCount} / ${this.zone.alarmEventCount}`
    	},
      event_table_items () {
        return this.events_grouped_by_id.map(event => ({
          ...event,
          date: moment(event.insertedAt).format('YYYY-MM-DD HH:mm:ss'),
          value: event.sensorType.uid ? `${event.value}${event.sensorType.unit}` : 'UNKNOWN'
        }))
      },
    },
    methods: {
    	getSummaryValue () {
        if (!this.zone) { return }
        
        const EVENT_API = `${API_BASE}/zones/${this.zone.id}/alarmEvents/spots`
        axios.get(EVENT_API, { params: { dateFrom: '-24h', nodewise: true }}).then(res => {
          this.events_grouped_by_id = res.data
        })
        const ALARMS_API = `${API_BASE}/zones/${this.zone.id}/alarmRules`
        axios.get(ALARMS_API).then(res => {
          this.alarmRules = res.data.alarmRules
          this.eventSeries = this.alarmRules.map(rule => ({
            name: rule.name, data: [], color: rule.color?rule.color:"#FFC4C4",
          }))
          if (this.eventSeries.length < 1) {
            this.alarmRules = null
            this.eventSeries = []
            this.eventChartData = null
            return
          }
          const EVENT_TIMESERIES_API = `${API_BASE}/zones/${this.zone.id}/alarmEvents/timeSeries`
          axios.get(EVENT_TIMESERIES_API, { params: { dateFrom: '-24h' }}).then(res => {
            this.eventChartData = this.chart_data('알람 현황', res.data.timeSeries)
          })
        })
    	},
    	average_string(prop) {
        if (this.loading) { return null }
        const measure = this.zone.currentMeasures.find(measure => measure.uid === prop)
        if (!measure) {
          return 'N/A'
        }
        return `${measure.value.toFixed(2)}${measure.unit}`
      },
      chart_data(title, timeSeries) {
        this.add_count(timeSeries)

        return {
          chart: {
            type: 'column'
          },
          title: { text: title },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%b %e일'
            },
          },
          yAxis: {
            allowDecimals: false,
            title: { text: '알람 갯수' },
          },
          plotOptions: {
            column: {
              stacking: 'normal',
            },
            series: {
              minPointLength: 1,
            }
          },
          series: this.eventSeries,
        }
      },
      add_count(timeSeries) {
        timeSeries.forEach(series => {
          this.eventSeries.forEach(group => {
            const foundEvent = series.alarmEvents.find(event => event.alarmName === group.name)
            group.data.push(foundEvent ? [moment(series.measuredAt).valueOf(), foundEvent.nodeCount]: [moment(series.measuredAt).valueOf(), 0])
          })
        })
      },
      getSettings () {
        var zondId = localStorage.getItem('zoneid');
        const SENSORTYPES_API = `${API_BASE}/v1/zones/${zondId}/sensorTypes`
        const ZONESENSOR = `${API_BASE}/v1/zones/${zondId}/nodes`
        const RULES_API = `${API_BASE}/zones/${zondId}/alarmRules`
        axios.all([
            axios.get(ZONESENSOR),
            axios.get(SENSORTYPES_API),
            axios.get(RULES_API),
        ]).then(
        res => {
          this.sensors = res[0].data
          this.settings = res[1].data
          this.alarmRules = res[2].data.alarmRules
        })
      }
    }
  }
</script>

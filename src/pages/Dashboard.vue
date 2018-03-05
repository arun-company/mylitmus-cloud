<template>
  <main>
  	<v-slide-y-transition mode="out-in">
  	  <v-container grid-list-lg text-xs-center>
  	  	<service-status-bar :active="!loading"
          :error="0.5" :warn="0.7" :success="1" :value="active_ratio" :text="node_count_string" />
  	    <v-layout row wrap>
  	      <v-flex xs12 sm6 md3>
            <text-card :data="average_string('temperature') ? { desc: '평균 온도', value: average_string('temperature') } : null"></text-card>
  	      </v-flex>
  	      <v-flex xs12 sm6 md3>
            <text-card :data="average_string('humidity') ? { desc: '평균 습도', value: average_string('humidity') } : null"></text-card>
  	      </v-flex>
  	    </v-layout>
        <div class="text-xs-left" style="color: gray">알람 그래프</div>
  	    <v-layout row wrap>
  	      <v-flex xs12>
  	        <v-card>
  	          <highcharts :options="eventChartData" v-if="eventChartData"></highcharts>
              <div v-else-if="eventSeries && eventSeries.length === 0">알람이 설정되지 않았습니다.</div>
              <v-progress-circular :size="100" indeterminate color="primary" v-else></v-progress-circular>
  	        </v-card>
  	      </v-flex>
  	    </v-layout>
        <div class="text-xs-left" style="color: gray">알람 센서 리스트</div>
        <v-layout>
          <v-flex xs12>
            <v-data-table
              :headers="event_table_headers"
              :items="event_table_items"
              hide-actions
              :loading="loading"
              class="elevation-1"
            >
              <template slot="items" scope="props">
                <tr @click="$router.push(`/sensor-list/${$store.state.zone.id}/${props.item.nodeId}`)" style="cursor: pointer">
                  <td class="text-xs-right">{{ props.item.nodeName }}</td>
                  <td class="text-xs-right">{{ props.item.value }}</td>
                  <td class="text-xs-right">{{ props.item.date }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
  	  </v-container>
  	</v-slide-y-transition>
  </main>
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
      return {
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
      }
    },
    watch: {
    	'$store.state.zone': function () {
        this.getSummaryValue()
    	}
    },
    mounted () {
    	this.getSummaryValue()
    	this.timer = setInterval(() => {
        if (this.zone) {
          this.$store.dispatch('setZone', { zoneId : this.zone.id, shouldClear: false })
        }
      }, DASHBOARD_REFRESH_TIME);
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
        this.zone = this.$store.state.zone
        if (!this.zone) { return }
        
        const EVENT_API = `${API_BASE}/zones/${this.zone.id}/alarmEvents/spots`
        axios.get(EVENT_API, { params: { dateFrom: '-24h', nodewise: true }}).then(res => {
          this.events_grouped_by_id = res.data
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
      }
    }
  }
</script>

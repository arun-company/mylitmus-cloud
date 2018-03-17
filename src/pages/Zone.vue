<template>
  <div class="section zone">
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


    <router-link class="div-block-2 w-inline-block" v-for="key in filteredItems" to="#">
      <div class="text-block-3">{{ key.name }}</div>
    </router-link>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12 v-if="!id">
          <v-card><v-card-text>{{ !$store.state.zone ? '리스트 로딩 중..' : '센서를 선택해 주세요' }}</v-card-text></v-card>
        </v-flex>
        <v-flex xs4 v-for="info in node_info" :key="info ? info.key : null" v-else>
          <text-card size="4" :data="info ? { desc: info.key, value: info.value, subtitle: info.subtitle } : null"></text-card>
        </v-flex>
      </v-layout>
      <v-progress-linear v-bind:indeterminate="true" v-if="loading.info"></v-progress-linear>
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
  export default {
    props: ['id'],
    components: { EventGraph, TextCard, ServiceStatusBar,NodeMap,DurationSelector  },
    data () {
        events_grouped_by_id: [];
        this.$store.state.menu = true
        var zoneObj=null
        if (localStorage.getItem('zone'))
          zoneObj = JSON.parse(localStorage.getItem('zone'))
        var zonename=null
        if (localStorage.getItem('zonename'))
            zonename = localStorage.getItem('zonename')
        return {
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
        }
      },
      created() {
        let litmus_js = document.createElement('script')
        litmus_js.setAttribute('src', 'public/js/webflow.js')
        document.head.appendChild(litmus_js)
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
    	  this.getSummaryValue()
      },
      methods: {
    	getSummaryValue () {
        
        // this.zone = this.$store.state.zone
        // console.log('zone');
        // console.log(this.zone);
        // console.log(this.$store.state.zone);
        // if (!this.zone) { return }
        var zoneId = localStorage.getItem('zoneid')
        const EVENT_API = `${API_BASE}/zones/${zoneId}/nodes`
        axios.get(EVENT_API).then(res => {
          this.items = res.data 
        })
        // https://mylitmus.cloud/v1/zones/2
        const GET_ZONE = `${API_BASE}/zones/${zoneId}`
        axios.get(GET_ZONE,{params:{}}).then(res => {
          this.zone = res.data
        })
        // const ALARMS_API = `${API_BASE}/zones/${this.zone.id}/alarmRules`
        // axios.get(ALARMS_API).then(res => {
        //   this.alarmRules = res.data.alarmRules
        //   this.eventSeries = this.alarmRules.map(rule => ({
        //     name: rule.name, data: [], color: rule.color,
        //   }))
        //   if (this.eventSeries.length < 1) {
        //     this.alarmRules = null
        //     this.eventSeries = []
        //     this.eventChartData = null
        //     return
        //   }
        //   const EVENT_TIMESERIES_API = `${API_BASE}/zones/${this.zone.id}/alarmEvents/timeSeries`
        //   axios.get(EVENT_TIMESERIES_API, { params: { dateFrom: '-24h' }}).then(res => {
        //     this.eventChartData = this.chart_data('알람 현황', res.data.timeSeries)
        //   })
        // })
      },
      selectNode(id) {
			if (!this.$store.state.zone) { return }

			this.chartData = {}
			this.node = null

			if (!id) {
				return
			}

			if (id !== this.id) {
				this.$router.push(`/sensor-list/${this.$store.state.zone.id}/${id}`)
				return
			}
			
			this.loading.info = true
			const NODE_API = `${API_BASE}/nodes/${id}`
			axios.get(NODE_API).then(res => {
				this.node = res.data
			});
			this.getMeasuresFromRemote(id)
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

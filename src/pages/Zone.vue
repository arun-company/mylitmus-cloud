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
        <div class="text-block-5">{{headerTitle}}</div>
      </div>
      <div class="div-block-4 search">
        <input id="search-box" keyup="reverseMessage" v-model="search" class="w-input" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
    </div>

    <div class="w-container">
      <h1 class="heading">{{headerTitle}}</h1>
    </div>
    <div class="div-block-5">
      <div class="text-block-4" style="width: 100%; height: 100%;">

        <node-map @onSelectNode="selectNode($event.id)"></node-map>
      </div>
    </div>

    <router-link class="div-block-2 w-inline-block" v-for="key in filteredItems" to="#">
      <div class="text-block-3">{{ key.name }}</div>
      <!-- <div class="text-block-4">{{ key.description }}</div> -->
    </router-link>
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
    components: { EventGraph, TextCard, ServiceStatusBar,NodeMap,DurationSelector  },
    data () {
      
        events_grouped_by_id: [];
        this.$store.state.menu = true
        return {
          search: '',
          sensors:[],
          zone: null,
          headerTitle: "Zone",
          searchTitle: "Search sensors ...",
          items: [],
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
          console.log(this.items )
        })
        // https://mylitmus.cloud/v1/zones/2
        const GET_ZONE = `${API_BASE}/zones/${zoneId}`
        axios.get(GET_ZONE,{params:{}}).then(res => {
          this.zone = res.data
          this.headerTitle = this.zone.name
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

<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
          <div class="text-block-5">Home</div>
        </div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      <div class="w-container">
        <div class="div-block-14">
          <div class="calendar-block">
            <div class="">
                <date-selector label="날짜" :date.sync="range.dateFrom" :allowed-dates="beforeToday"/>
            </div>
          </div>
        </div>
      <div>
        <div class="div-block-site">
          <!-- <div class="div-block-10"><a href="#site" class="heading-3">Default</a></div>  -->
          <!-- <div v-for="(zone) in zones"  v-bind:key="zone.id" class="div-block-reporting">
            <div class="div-block-10"><a href="#zone" class="heading-4">{{zone.name}}</a></div>
            <div v-if="getSensors(zone.id)" v-for="sensor in getSensors(zone.id).nodes" v-bind:key="sensor.id"  class="div-block-reporting">
              <div class="div-block-10"><a href="#" class="heading-4">{{sensor.name}}</a><a href="#" class="div-block-alerts w-inline-block"><img src="public/images/plus.png" width="20" height="20" class="image-3"></a></div>
              <div class="content">
                <div class="text-content">{{sensor}}</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      </div> 
    </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import DateSelector from '@/components/DateSelector'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'
  export default {
    components: { EventGraph, TextCard, ServiceStatusBar, DateSelector },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/', class:''},
          {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/home-reporting', class:'w--current'},
          {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'View', icon:'003-signs.png', path:'/view-all' , class:''},
        ]
      return {
        range: {
          dateFrom: moment().startOf('day').format(),
          dateTo: moment().endOf('day').format(),
        },
        zones:[],
        search: '',
        open: this.drawer,
        headerTitle: 'Reporting',
        searchTitle: 'Search sites ...',
        items: [
          {id:1, name:"Default",description:""},
        ],
      }
    },
    computed:
    {
      filteredItems:function()
      {
        var self=this;
        return this.items.filter(function(item){return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
      }
    },
    mounted () {
      this.getAllZones()
    },
    methods: {
       beforeToday (date) {
        return moment(date).isBefore(moment())
      },
      afterDateFrom (date) {
        return this.range.dateFrom && moment(date).isAfter(moment(this.range.dateFrom)) && this.beforeToday(date)
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
                axios.all([
                    axios.get(zone),
                    axios.get(node)
                ]).then(response => {
                  this.$store.state.detail_zone[id] = response[0].data
                  this.$store.state.detail_zone[id].nodes = response[1].data
                  localStorage.setItem('detail_zone' + response[0].data.id, JSON.stringify({'data':response[0].data,'nodes':response[1].data}))
                })
              }
            }
          })
      }
    }
  }
</script>

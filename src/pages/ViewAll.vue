<template>
    <div class="section">
    <div class="w-container">
      <h1 class="heading">{{headerTitle}}</h1>
    </div>
    <div class="reporting-all">
      <div class="div-block-reporting">
        <!-- SITE DETAIL -->
        <div class="div-block-10"><a href="#" class="heading-3">Default</a>
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
        <div v-for="zone in zones" v-bind:key="zone.id" class="div-block-reporting">
          <!-- ZONE NAME AND DETAIL -->
          <div  class="div-block-10"><a href="#zone" class="heading-4">{{zone.name}}</a>
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
          <!-- ZONE SUMERIZE -->
          <div class="content">
            <div class="text-content">Zone Summary Content</div>
          </div>
          <!-- LOOP SENSOR -->
          <div v-if="getSensors(zone.id)" v-for="sensor in getSensors(zone.id).nodes" v-bind:key="sensor.id" class="div-block-reporting">
            <!-- sensor: {{sensor}} -->
            <div class="div-block-10"><a href="zone.html" class="heading-4">{{sensor.name}}</a>
              <div class="div-block-"><img src="public/images/alert_red.png" width="20" height="20" class="image-3"></div>
            </div>
            <div class="content">
              <div class="text-content">{{sensor}}</div>
              <div class="div-block-12">
                <div class="div-block-11">
                  <div class="text-block-3">{{sensor.currentMeasures}}</div>
                </div>
              </div>
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
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/view-all', class:'w--current'},
          {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'View', icon:'001-two.png', path:'/' , class:''}, 
        ]
      return {
        search: '',
        zones:[],
        open: this.drawer,
        headerTitle: 'Organization',
        searchTitle: 'Search sites ...',
        detail_zone: this.$store.state.detail_zone,
        items: [
          {id:1, name:"Default",description:""},
        ],
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
      // this.$store.dispatch('setMenuItems', this.menuItems)
      this.getAllZones()
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

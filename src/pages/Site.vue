<template>
  <div class="section">
    <div class="div-block-3 home">
      <div class="div-block-4">
        <router-link to="/"  class="link">
          Home
        </router-link>
        <div class="text-block-5">&gt;</div>
        <div class="text-block-5">{{headerTitle}}</div>
      </div>
      <div class="div-block-4 search">
        <input id="search-box" class="w-input" v-model="search" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
    </div>
    <div class="w-container">
      <h1 class="heading">{{headerTitle}}</h1>
    </div>
    <div class="div-block-15">
      <div class="div-block-9">
        <div class="progress-bar" v-if="! zones">
          <v-progress-circular  indeterminate color="red" size="80"  :width="10"></v-progress-circular>
        </div>
        <template v-for="zone in filteredItems">
            <div  v-if="tempZone=getZoneDetail(zone.id)" v-bind:key="tempZone.data.id" @click="setZoneLocal(zone)" v-bind:class="getClassAlert(tempZone.data) + ' div-block-2 w-inline-block zone-card'" >
              <div class="hidden">{{alert = getClassAlert(tempZone.data)}}{{white=getWhiteClass(alert)}} {{sensorClass= alertSensorClass(alert)}} {{error = tempZone.data.totalNodes - tempZone.data.activeNodes}}</div>
              <div v-bind:class="alert + ' text-block-3'">{{ tempZone.data.name }}</div>
                <div class="div-block-8">
                  <div class="div-block-7 full"><img v-bind:src="'public/images/wireless-device'+white+'.png'" width="20" height="20" title="센서">
                    <div v-bind:class="alert +' text-block-6'">전체 센서 {{tempZone.data.totalNodes}}</div>
                  </div>
                </div>
                <div class="div-block-8">
                  <div v-if="alert" class="div-block-7"><img v-bind:src="'public/images/alert'+white+'.png'" width="20" height="20" title="센서">
                    <div v-bind:class="alert +' text-block-6'">센서 {{tempZone.data.totalNodes - tempZone.data.activeNodes}}</div>
                  </div>
                  <div class="div-block-7"><img v-bind:src="'public/images/notifications'+alert+white+'.png'" width="20" height="20" title="알림">
                    <div v-bind:class="alert +' text-block-6'">주의  {{error * 4}}</div>
                  </div>
                </div>
                <div class="div-block-8">
                  <div class="div-block-7"><img  v-bind:src="'public/images/thermometer'+alert+white+'.png'" width="20" height="20" title="온도 알림" class="image-2">
                    <div v-bind:class="alert +' text-block-6'">{{error?error:"OK"}}</div>
                  </div>
                  <div class="div-block-7"><img  v-bind:src="'public/images/humidity'+alert+white+'.png'" width="20" height="20" title="습도 알림">
                    <div v-bind:class="alert +' text-block-6'">{{error?error:"OK"}}</div>
                  </div>
                  <div class="div-block-7"><img  v-bind:src="'public/images/battery'+alert+white+'.png'" width="20" height="20" title="배터리 알림">
                    <div v-bind:class="alert +' text-block-6'">{{error?error:"OK"}}</div>
                  </div>
                  <div class="div-block-7"><img  v-bind:src="'public/images/working'+sensorClass+white+'.png'" width="20" height="20" title="센서 알림">
                    <div v-bind:class="alert +' text-block-6'">{{error?error:"OK"}}</div>
                  </div>
                </div>
              
              <!-- Zone Information --> 
              <!-- <v-progress-circular v-if="! zoneDetail[key.id]" :width="3"></v-progress-circular> -->
            </div>
        </template>
      </div>
    </div>
    </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'
  // import ZoneIdMixin from '@/mixins/ZoneIdMixin'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'
  export default {
    // components: { EventGraph, TextCard, ServiceStatusBar },
    // mixins: [ZoneIdMixin],
    
    data () {
      
      this.$store.state.menu = false
      this.$store.state.menuItems =  [
        {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/site', class:'w--current'},
        {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/site-reporting', class:''},
        {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/site-settings', class:''},
      ]
      // router = 
      return {
        zones:[],
        router :this.$router,
        search: '',
        open: this.drawer,
        headerTitle: 'Default',
        searchTitle: 'Search zones ...',
        zoneDetail:[]
      }
    },
    computed:
    {
      filteredItems:function()
      { 
        self = this
          return self.zones.filter(function(item) {
            if (item && item.name) {
              return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;  
            } 
          });

      },
    },
    watch: {
    	
    },
    mounted () {
      this.getAllZones()
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
      },
      getZoneDetail(zoneId) {
          if (localStorage.getItem('detail_zone'+zoneId))
            return JSON.parse(localStorage.getItem('detail_zone'+zoneId))
          return []
      },
      getClassAlert(zone) {
          return zone.activeNodes == zone.totalNodes? "":"alerts";
      },
      getWhiteClass(alertClass) {
        return alertClass?".fff":""
      },
      alertSensorClass(alert) {
        return alert?"-not":""
      }
    }
  }
</script>
<style>

</style>


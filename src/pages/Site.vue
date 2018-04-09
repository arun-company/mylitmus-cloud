<template>
  <div class="section">
    <div class="div-block-3 home">
      <div class="div-block-4">
        <router-link to="/"  class="link">
          홈
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
      <v-layout row wrap div-block-10 v-if="loading">
            <v-progress-circular v-bind:indeterminate="true" size="40"></v-progress-circular>
      </v-layout>
      <div class="div-block-9">
        <template v-for="zone in filteredItems" >
            <zone-card v-bind:key="zone.id" v-bind:id="zone.id" v-bind:zonename="zone.name"></zone-card>
        </template>
      </div>
    </div>
    </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'
  import ZoneCard from '@/components/ZoneCard'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'
  export default {
    // components: { EventGraph, TextCard, ServiceStatusBar },
    // mixins: [ZoneIdMixin],
    components: { ZoneCard },
    
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/site', class:'w--current'},
          {id:2, name:'보고서', icon:'004-profit-report.png', path:'/site-reporting', class:''},
          {id:3, name:'설정', icon:'001-cogwheel.png', path:'/site-settings', class:''},
      ]
      return {
        zones:[],
        router :this.$router,
        search: '',
        open: this.drawer,
        headerTitle: 'Default',
        searchTitle: '존 검색 ...',
        zoneDetail:[],
        loading: false,
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
      this.getZones()     
    },
    methods: {
      
      stopLoading(loading) {
          this.loading=loading
      },
      getSensors(zoneId) {
          if (localStorage.getItem('detail_zone'+zoneId))
            return JSON.parse(localStorage.getItem('detail_zone'+zoneId))
          return []
      },
      getZones(){
        this.loading=true
        axios.get(ZONES_API).then(res => {
          this.zones = res.data
          var self = this;
          setTimeout(function(){
                self.loading = false;
            }, 4000);
        })
      },
      getAllZones () {
          axios.get(ZONES_API).then(res => {
          this.zones = res.data;
          localStorage.setItem('zones', JSON.stringify(this.zones))
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
      },
      getHumidity(currentMeasures) {
        if (currentMeasures && currentMeasures[1]) {
            return currentMeasures[1].value + currentMeasures[1].unit
        }
        return '-'
      },
      getTemperature(currentMeasures) {
         if (currentMeasures && currentMeasures[0]) {
            return currentMeasures[0].value + currentMeasures[0].unit
        }
        return '-'
      },
    }
  }
</script>
<style>

</style>


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
    <div class="div-block-5">
      <div class="text-block-4">Map Area</div>
    </div>
    <div class="div-block-9">
      <div class="div-block-2 w-inline-block zone-card" v-for="key in filteredItems" v-bind:key="key.id">
        <div @click="setZoneLocal(key)" class="text-block-3">{{ key.name }}</div>
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
  import ZoneIdMixin from '@/mixins/ZoneIdMixin'
  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    mixins: [ZoneIdMixin],
    
    data () {
      this.$store.state.menu = false
      this.$store.state.menuItems =  [
        {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/zone', class:''},
        {id:3, name:'Reporting', icon:'002-sign.png', path:'/report', class:''},
        {id:4, name:'Notifications', icon:'004-alarm-clock.png', path:'/alarmrules' , class:''},
        {id:5, name:'Settings', icon:'001-cogwheel.png', path:'/settings', class:''},
      ]
      // router = 
      return {
        router :this.$router,
        search: '',
        open: this.drawer,
        headerTitle: 'Default',
        searchTitle: 'Search zones ...',
      }
    },
    computed:
    {
      filteredItems:function()
      {
        var self=this;
        return self.$store.state.zones.filter(function(item){return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
      }
    },
    methods: {
      setZoneLocal: function(zone) {
        
        var self=this;
        self.$store.zone = null
        // self.$store.dispatch('setZone', { zoneId: zone.id, shouldClear: false})
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        
        this.$router.push(`/zone`)
        
        
        return
      }
    }
  }
</script>
<style>

</style>


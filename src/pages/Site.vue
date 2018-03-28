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
    <div class="div-block-9">
      <div class="div-block-2 w-inline-block zone-card" v-for="key in filteredItems" v-bind:key="key.id" @click="setZoneLocal(key)" >
        <div class="text-block-3">{{ key.name }}</div>
        <div class="div-block-8">
          <div class="div-block-7 full"><img src="public/images/wireless-device.png" width="25" height="25" title="센서">
            <div class="text-block-6">전체 센서 12</div>
          </div>
        </div>
        <div class="div-block-8">
          <div class="div-block-7"><img src="public/images/notifications.png" width="25" height="25" title="알림">
            <div class="text-block-6">주의 0</div>
          </div>
        </div>
        <div class="div-block-8">
          <div class="div-block-7"><img src="public/images/thermometer.png" width="25" height="25" title="온도 알림" class="image-2">
            <div class="text-block-6">정상</div>
          </div>
          <div class="div-block-7"><img src="public/images/humidity.png" width="25" height="25" title="습도 알림">
            <div class="text-block-6">정상</div>
          </div>
          <div class="div-block-7"><img src="public/images/battery.png" width="25" height="25" title="배터리 알림">
            <div class="text-block-6">정상</div>
          </div>
          <div class="div-block-7"><img src="public/images/working.png" width="25" height="25" title="센서 알림">
            <div class="text-block-6">정상</div>
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
  import ZoneIdMixin from '@/mixins/ZoneIdMixin'
  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    mixins: [ZoneIdMixin],
    
    data () {
      this.$store.state.menu = false
      this.$store.state.menuItems =  [
        {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/site', class:'w--current'},
        {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/site-reporting', class:''},
        {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/site-settings', class:''},
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
        this.$router.push('/zone/'+  zone.name)
        return
      }
    }
  }
</script>
<style>

</style>


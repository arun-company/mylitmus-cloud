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
    <div class="div-block-2 w-inline-block zone-card" v-for="(key, index) in filteredItems" v-bind:key="key.id">
      <div @click="setZoneLocal(key)" class="text-block-3">{{ key.name }}</div>
      <!-- <div class="text-block-4">{{ key.description }}</div> -->
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
      // router = 
      return {
        router :this.$router,
        search: '',
        open: this.drawer,
        headerTitle: 'Default',
        searchTitle: 'Search zones ...',
        items: this.$store.state.zones,
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
    methods: {
      setZoneLocal: function(zone) {
        var self=this;
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        
        this.$router.push(`/zone`)
        
        
        return
      }
    }
  }
</script>

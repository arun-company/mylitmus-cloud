<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
            <router-link to="/"  class="link">
              Home
            </router-link>
            <div class="text-block-5">&gt;</div>
            <div class="text-block-5">Default</div>
        </div>
        <div class="div-block-4 search">
          <input id="search-box" class="w-input" v-model="search" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      
      <div class="div-block-9">
      
      </div>
    </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/site', class:''},
          {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/site-reporting', class:''},
          {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/site-settings', class:'w--current'},
        ]
      return {
        search: '',
        open: this.drawer,
        headerTitle: 'Settings',
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

    }
  }
</script>

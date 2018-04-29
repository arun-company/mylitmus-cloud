<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
            <router-link to="/"  class="link">
              홈
            </router-link>
            <div class="text-block-5">&gt;</div>
            <div class="text-block-5">{{sitename}}</div>
        </div>
        
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
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/site', class:''},
          {id:2, name:'보고서', icon:'004-profit-report.png', path:'/site-reporting', class:''},
          {id:3, name:'설정', icon:'001-cogwheel.png', path:'/site-settings', class:'w--current'},
        ]
      this.$store.state.switch = [
        
      ]
      return {
        search: '',
        open: this.drawer,
        headerTitle: '설정',
        searchTitle: 'Search sites ...',
        sitename:localStorage.getItem('sitename'),
        siteid:localStorage.getItem('siteid'),
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

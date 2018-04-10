<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
          <div class="text-block-5">홈</div>
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
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/', class:''},
          {id:2, name:'보고서', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'설정', icon:'001-cogwheel.png', path:'/home-settings', class:'w--current'},
          {id:4, name:'전체 보기', icon:'003-signs.png', path:'/view-all' , class:''},
        ]
      return {
        search: '',
        open: this.drawer,
        headerTitle: '설정',
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
      // this.$store.dispatch('setMenuItems', this.menuItems)
    }
  }
</script>

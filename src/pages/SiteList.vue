<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
          <div class="text-block-5">홈</div>
        </div>
        <div class="div-block-4 search">
          <input id="search-box" class="w-input" v-model="search" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      
      <div class="div-block-15">
        <div class="div-block-9">
          <router-link to="/site" class="div-block-2 alerts w-inline-block" v-for="(key, index) in filteredItems" :key="index">
            <div class="text-block-3 alerts">{{ key.name }}</div>
            <div class="div-block-8">
              <div class="div-block-7 site"><img src="public/images/call.fff.png" width="20" height="20" title="센서">
                <div class="text-block-6 alerts">(0666) 7777-8888</div>
              </div>
            </div>
            <div class="div-block-8">
              <div class="div-block-7 site"><img src="public/images/email.fff.png" width="20" height="20" title="센서">
                <div class="text-block-6 alerts">alias-alias@email.com</div>
              </div>
            </div>
            <div class="div-block-8">
              <div class="div-block-7 site"><img src="public/images/location.fff.png" width="20" height="20" title="센서">
                <div class="text-block-6 alerts">전라남도 진안군 성삼읍 </div>
              </div>
            </div>
          </router-link>
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

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/', class:'w--current'},
          {id:2, name:'보고서', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'보고서', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'전체 보기', icon:'003-signs.png', path:'/view-all' , class:''},
        ]
      return {
        search: '',
        open: this.drawer,
        headerTitle: 'Organization',
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

<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
          <div class="text-block-5">홈</div>
        </div>
        <div class="div-block-4 search">
          <input id="search-box" class="w-input" v-model="search" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image" title="검색"></a></div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      
      <div class="div-block-15">
         <v-layout row wrap div-block-10 v-if="loading">
            <v-progress-circular v-bind:indeterminate="true" size="40"></v-progress-circular>
         </v-layout>
        <div class="div-block-9">
          <router-link :to="'/site/'+key.id" class="div-block-2 alerts w-inline-block" v-for="(key, index) in filteredItems" :key="index">
            <div class="text-block-3 alerts">{{ key.name }}</div>
            <div class="div-block-8">
              <div class="div-block-7 site"><img src="public/images/call.fff.png" width="20" height="20" title="전화번호">
                <div class="text-block-6 alerts">{{key.mobilePhone ? key.mobilePhone:'-'}}</div>
              </div>
            </div>
            <div class="div-block-8">
              <div class="div-block-7 site"><img src="public/images/email.fff.png" width="20" height="20" title="이메일">
                <div class="text-block-6 alerts">{{key.email ? key.email:'-'}}</div>
              </div>
            </div>
            <div class="div-block-8">
              <div class="div-block-7 site"><img src="public/images/location.fff.png" width="20" height="20" title="주소">
                <div class="text-block-6 alerts">{{key.address ? key.address:'-'}}</div>
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
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/', class:'w--current'},
          {id:2, name:'보고서', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'설정', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'전체 보기', icon:'003-signs.png', path:'/view-all' , class:''},
        ]
      return {
        loading:true,
        search: '',
        open: this.drawer,
        headerTitle: '',
        searchTitle: '사이트 검색 ...',
        sites:null,
        items: [
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
      this.getSite()
    },
    methods: {
      getSite() {
        var SELF_SITE = API_BASE + "/users/self/orgs"
        axios.get(SELF_SITE).then(res => {
          this.org = res.data[0]
          console.log(res.data)
          this.headerTitle = this.org.name
          var SITE_API = API_BASE + '/orgs/'+this.org.id+'/sites'
          axios.get(SITE_API).then(res => {
            this.items = res.data
            this.loading = false
          })
        })
      }
    }
  }
</script>

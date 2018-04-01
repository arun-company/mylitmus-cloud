<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
          <router-link class="link" to="/">
            Home
          </router-link>
        <div class="text-block-5">&gt;</div>
          <router-link to="/site" class="link">
            Default
          </router-link>
        <div class="text-block-5">&gt;</div>
        <div v-if="zonename" class="text-block-5">{{zonename}}</div>
        </div>
        <div class="div-block-4 search">
          <input id="search-box" class="w-input" v-model="search" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      <div class="w-container">
      <div class="reporting-all">
        <div class="div-block-reporting" v-for="i in [1,2,3,4,5]">
          <div class="div-block-10"><a href="zone.html" class="heading-4">Setting Sensor</a></div>
          <div class="content">
            <div class="div-block-12">
              <template v-for="setting in settings">
                <div  class="div-block-11">
                  <div class="div-block-18">{{setting.sensorType.name + ' 상한'}} : {{setting.min_value}}</div>
                </div>
                <div class="div-block-11">
                  <div class="div-block-18">{{setting.sensorType.name + ' 하한'}}: {{setting.max_value}}</div>
                </div>
              </template>
            </div>
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
  import { API_BASE } from '@/global'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/zone', class:''},
          {id:3, name:'Reporting', icon:'004-profit-report.png', path:'/zone-reporting', class:''},
          // {id:4, name:'Notifications', icon:'003-notifications-button.png', path:'/zone-notifications' , class:''},
          {id:5, name:'Settings', icon:'001-cogwheel.png', path:'/zone-settings', class:'w--current'},
        ]
      return {
        zonename: localStorage.getItem('zonename'),
        search: '',
        open: this.drawer,
        headerTitle: 'Settings',
        searchTitle: 'Search sites ...',
        items: [
          
        ],
        settings:null
      }
    },
    computed:
    {
      
    },
    mounted () {
      this.getSettings()
    },
    methods: {
      getSettings () {
        var zondId = localStorage.getItem('zoneid');
        const SENSORTYPES_API = `${API_BASE}/v1/zones/${zondId}/sensorTypes`
        axios.get(SENSORTYPES_API).then(res => {
          this.settings = res.data
        })
      }

    }
  }
</script>

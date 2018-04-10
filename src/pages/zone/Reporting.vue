<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
          <router-link class="link" to="/">
            홈
          </router-link>
        <div class="text-block-5">&gt;</div>
          <router-link to="/site" class="link">
            Default
          </router-link>
        <div class="text-block-5">&gt;</div>
        <div v-if="zonename" class="text-block-5">{{zonename}}</div>
        </div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      <div class="w-container">
        <div class="div-block-14">
          <div class="calendar-block">
            <div class="">
                <date-selector label="날짜" :date.sync="range.dateFrom" :allowed-dates="beforeToday"/>
            </div>
          </div>
        </div>
              </div>
    
    </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'
  import DateSelector from '@/components/DateSelector'
  import EventGraph from '@/components/charts/EventGraph'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar, DateSelector },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/zone', class:''},
          {id:3, name:'보고서', icon:'004-profit-report.png', path:'/zone-reporting', class:'w--current'},
          {id:4, name:'알림', icon:'notificationsalerts.fff.png', path:'/zone-notifications' , class:''},
          {id:5, name:'설정', icon:'001-cogwheel.png', path:'/zone-settings', class:''},
        ]
        // if (localStorage.getItem('zonename'))
        //     zonename = localStorage.getItem('zonename')
      return {
        zonename: localStorage.getItem('zonename'),
        range: {
          dateFrom: moment().startOf('day').format(),
          dateTo: moment().endOf('day').format(),
        },
        search: '',
        open: this.drawer,
        headerTitle: '보고서',
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
    },
    methods: {
      beforeToday (date) {
        return moment(date).isBefore(moment())
      },
    }
  }
</script>

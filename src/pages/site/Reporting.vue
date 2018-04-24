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
      <div class="w-container">
        <div class="div-block-14">
          <div class="calendar-block">
            <div class="">
                <date-selector label="날짜" :date.sync="range.dateFrom" :allowed-dates="beforeToday"/>
            </div>
          </div>
        </div>
      <div>
        <div v-if="0" class="div-block-site">
          <div class="div-block-zone">
            <div class="div-block-10"><a href="#zone.html" class="heading-4">Zone - 00000</a></div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
          </div>
          <div class="div-block-zone">
            <div class="div-block-10"><a href="#zone.html" class="heading-4">Zone - 00000</a></div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
          </div>
          <div class="div-block-zone">
            <div class="div-block-10"><a href="#zone.html" class="heading-4">Zone - 00000</a></div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
            </div>
            <div class="div-block-sensor">
              <div class="div-block-10"><a href="#zone.html" class="heading-4">Sensor - 00000</a></div>
              <div class="content">
                <div class="text-content">Sensor Reporting List</div>
              </div>
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
  import DateSelector from '@/components/DateSelector'
  import EventGraph from '@/components/charts/EventGraph'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar, DateSelector },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/site', class:''},
          {id:2, name:'보고서', icon:'004-profit-report.png', path:'/site-reporting', class:'w--current'},
          {id:3, name:'설정', icon:'001-cogwheel.png', path:'/site-settings', class:''},
        ]
      return {
        range: {
          dateFrom: moment().startOf('day').format(),
          dateTo: moment().endOf('day').format(),
        },
        search: '',
        open: this.drawer,
        headerTitle: '보고서',
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
      // this.$store.dispatch('setMenuItems', this.menuItems)
    },
    methods: {
      beforeToday (date) {
        return moment(date).isBefore(moment())
      },
    }
  }
</script>
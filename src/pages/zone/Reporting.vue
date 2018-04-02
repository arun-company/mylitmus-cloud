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
          <input id="search-box" class="w-input" v-model="search" type="text" :placeholder="searchTitle"><a href="##" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      <div class="w-container">
        <div class="div-block-14">
          <div class="calendar-block">
            <div class="">
                <date-selector label="날짜" :date.sync="range.dateFrom" />
            </div>
          </div>
        </div>
      <div>
        <div class="div-block-site" v-if="0">
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

  import EventGraph from '@/components/charts/EventGraph'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import DateSelector from '@/components/DateSelector'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar, DateSelector},
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/zone', class:''},
          {id:3, name:'Reporting', icon:'004-profit-report.png', path:'/zone-reporting', class:'w--current'},
          // {id:4, name:'Notifications', icon:'003-notifications-button.png', path:'/zone-notifications' , class:''},
          {id:5, name:'Settings', icon:'001-cogwheel.png', path:'/zone-settings', class:''},
        ]
      return {
        range: {
          dateFrom: moment().startOf('day').format(),
          dateTo: moment().endOf('day').format(),
        },
        sensorTypes: [],
        search: '',
        open: this.drawer,
        headerTitle: 'Reporting',
        searchTitle: 'Search sites ...',
        zonename: localStorage.getItem('zonename'),
        items: [
          {id:1, name:"Default",description:""},
        ],
        duration: '-24h',
        chartType: 'line',
        chartData: { 'temperature': null, 'humidity': null },
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
    mehtods:{
      getMinMax(uid, minmax) {
			const sensorType = this.sensorTypes.find(element => element.sensorType.uid === uid) || {}
			return sensorType[minmax] || 0
		  },
      beforeToday (date) {
        return moment(date).isBefore(moment())
      },
      afterDateFrom (date) {
        return this.range.dateFrom && moment(date).isAfter(moment(this.range.dateFrom)) && this.beforeToday(date)
      },
    }
  }
</script>

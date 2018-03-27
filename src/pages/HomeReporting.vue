<template>
    <div class="section">
      <div class="div-block-3">
        <div class="div-block-4">
          <div class="text-block-5">Home</div>
        </div>

      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>
      <div class="w-container">
      <div class="div-block-12">
        <div class="div-block-14 block-inline">
          <div>
                <v-layout row wrap>
                    <v-flex xs12 md6>
                      <date-selector label="시작날짜" :date.sync="range.dateFrom" :allowed-dates="beforeToday"/>
                    </v-flex>
                    <v-flex xs12 md6>
                      <date-selector label="종료날짜" :date.sync="range.dateTo" :allowed-dates="afterDateFrom" at-the-end="true" />
                    </v-flex>
                </v-layout>
          </div>
        </div>
      </div>
      <div>
        <div class="div-block-site">
          <div class="div-block-10"><a href="#site.html" class="heading-3">Site - 00000</a></div>
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
  import DateSelector from '@/components/DateSelector'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar, DateSelector },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/', class:''},
          {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/home-reporting', class:'w--current'},
          {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/home-settings', class:''},
        ]
      return {
        range: {
          dateFrom: moment().startOf('day').format(),
          dateTo: moment().endOf('day').format(),
        },
        search: '',
        open: this.drawer,
        headerTitle: 'Reporting',
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
      afterDateFrom (date) {
        return this.range.dateFrom && moment(date).isAfter(moment(this.range.dateFrom)) && this.beforeToday(date)
      },
    }
  }
</script>

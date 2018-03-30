<template>

    <div class="section">
    <div class="w-container">
      <h1 class="heading">{{headerTitle}}</h1>
    </div>
    <div class="reporting-all">
      <div class="div-block-reporting">
        <div class="div-block-10"><router-link to="/site" class="heading-3">Site -Dafult</router-link>
          <div class="div-block-alerts">
            <div class="div-block-13">
              <div class="text-block-7">존</div>
              <div class="text-block-7">00곳</div>
            </div>
            <div class="div-block-13">
              <div class="div-block-13">
                <div class="text-block-7">센서</div>
                <div class="text-block-7">000개</div>
              </div>
              <div class="div-block-13"><img src="public/images/alert_red.png" width="20" height="20" class="image-3">
                <div class="text-block-7">000개</div>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="div-block-7 view-all"><img src="public/images/call.png" width="20" height="20" title="센서">
            <div class="text-block-6">(0666) 7777-8888</div>
          </div>
          <div class="div-block-7 view-all"><img src="public/images/email.png" width="20" height="20" title="센서">
            <div class="text-block-6">alias-alias@email.com</div>
          </div>
          <div class="div-block-7 view-all address"><img src="public/images/location.png" width="20" height="20" title="센서">
            <div class="text-block-6">전라남도 진안군 성삼읍</div>
          </div>
        </div>  
        <!-- END OF SITE DETAIL -->
        <div v-for="zone in zones" class="div-block-reporting">
          <div class="div-block-10"><a href="#" @click="setZoneLocal(zone)" class="heading-4">Zone - {{zone.name}}</a>
            <div class="div-block-alerts">
              <div class="div-block-13">
                <div class="div-block-13">
                  <div class="text-block-7">센서</div>
                  <div class="text-block-7">000개</div>
                </div>
                <div class="div-block-13"><img src="public/images/alert_red.png" width="20" height="20" class="image-3">
                  <div class="text-block-7">000개</div>
                </div>
              </div>
            </div>
          </div>
          <!-- END OF ZONE -->
          <div v-if="getSensors(zone.id)" v-for="sensor in getSensors(zone.id).nodes" v-bind:key="sensor.id" class="content">
            <v-layout class="hidden">{{ alert= getAlertClass(sensor.currentMeasures)}} {{white=getWhiteClass(alert)}} {{activeSensor = alertSensorClass(sensor.activeAt)}}</v-layout>
            <div class="div-block-12">
              <div class="div-block-11">
                <a v-bind:class="alert + ' div-block-2 viewall w-inline-block'">
                  <div v-bind:class="'text-block-3 viewall ' + alert">{{sensor.name}}</div>
                  <div class="div-block-8">
                    <div class="div-block-7"><img v-bind:src="'public/images/battery'+white+'.png'" width="20" height="20" title="습도" class="image-3"><img v-bind:src="'public/images/working'+activeSensor+white+'.png'" width="20" height="20" title="습도" class="image-3"></div>
                  </div>
                </a>
              </div>
              <div class="div-block-11">
                <div class="div-block-16 half">
                  <div class="div-block-17"><img src="public/images/thermometer.png" width="20" height="20"></div>
                  <div class="div-block-17 right">
                    <div class="text-block-9">최고 26°C</div>
                  </div>
                  <div class="div-block-17">
                    <div class="text-block-8">{{getTemperature(sensor.currentMeasures)}}</div>
                  </div>
                  <div class="div-block-17 right">
                    <div class="text-block-9">최저 26°C</div>
                  </div>
                </div>
                <div class="div-block-16 half">
                  <div class="div-block-17"><img src="public/images/humidity.png" width="20" height="20"></div>
                  <div class="div-block-17 right">
                    <div class="text-block-9">최고 26%</div>
                  </div>
                  <div class="div-block-17">
                    <div class="text-block-8">{{getHumidity(sensor.currentMeasures)}}</div>
                  </div>
                  <div class="div-block-17 right">
                    <div class="text-block-9">최저 26%</div>
                  </div>
                </div>
              </div>
              <div class="div-block-11">
                <div class="div-block-16"></div>
              </div>
              <div class="div-block-11">
                <div class="div-block-16"></div>
              </div>
            </div>
          </div>
          <div class="content">
            
          </div>
          </div>
          <!-- END OF SENSOR -->
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
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/view-all', class:'w--current'},
          {id:2, name:'Reporting', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'Settings', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'View', icon:'001-two.png', path:'/' , class:''}, 
        ]
      return {
        search: '',
        zones:[],
        open: this.drawer,
        headerTitle: 'Organization',
        searchTitle: 'Search sites ...',
        detail_zone: this.$store.state.detail_zone,
        items: [
          {id:1, name:"Default",description:""},
        ],
      }
    },
    computed:
    {
      filteredItems:function()
      {
        var self=this
        return this.items.filter(function(item){return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
      }
      
    },
    mounted () {
      this.getAllZones()
    },
    methods: {
      setZoneLocal: function(zone) {
        var self=this;
        // self.$store.zone = null
        // self.$store.dispatch('setZone', { zoneId: zone.id, shouldClear: false})
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        this.$router.push('/zone/'+  zone.name)
        return
      },
      getSensors(zoneId) {
          if (localStorage.getItem('detail_zone'+zoneId))
            return JSON.parse(localStorage.getItem('detail_zone'+zoneId))
          return []
      },
      getAllZones () {
          axios.get(ZONES_API).then(res => {
          this.zones = res.data;
          localStorage.setItem('zones', JSON.stringify(this.zones))
          // this.zones = JSON.parse(localStorage.getItem('zones'));

          for(var i=0; i < res.data.length; i++) {
            var id = res.data[i].id
            if (localStorage.getItem('detail_zone'+ id)){
              this.$store.state.detail_zone[id] = JSON.parse(localStorage.getItem('detail_zone'+ id))
            } else {
              var zone = `${API_BASE}/zones/`+ id
              var node = zone + '/nodes'
              var sensorType = zone + '/sensorTypes';
              https://mylitmus.cloud/v1/v1/zones/2/sensorTypes
              axios.all([
                  axios.get(zone),
                  axios.get(node),
                  axios.get(sensorType)
              ]).then(response => {
                this.$store.state.detail_zone[id] = response[0].data
                this.$store.state.detail_zone[id].nodes = response[1].data
                localStorage.setItem('detail_zone' + response[0].data.id, JSON.stringify({'data':response[0].data,'nodes':response[1].data, 'settings':response[2].data}))
              })
            }
          }
        })
      },
      getAlertClass(checkValue) {
         return (checkValue[0]&&checkValue[1])? '':'alerts'
      },
      getWhiteClass(alertClass){
        return alertClass?".fff":""
      },
      alertSensorClass(activeDate) {
        return new Date() - new Date(activeDate) > (12 * 3600 * 1000)?'-not':''
      },
      getHumidity(currentMeasures) {
        if (currentMeasures && currentMeasures[0]) {
            return currentMeasures[0].value + currentMeasures[0].unit
        }
        return '-'
      },
      getTemperature(currentMeasures) {
         if (currentMeasures && currentMeasures[1]) {
            return currentMeasures[1].value + currentMeasures[1].unit
        }
        return '-'
      },

    }
  }
</script>

<template>
  <div>
    <v-progress-linear v-bind:indeterminate="true" v-if="zone_loading"></v-progress-linear>
    <div v-if="zone" class="div-block-10"><a href="#" @click="setZoneLocal({id:zoneid, name:zonename})" class="heading-4">Zone - {{zonename}}</a>
            
            <div class="div-block-alerts">
              <div class="div-block-13">
                <div class="div-block-13">
                  <div class="text-block-7">센서</div>
                  <div class="text-block-7">{{zone.totalNodes}}개</div>
                </div>
                <div class="div-block-13"><img src="public/images/alert_red.png" width="20" height="20" class="image-3">
                  <div class="text-block-7">{{zone.totalNodes - zone.activeNodes}}개</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="zone" class="content">
              <div class="div-block-7 view-all"><img src="public/images/thermometer.png" width="20" height="20" title="평균 온도">
                <div class="text-block-6">평균 온도 {{getTemperature(zone.currentMeasures)}}</div>
              </div>
              <div class="div-block-7 view-all"><img src="public/images/humidity.png" width="20" height="20" title="평균 습도">
                <div class="text-block-6">평균 습도 {{getHumidity(zone.currentMeasures)}}</div>
              </div>
          </div>
          <template>
                <div  v-for="sensor in sensors" v-bind:key="sensor.id" class="content">
                  <v-layout class="hidden">{{ alert= getAlertClass(sensor.currentMeasures)}} {{white=getWhiteClass(alert)}} {{activeSensor = alertSensorClass(sensor.activeAt)}}</v-layout>
                  <div class="div-block-12">
                    <div class="div-block-11 card">
                      <div v-bind:class="alert + ' div-block-2 viewall w-inline-block'">
                        <div class="div-block-16 partial cardtitle">
                          <div v-bind:class="alert + ' text-block-3 viewall'">{{sensor.name}}</div>
                          <div class="div-block-8">
                            <div class="div-block-7 ">
                              <img v-bind:src="'public/images/battery'+white+'.png'" width="20" height="20" title="배터리" class="image-3">
                              <img v-bind:src="'public/images/working'+activeSensor+white+'.png'" width="20" height="20" title="센서 작동 상태" class="image-3"></div>
                          </div>
                        </div>
                        <div class="div-block-16 partial">
                          <div class="div-block-17 center">
                            <img v-bind:src="'public/images/thermometer'+white+'.png'"  width="20" height="20" title="온도">
                          </div>
                          <div class="div-block-17 right">
                            <div v-if="minmax" v-bind:class="alert + ' text-block-9'">최고 {{minmax.max_temp}}</div>
                          </div>
                          <div class="div-block-17">
                            <div v-bind:class="alert + ' text-block-8'">{{getTemperature(sensor.currentMeasures)}}</div>
                          </div>
                          <div class="div-block-17 right">
                            <div v-if="minmax"  v-bind:class="alert + ' text-block-9'">최저 {{minmax.min_temp}}</div>
                          </div>
                        </div>
                        <div class="div-block-16 partial">
                          <div class="div-block-17 center">
                            <img v-bind:src="'public/images/humidity'+white+'.png'" width="20" height="20" title="습도"></div>
                          <div class="div-block-17 right">
                            <div v-if="minmax" v-bind:class="alert + ' text-block-9'">최고 {{minmax.max_humidity}}</div>
                          </div>
                          <div class="div-block-17">
                            <div v-bind:class="alert + ' text-block-8'">{{getHumidity(sensor.currentMeasures)}}</div>
                          </div>
                          <div class="div-block-17 right">
                            <div v-if="minmax" v-bind:class="alert + ' text-block-9'">최저 {{minmax.min_humidity}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <graph-component @sendGraphData="updateMaxValue($event)" v-bind:sensorid="sensor.id"></graph-component>
                  </div>
              </div>
          </template>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import GraphComponent from '@/components/GraphComponent'
  import { toFixedNumber } from '@/util'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'
  export default {
    components: { GraphComponent },
    props: ['zonename','zoneid'],
    watch: {
      
    },
    data () {
      return {
        sensors : [],
        zone:null,
        zone_loading: true,
        minmax:null
      }
    },
     created() {
     
    },
    mounted () {
          this.zone_loading = true
          var ZONE_DETAIL = `${API_BASE}/zones/`+ this.zoneid 
          var NODES =  ZONE_DETAIL + '/nodes'
          axios.all([
             axios.get(ZONE_DETAIL),
             axios.get(NODES),
          ]).then(response => {
              this.zone = response[0].data
              this.sensors = response[1].data
              this.zone_loading = false
          });
    },
    methods: {
      updateMaxValue(minMax) {
          this.minmax = minMax
      },
      getHumidity(currentMeasures) {
        if (currentMeasures && currentMeasures[1]) {
            return currentMeasures[1].value + currentMeasures[1].unit
        }
        return '-'
      },
      getTemperature(currentMeasures) {
         if (currentMeasures && currentMeasures[0]) {
            return currentMeasures[0].value + currentMeasures[0].unit
        }
        return '-'
      },
      setZoneLocal: function(zone) {
        var self=this;
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        this.$router.push('/zone/'+  zone.name)
        return
      },

      getAlertClass(checkValue) {
         return (checkValue[0]&&checkValue[1])? '':'alerts'
      },
      getWhiteClass(alertClass){
        return alertClass?".fff":""
      },
      alertSensorClass(activeDate) {
        return (new Date() - new Date(activeDate)) > (24 * 3600 * 1000)?'-not':''
      },
      getSensorTypes() {     
        this.chartData = {}
        const SENSOR_MIN_MAX_API = `${API_BASE}/zones/3/sensorTypes`;
        axios.get(SENSOR_MIN_MAX_API).then(res => {
          this.sensorTypes = res.data
        })
		  }
    }
  }
</script>

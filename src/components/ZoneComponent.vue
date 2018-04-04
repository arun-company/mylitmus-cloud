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
              <div class="div-block-7 view-all"><img  src="public/images/thermometer.png" width="20" height="20" title="평균 온도">
                <div class="text-block-6">평균 온도 {{getTemperature(zone.currentMeasures)}}</div>
              </div>
              <div class="div-block-7 view-all"><img  src="public/images/humidity.png" width="20" height="20" title="평균 습도">
                <div class="text-block-6">평균 습도 {{getHumidity(zone.currentMeasures)}}</div>
              </div>
          </div>
          <sensor-card-component v-for="sensor in sensors" v-bind:minMaxTemp="[tempMin, tempMax]" v-bind:minMaxHumi="[humiMin, humiMax]" v-bind:sensor="sensor" v-bind:key="sensor.id"  @sendGraphData="updateMaxValue($event)"></sensor-card-component>
          <!-- <sensor-card-component v-for="sensor in sensors" v-bind:key="JSON.stringtify(sensor)"  @sendGraphData="updateMaxValue($event)"></sensor-card-component> -->
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import GraphComponent from '@/components/GraphComponent'
  import SensorCardComponent from '@/components/SensorCardComponent'
  import { toFixedNumber } from '@/util'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'
  export default {
    components: { GraphComponent, SensorCardComponent },
    props: ['zonename','zoneid'],
    watch: {
      
    },
    data () {
      return {
        sensors : [],
        zone:null,
        zone_loading: true,
        minmax:null,
        tempMin: null,
        tempMax: null,
        humiMin: null,
        humiMax: null
      }
    },
     created() {
     
    },
    mounted () {
          this.zone_loading = true
          var ZONE_DETAIL = `${API_BASE}/zones/`+ this.zoneid 
          var NODES =  ZONE_DETAIL + '/nodes'
          var ZONE_TYPE = ZONE_DETAIL + '/sensorTypes'
          var ALARMRULE = ZONE_DETAIL + '/alarmRules'
          axios.all([
            axios.get(ZONE_TYPE),
            axios.get(ZONE_DETAIL),
            axios.get(NODES),
            axios.get(ALARMRULE),
          ]).then(response => {
              this.sensorTypes = response[0].data
              this.zone = response[1].data
              this.sensors = response[2].data
              this.setAlameRule(response[3].data.alarmRules)
              this.zone_loading = false
              
          });
    },
    methods: {
      setAlameRule(alarm_rules) {
          for(var i=0; i<alarm_rules.length; i++) {
            if (alarm_rules[i].sensorType.uid == 'temperature') {
              this.checkTempartureRule(alarm_rules[i].rule)
            } else if (alarm_rules[i].sensorType.uid == 'humidity'){
              this.checkHumidityRule(alarm_rules[i].rule)
            }
          }
      },
      checkTempartureRule(rule_condition) {
          var rule_value = rule_condition.split('value ')[1]
          if (rule_value.indexOf(">") >= 0) {
                this.tempMax = rule_value.split('>')[1] * 1
          }
            
          if(rule_value.indexOf("<") >= 0) {
            this.tempMin = rule_value.split('<')[1] * 1
          }
            
      },
      checkHumidityRule(rule_condition) {
          var rule_value = rule_condition.split('value ')[1]
          if ( rule_value.indexOf(">") >= 0)
              this.humiMax = rule_value.split('>')[1] * 1
          if( rule_value.indexOf("<") >= 0) 
            this.humiMin = rule_value.split('<')[1] * 1
      },
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
      getTempartureWarningClass() {

      },
      getHumidityWarningClass() {

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
        // const SENSOR_MIN_MAX_API = `${API_BASE}/zones/${}/sensorTypes`;
        // axios.get(SENSOR_MIN_MAX_API).then(res => {
        //   this.sensorTypes = res.data
        // })
		  }
    }
  }
</script>

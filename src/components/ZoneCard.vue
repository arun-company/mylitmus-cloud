<template>
   <div v-if="zone" @click="setZoneLocal({'id':zone.id,'name':zone.name})" v-bind:class="alert + ' div-block-2 w-inline-block zone-card'">
     <div v-bind:class="alert + ' text-block-3'">{{ zone.name }}</div>
     <div class="div-block-8">
            <div v-bind:class="alert + ' text-block-8'">{{parseFloat(Math.round(zone.currentTemperature * 100) / 100).toFixed(2) }}</div>
            <div v-bind:class="alert + ' text-block-8'">{{parseFloat(Math.round(zone.currentHumidity * 100) / 100).toFixed(2) }}</div>
          </div>
          <div class="div-block-8">
            <div class="div-block-7 full"><img v-bind:src="'public/images/wireless-device'+white+'.png'" width="20" height="20" title="센서">
              <div v-bind:class="alert +' text-block-6'">전체 센서 {{zone.totalNodes}}</div>
            </div>
          </div>
          <div class="div-block-8">
            <div v-if="alert" class="div-block-7"><img v-bind:src="'public/images/alert'+white+'.png'" width="20" height="20" title="센서">
              <div v-bind:class="alert +' text-block-6'">센서 {{ Math.max(zone.temperatureWarningCount, zone.humidityWarningCount, zone.batteryWarningCount, zone.inactiveNodes)}}</div>
            </div>
            <div class="div-block-7"><img v-bind:src="'public/images/notifications'+alert+white+'.png'" width="20" height="20" title="알림">
              <div v-bind:class="alert +' text-block-6'">주의  {{totalAlert}}</div>
            </div>
          </div>
          <div class="div-block-8">
            <div class="div-block-7"><img  v-bind:src="'public/images/thermometer'+alertTemp+white+'.png'" width="20" height="20" title="온도 알림" class="image-2">
              <div v-bind:class="alert +' text-block-6'">{{zone.temperatureWarningCount?zone.temperatureWarningCount:"OK"}}</div>
            </div>
            <div class="div-block-7"><img  v-bind:src="'public/images/humidity'+alertHumi+white+'.png'" width="20" height="20" title="습도 알림">
              <div v-bind:class="alert +' text-block-6'">{{zone.humidityWarningCount?zone.humidityWarningCount:"OK"}}</div>
            </div>
            <div class="div-block-7"><img  v-bind:src="'public/images/battery'+batteryError+white+'.png'" width="20" height="20" title="배터리 알림">
              <div v-bind:class="alert +' text-block-6'">{{zone.batteryWarningCount?zone.batteryWarningCount:"OK"}}</div>
            </div>
            <div class="div-block-7"><img  v-bind:src="'public/images/working'+workingClass+white+'.png'" width="20" height="20" title="센서 알림">
              <div v-bind:class="alert +' text-block-6'">{{zone.inactiveNodes?zone.inactiveNodes:"OK"}}</div>
            </div>
        </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import { API_BASE } from '@/global'
  export default {
    // props: ['id','zonename', 'zone'],
    props: {
      zone: {type: Object},
      // minMaxTemp: {type: Array},
      // minMaxHumi: {type: Array}
    },
    data () { 
      return {
        router :this.$router,
        search: '',
        open: this.drawer,
        headerTitle: 'Default',
        searchTitle: 'Search zones ...',
        zoneDetail:[],
        alert: '',
        white: "",
        error: 0,
        nodes:[],
        countTemp:0,
        alertTemp:'',
        countHumi:0,
        alertHumi:'',
        countWorking:0,
        countBattery:0,
        totalAlert: 0,
        tempMin: null,
        tempMax: null,
        humiMin: null,
        humiMax: null,
        workingClass:null,
        batteryError:'',
      }
    },
    mounted () { 
          // var ZONE_DETAIL = `${API_BASE}/zones/`+ this.id 
          // var NODES =  ZONE_DETAIL + '/nodes'
          // var ALARMRULE = ZONE_DETAIL + '/alarmRules'
          // axios.all([
          //   axios.get(ZONE_DETAIL),
          //   // axios.get(NODES),
          //   // axios.get(ALARMRULE),
          // ]).then(response => {
          //     this.zone = response[0].data
          //     console.log(this.zone)
              // this.nodes = response[1].data
              // this.setAlameRule(response[2].data.alarmRules)
              
              // if (this.zone.currentMeasures.length > 0) {
              //      for (var i=0; i<this.nodes.length; i++) {
                    
              //        if ((this.nodes[i].currentMeasures.length && this.nodes[i].currentMeasures[0])) {
              //           if(this.tempMin && this.tempMax) {
              //              if (!(this.nodes[i].currentMeasures[0] > this.tempMin && this.nodes[i].currentMeasures[0] < this.tempMax))
              //               this.countTemp += 1
              //           } else if (this.tempMin) {
              //               if (this.nodes[i].currentMeasures[0] < this.tempMin){
              //                 this.countTemp += 1
              //               }
              //           } else if (this.tempMax) {
              //               if (this.nodes[i].currentMeasures[0] > this.tempMax) 
              //               {
              //                 this.countTemp += 1
              //               }
              //           }
                        
                        
              //        } 
              //        if ((this.nodes[i].currentMeasures.length && this.nodes[i].currentMeasures[1])) {
              //          // TODO Count Min max Humi
              //        }
              //      }
                   

              // }
              this.countWorking = this.zone.inactiveNodes
              // this.countWorking = this.zone.totalNodes - this.zone.activeNodes
              this.workingClass = this.countWorking ? "-not":""
              this.alert = this.zone.batteryWarningCount|this.zone.humidityWarningCount|this.zone.temperatureWarningCount? "alerts":""
              this.white = this.alert?".fff":""
              this.batteryError = this.zone.batteryWarningCount?'alerts':''
              this.alertTemp= this.zone.temperatureWarningCount?'alerts':''
              this.totalAlert = this.zone.temperatureWarningCount + this.zone.humidityWarningCount + this.zone.batteryWarningCount
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
      getAlertTemperature(currentMeasures) {
        if (currentMeasures && currentMeasures[0]) {
            if (this.tempMin && this.tempMax)
              return currentMeasures[0].value > this.tempMin && currentMeasures[0].value < this.tempMax? "":"alerts"
            else if (this.tempMin)
              return currentMeasures[0].value > this.tempMin ? "":"alerts"
            else if (this.tempMax)
              return currentMeasures[0].value < this.tempMax ? "":"alerts"
        }
        return ''
      },
     setZoneLocal: function(zone) {
        var self=this;
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        this.$router.push('/zone')
        return
      },
      getZoneDetail(zoneId) {
          if (localStorage.getItem('detail_zone'+zoneId))
            return JSON.parse(localStorage.getItem('detail_zone'+zoneId))
          return []
      },
      getClassAlert(zone) {
          this.allAlert = ''
          if (zone.activeNodes != zone.totalNodes) this.allAlert="alerts"
          return this.allAlert
      },
      getWhiteClass(alertClass) {
        return alertClass?".fff":""
      },
      alertSensorClass(alert) {
        return alert?"-not":""
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
    }
      
    }
</script>

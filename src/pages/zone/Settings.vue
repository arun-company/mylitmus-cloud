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
        <div class="div-block-reporting"  v-if="sensors" v-for="sensor in sensors" v-bind:key="sensor.id">
           <v-progress-linear v-bind:indeterminate="true" v-if="!settings"></v-progress-linear>
          <div class="div-block-10"><a href="zone.html" class="heading-4">Sensor - {{sensor.name}}</a></div>
          <div class="content">
            <div class="text-content">Sensor Settings</div>
            <div class="div-block-12">
               <template v-for="setting in settings">
                <div class="div-block-11">
                <v-flex :key="setting.sensorType.name+'_mix'">
                  <v-text-field :key="setting.sensorType.name"
                      :label="setting.sensorType.name + ' 상한'"
                      :value="setting.min_value"
                      :suffix="setting.sensorType.unit"
                  ></v-text-field>
                </v-flex>
                </div>
                <div class="div-block-11">
                <v-flex :key="setting.sensorType.name +'_max'">              
                  <v-text-field :key="setting.sensorType.name"
                      :label="setting.sensorType.name + ' 하한'"
                      :value="setting.max_value"
                      :suffix="setting.sensorType.unit"
                  ></v-text-field>
                </v-flex>
                </div>
              </template>
              
               
              
            </div>
          </div>
          <div class="content">
            <div class="text-content">Sensor Notificaitons</div>
            <div class="div-block-12">
              <div class="div-block-11"  v-for="rule in alarmRules" :key="rule.name">
                <div class="div-block-18" >
                  <v-card>
                      <v-card-title primary-title>
                        <v-layout align-content-space-between>
                          <div class="notification-name-block">
                              <div class="notification-name-block-title"
                              :style="{
                                'border-bottom': `4px solid ${rule.color || '#FFC4C4'}`}">{{ rule.name }}
                            </div>
                            <div style="font-size:12px; line-height: 20px;">  {{ rule.sensorType.name }} </div>
                          </div>
                            <div class="text-block-8 notification">
                              {{ rule.rule.split('value ')[1] }}{{ rule.sensorType.unit }}
                            </div>
                        </v-layout>
                      </v-card-title>
                    </v-card>
                </div>
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
  import { API_BASE } from '@/global'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/zone', class:''},
          {id:3, name:'Reporting', icon:'004-profit-report.png', path:'/zone-reporting', class:''},
          {id:4, name:'Notifications', icon:'notificationsalerts.fff.png', path:'/zone-notifications' , class:''},
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
        settings:null,
        sensors:null,
        alarmRules:null
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
        const ZONESENSOR = `${API_BASE}/v1/zones/${zondId}/nodes`
        const RULES_API = `${API_BASE}/zones/${zondId}/alarmRules`
        axios.all([
            axios.get(ZONESENSOR),
            axios.get(SENSORTYPES_API),
            axios.get(RULES_API),
        ]).then(
        res => {
          this.sensors = res[0].data
          this.settings = res[1].data
          this.alarmRules = res[2].data.alarmRules
        })
      
      }

    }
  }
</script>

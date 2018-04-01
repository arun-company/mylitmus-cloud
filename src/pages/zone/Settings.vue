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
        <v-progress-linear v-bind:indeterminate="true" v-if="!settings"></v-progress-linear>
        <v-container grid-list-lg text-xs-center v-if="sensors" v-for="sensor in sensors" v-bind:key="sensor.id">
          {{sensor.name}}
          <v-layout row wrap>
            <template v-for="setting in settings">
              <v-flex xs12 sm6 md3 :key="setting.sensorType.name+'_mix'">
                <v-text-field :key="setting.sensorType.name"
                    :label="setting.sensorType.name + ' 상한'"
                    :value="setting.min_value"
                    :suffix="setting.sensorType.unit"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3 :key="setting.sensorType.name +'_max'">              
                <v-text-field :key="setting.sensorType.name"
                    :label="setting.sensorType.name + ' 하한'"
                    :value="setting.max_value"
                    :suffix="setting.sensorType.unit"
                ></v-text-field>
              </v-flex>
            </template>
            <v-progress-linear v-bind:indeterminate="true" v-if="!settings"></v-progress-linear>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 md6 v-for="rule in alarmRules" :key="rule.name">
              <v-card>
                <v-card-title primary-title>
                  <v-layout align-content-space-between>
                    <v-flex>
                      <div
                        class="headline"
                        :style="{
                          'border-bottom': `5px solid ${rule.color || '#FFC4C4'}`
                        }">{{ rule.name }}
                      </div>
                      <div class="name"> {{ rule.sensorType.name }} </div>
                    </v-flex>
                    <v-flex>
                      <h2 class="value">
                        {{ rule.rule.split('value ')[1] }}{{ rule.sensorType.unit }}
                      </h2>
                    </v-flex>
                  </v-layout>
                </v-card-title>
              </v-card>
            </v-flex>
          <v-progress-linear v-bind:indeterminate="true" v-if="!alarmRules"></v-progress-linear>
        </v-layout>
        </v-container>
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

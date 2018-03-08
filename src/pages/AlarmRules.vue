<template>
    <div class="section">
        <div class="div-block-3 home">
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
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  
  import { API_BASE } from '@/global'
  import ZoneIdMixin from '@/mixins/ZoneIdMixin'

  export default {
    mixins: [ZoneIdMixin],
    data () {
      return {
        alarmRules: null
      }
    },
    watch: {
    	'$store.state.zone': function () {
        this.getAlarmRules()
      },
    },
    mounted () {
      this.getAlarmRules()
    },
    methods: {
      getAlarmRules  () {
        this.alarmRules = null
        if (!this.$store.state.zone) { return; }
        const RULES_API = `${API_BASE}/zones/${this.$store.state.zone.id}/alarmRules`
        axios.get(RULES_API).then(res => {
          this.alarmRules = res.data.alarmRules
        })
      }
    }
  }
</script>

<style lang="css" scoped>
  .name {
    margin-top: 15px;
    margin-left: 5px;
  }

  .value {
    color: #999;
    font-weight: lighter;
  }
</style>

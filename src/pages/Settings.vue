<template>
  <div class="section zone" >
    <v-container grid-list-lg text-xs-center>
      <v-layout row wrap>
        <template v-for="setting in settings">
          <v-flex xs12 sm6 md3 :key="setting.sensorType.name">
            <v-text-field :key="setting.sensorType.name"
                :label="setting.sensorType.name + ' 상한'"
                :value="setting.min_value"
                :suffix="setting.sensorType.unit"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3 :key="setting.sensorType.name">              
            <v-text-field :key="setting.sensorType.name"
                :label="setting.sensorType.name + ' 하한'"
                :value="setting.max_value"
                :suffix="setting.sensorType.unit"
            ></v-text-field>
          </v-flex>
        </template>
        <v-progress-linear v-bind:indeterminate="true" v-if="!settings"></v-progress-linear>
      </v-layout>
    </v-container>
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
        settings: null
      }
    },
    watch: {
    	'$store.state.zone': function () {
        this.getSettings()
      },
    },
    mounted () {
      this.getSettings()
    },
    methods: {
      getSettings () {
        this.settings = null
        if (!this.$store.state.zone) { return; }
        const SENSORTYPES_API = `${API_BASE}/v1/zones/${this.$store.state.zone.id}/sensorTypes`
        axios.get(SENSORTYPES_API).then(res => {
          this.settings = res.data
        })
      }
    }
  }
</script>

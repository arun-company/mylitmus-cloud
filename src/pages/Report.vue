<template>
    <div class="section zone">
      <main>
        <v-container grid-list-lg text-xs-center>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <date-selector label="시작날짜" :date.sync="range.dateFrom" :allowed-dates="beforeToday"/>
            </v-flex>
            <v-flex xs12 md6>
              <date-selector label="종료날짜" :date.sync="range.dateTo" :allowed-dates="afterDateFrom" at-the-end="true" />
            </v-flex>
            <v-flex xs12>
              <v-card>
                <min-max-average-graph 
                  title="온도" 
                  color="#ee513b" 
                  :averages="averages.temperature" 
                  :ranges="ranges.temperature" 
                  :min-value="getMinMax('temperature', 'min_value')"
                  :max-value="getMinMax('temperature', 'max_value')"
                  sensorType="temperature"
                  :alarmEvents="alarmEvents"
                  :alarmRules="alarmRules"
                  unit="℃"
                />
              </v-card>
              <v-card class="mt-2">
                <min-max-average-graph 
                  title="습도" 
                  color="#9badff" 
                  :averages="averages.humidity" 
                  :ranges="ranges.humidity"
                  :min-value="getMinMax('humidity', 'min_value')"
                  :max-value="getMinMax('humidity', 'max_value')"
                  sensorType="humidity"
                  :alarmEvents="alarmEvents"
                  :alarmRules="alarmRules"
                  unit="%"
                />
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-card>
                <node-map :selectionEnabled="false"></node-map>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </main>
    </div> 
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'

  import { API_BASE } from '@/global'
  import DateSelector from '@/components/DateSelector'
  import MinMaxAverageGraph from '@/components/charts/MinMaxAverageGraph'
  import NodeMap from '@/components/NodeMap'
  import ZoneIdMixin from '@/mixins/ZoneIdMixin'
  
  export default {
    components: { DateSelector, MinMaxAverageGraph, NodeMap },
    mixins: [ZoneIdMixin],
    data () {
      return {
        range: {
          dateFrom: moment().startOf('day').format(),
          dateTo: moment().endOf('day').format(),
        },
        averages: { temperature: null, humidity: null },
        ranges: { temperature: null, humidity: null },
        unit: { temperature: null, humidity: null },
        sensorTypes: [],
        alarmEvents: [],
			  alarmRules: [],
      }
    },
    watch: {
      'range.dateFrom': function () {
        this.getData()
      },
      'range.dateTo': function () {
        this.getData()
      },
    	'$store.state.zone': function () {
        this.getData()
    	}
    },
    mounted () {
      this.getData()
    },
    methods : {
      getData () {
        if (!this.$store.state.zone) { return }

        // TODO : sensortypes API를 이용해서 자동으로 그려지도록 변경
        const TEMP_API = `${API_BASE}/zones/${this.$store.state.zone.id}/sensorTypes/${'temperature'}/measures/timeSeries`;
        const HUM_API = `${API_BASE}/zones/${this.$store.state.zone.id}/sensorTypes/${'humidity'}/measures/timeSeries`;
        const SENSOR_MIN_MAX_API = `${API_BASE}/zones/${this.$store.state.zone.id}/sensorTypes`;
        const EVENTS_API = `${API_BASE}/zones/${this.$store.state.zone.id}/alarmEvents`
			  const RULES_API = `${API_BASE}/zones/${this.$store.state.zone.id}/alarmRules`
        axios.all([
          axios.get(TEMP_API, { params: this.range }),
          axios.get(HUM_API, { params: this.range }),
          axios.get(SENSOR_MIN_MAX_API),
          axios.get(EVENTS_API, {params: {...this.range, eventwise: true} }),
          axios.get(RULES_API, { params: this.range }),
        ])
        .then(res => {
          this.averages.temperature = res[0].data.timeSeries.map(datum => [moment(datum.measuredAt).valueOf(), datum.avg])
          this.ranges.temperature = res[0].data.timeSeries.map(datum => [moment(datum.measuredAt).valueOf(), datum.min, datum.max])
          this.averages.humidity = res[1].data.timeSeries.map(datum => [moment(datum.measuredAt).valueOf(), datum.avg])
          this.ranges.humidity = res[1].data.timeSeries.map(datum => [moment(datum.measuredAt).valueOf(), datum.min, datum.max])
          this.sensorTypes = res[2].data
          this.alarmEvents = res[3].data
			  	this.alarmRules = res[4].data.alarmRules
        })
      },
      beforeToday (date) {
        return moment(date).isBefore(moment())
      },
      afterDateFrom (date) {
        return this.range.dateFrom && moment(date).isAfter(moment(this.range.dateFrom)) && this.beforeToday(date)
      },
      getMinMax(uid, minmax) {
        const sensorType = this.sensorTypes.find(element => element.sensorType.uid === uid) || {}
        return sensorType[minmax] || 0
      },
    }
  }
</script>

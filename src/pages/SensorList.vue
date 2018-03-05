<template>
	<main>
  	<v-slide-y-transition mode="out-in">
  	  <v-container grid-list-lg text-xs-center>
  	  	<v-layout row wrap>
					<v-flex xs12>
						<v-card>
							<node-map @onSelectNode="selectNode($event.id)"></node-map>
						</v-card>
					</v-flex>
          <v-flex xs12>
						<v-layout row wrap>
							<v-flex xs12 v-if="!id">
								<v-card><v-card-text>{{ !$store.state.zone ? '리스트 로딩 중..' : '센서를 선택해 주세요' }}</v-card-text></v-card>
							</v-flex>
							<v-flex xs4 v-for="info in node_info" :key="info ? info.key : null" v-else>
								<text-card size="4" :data="info ? { desc: info.key, value: info.value, subtitle: info.subtitle } : null"></text-card>
							</v-flex>
						</v-layout>
						<v-progress-linear v-bind:indeterminate="true" v-if="loading.info"></v-progress-linear>
						<v-card class="mt-2" v-if="chartData.temperature && chartData.humidity">
							<duration-selector :duration.sync="duration" />
							<v-btn-toggle mandatory v-model="chartType" class="mt-2 mb-2">
								<v-btn flat value="column">
										<span>Column</span>
								</v-btn>
								<v-btn flat value="line">
										<span>Line</span>
								</v-btn>
								<v-btn flat value="scatter">
										<span>Scatter</span>
								</v-btn>
							</v-btn-toggle>
							<highcharts :options="chartData.temperature"></highcharts>
							<highcharts :options="chartData.humidity"></highcharts>
						</v-card>
          </v-flex>
        </v-layout>
  	  </v-container>
  	</v-slide-y-transition>
  </main>
</template>

<script type="text/javascript">
import axios from 'axios'
import moment from 'moment'

import NodeMap from '@/components/NodeMap'
import TextCard from '@/components/dashboard/TextCard'
import DurationSelector from '@/components/DurationSelector'

import { API_BASE } from '@/global'
import { toFixedNumber } from '@/util'
import ZoneIdMixin from '@/mixins/ZoneIdMixin'

export default {
	props: ['id'],
	components: { NodeMap, TextCard, DurationSelector },
	mixins: [ZoneIdMixin],
	data () {
		return {
			node: null,
			measures: [],
			sensorTypes: [],
			alarmEvents: [],
			alarmRules: [],
			loading: { list: true, info: false },
			headers: [{text: '센서ID', value: 'id', align: 'center'}],
			node_headers: [{text: '데이터', value: 'info', align: 'center'}, {text: '값', value: 'info', align: 'center'}],
			duration: '-24h',
			chartType: 'line',
			chartData: { 'temperature': null, 'humidity': null },
		}
	},
  watch: {
		'$store.state.zone': function () {
			this.getSensorTypes()
		},
		id: function () {
			this.selectNode(this.id)
		},
		duration: function () {
			this.getMeasuresFromRemote(this.id)
		},
		chartType: function () {
			this.getMeasuresFromRemote(this.id)
		},
	},
	mounted () {
		this.getSensorTypes()
		this.selectNode(this.id)
	},
	computed: {
		node_info () {
			if (!this.node) { return new Array(3) }
			return [
				{key: '센서 이름', value: this.node.name, subtitle: this.node.name === this.node.id ?  '' : `(${this.node.id})`},
				{key: '온도', value: `${this.getMeasureString(this.node, 'temperature')}`},
				{key: '습도', value: `${this.getMeasureString(this.node, 'humidity')}`},
			]
		},
	},
	methods: {
		getSensorTypes() {
			if (!this.$store.state.zone) { return }

			this.chartData = {}
			const SENSOR_MIN_MAX_API = `${API_BASE}/zones/${this.$store.state.zone.id}/sensorTypes`;
			axios.get(SENSOR_MIN_MAX_API).then(res => {
				this.sensorTypes = res.data
			})
		},
		selectNode(id) {
			if (!this.$store.state.zone) { return }

			this.chartData = {}
			this.node = null

			if (!id) {
				return
			}

			if (id !== this.id) {
				this.$router.push(`/sensor-list/${this.$store.state.zone.id}/${id}`)
				return
			}
			
			this.loading.info = true
			const NODE_API = `${API_BASE}/nodes/${id}`
			axios.get(NODE_API).then(res => {
				this.node = res.data
			});
			this.getMeasuresFromRemote(id)
		},
		getMeasuresFromRemote(id) {
			this.loading.info = true
			const NODE_MEASURES_API = `${API_BASE}/nodes/${this.id}/measures`
			const EVENTS_API = `${API_BASE}/zones/${this.$store.state.zone.id}/alarmEvents`
			const RULES_API = `${API_BASE}/zones/${this.$store.state.zone.id}/alarmRules`
			axios.all([
				axios.get(NODE_MEASURES_API, { params: { dateFrom: this.duration }}),
				axios.get(EVENTS_API, { params: { dateFrom: this.duration }}),
				axios.get(RULES_API),
			]).then(res => {
				this.measures = res[0].data.measures
				this.alarmEvents = res[1].data.filter(event => event.nodeId === id)
				this.alarmRules = res[2].data.alarmRules
				this.chartData.temperature = this.chart_data('온도', '온도 (℃)', '#ee513b', this.getMinMax('temperature', 'min_value'), this.getMinMax('temperature', 'max_value'), '℃', '온도', this.measures.filter(measure => measure.sensorType.uid === 'temperature'), 'temperature')
				this.chartData.humidity = this.chart_data('습도', '습도 (%)', '#9badff', this.getMinMax('humidity', 'min_value'), this.getMinMax('humidity', 'max_value'), '%', '습도', this.measures.filter(measure => measure.sensorType.uid === 'humidity'), 'humidity')
				this.loading.info = false
			});
		},
		getMeasureString(node, measureType) {
			const measure = this.node.currentMeasures.find(measure => measure.uid === measureType)
			if (!measure) { return '값 없음' }
			return `${measure.value.toFixed(2)}${measure.unit}`
		},
		getMinMax(uid, minmax) {
			const sensorType = this.sensorTypes.find(element => element.sensorType.uid === uid) || {}
			return sensorType[minmax] || 0
		},
		chart_data(title, yAxisTitle, color, min, max, unit, seriesTitle, measures, sensorType) {
			// TODO 알람이 과거에는 존재하고 현재 없어진 경우, plotband subtitle에는 표시되지 않는 이슈가 있다.
			return {
				chart: { type: this.chartType, zoomType: 'x' },
				title: { text: title },
				subtitle: {
				  text: this.alarmRules.filter(rule => rule.sensorType.uid === sensorType).map(rule => `<span style="background-color: ${rule.color || '#FFC4C4'}; margin: 2px;">${rule.name}</span>`).join(''),
				  useHTML: true,
				  verticalAlign: 'bottom'
        },
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						day: '%b %e일'
					},
				  plotBands: this.getPlotBands(sensorType),
				},
			    yAxis: {
			      title: { text: yAxisTitle },
				  min, max
				},
			    tooltip: { valueSuffix: unit },
			    legend: {
			      layout: 'vertical',
			      align: 'right',
			      verticalAlign: 'middle',
			      borderWidth: 0
				},
				plotOptions: {
				  scatter: {
            marker: {
                radius: 2,
                states: {
                    hover: {
                        enabled: true,
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.key}</b><br>',
                pointFormat: '{series.name} {point.y}{unit}'
            }
        	}
				},
				series: [{
				name: seriesTitle,
				color,
					data: measures.map(measure => [moment(measure.measuredAt).valueOf(), toFixedNumber(measure.value, 2)])
				}]
			}
		},
		getPlotBands(sensorType) {
			const bands = this.alarmEvents.filter(e => e.sensorType.uid === sensorType).map(alarmEvent => {
				return {
					color: this.getBandColor(alarmEvent),
					from: moment(alarmEvent.startedAt).valueOf(),
					to: moment(alarmEvent.finishedAt).valueOf(),
				}
			})
			return bands
		},
		getBandColor(event) {
			const rule = this.alarmRules.find(rule => rule.name === event.alarmName) || {}
			return rule.color || '#FFC4C4'
		}
	}
}
</script>

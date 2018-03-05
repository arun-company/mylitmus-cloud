<template>
  <highcharts :options="options" v-if="options"></highcharts>
</template>

<script>
  import moment from 'moment'
  
  export default {
    props: ['alarmEvents', 'alarmRules', 'title', 'ranges', 'averages', 'color', 'minValue', 'maxValue', 'unit', 'sensorType'],
    data: () => ({ options: null }),
    mounted () {
      this.makeOptions()
    },
    watch: {
      averages: function () { this.makeOptions() },
      ranges: function () { this.makeOptions() },
    },
    methods: {
      makeOptions () {
        if (!this.averages || !this.ranges) { return null }
        this.options =  {
          chart: { zoomType: 'x' },
          title: {
            text: this.title
          },
          subtitle: {
				    text: this.alarmRules.filter(rule => rule.sensorType.uid === this.sensorType).map(rule => `<span style="background-color: ${rule.color || '#FFC4C4'}; margin: 2px;">${rule.name}</span>`).join(''),
				    useHTML: true,
				    verticalAlign: 'bottom'
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%b %e일'
            },
            plotBands: this.getPlotBands(this.sensorType),
          },
          yAxis: {
            title: {
              text: null
            },
            min: this.minValue,
            max: this.maxValue
          },
          tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: this.unit
          },
          series: [
            {
              name: this.title,
              data: this.averages,
              zIndex: 1,
              marker: {
                fillColor: 'white',
                lineColor: this.color,
                lineWidth: 2,
              }
            }, {
              name: 'Range',
              data: this.ranges,
              type: 'arearange',
              lineWidth: 0,
              linkedTo: ':previous',
              color: this.color,
              fillOpacity: 0.3,
              zIndex: 0,
              marker: {
                enabled: false
              }
            }
          ]
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

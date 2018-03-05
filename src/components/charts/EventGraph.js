import { Bar, mixins } from 'vue-chartjs'
const { reactiveData } = mixins

export default Bar.extend({
	mixins: [reactiveData],
  props: ['label', 'events'],
  data () {
  	return {
      options: {
        scales: { 
          yAxes: [{ ticks: { stepSize: 1 } }] 
        },
        responsive: true,
        maintainAspectRatio: false,
      }
  	}
  },
  watch: {
  	events () {
  		this.fillData()
  	}
  },
  methods: {
  	fillData () {
  		const label = (length) => [...new Array(length)].map((p, i) => {
        if (i % 6 === 0) {
          return `-${24 - i}h`
        } else { return '' }
      })
  		this.chartData = {
  		  labels: this.events.map(event => event.date),
  		  datasets: [
  		    {
  		      label: this.label,
  		      borderColor: '#80d8ff',
  		      data: this.events.map(event => event.count),
  		    },
  		  ]
  		}
  	},
  },	
  mounted () {
    this.fillData()
    this.renderChart(this.chartData, this.options)
  }
})
<template>
    <div class="section">
    <div class="w-container">
      <h1 class="heading">{{headerTitle}}</h1>
    </div>
    <div class="div-block-15">    
      <div v-for="site in filteredItems" class="reporting-all" v-bind:key="site.id">
        <div class="div-block-reporting">
          <div class="div-block-10"><router-link :to="'/site/'+site.id" class="heading-3">사이트 - {{site.name}}</router-link>
            <div class="div-block-alerts">
              <div class="div-block-13">
                <div class="text-block-7">존</div>
                <div class="text-block-7">{{items.length}}곳</div>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="div-block-7 view-all"><img src="public/images/call.png" width="20" height="20" title="전화번호">
              <div class="text-block-6">{{site.mobilePhone ? site.mobilePhone:'-'}}</div>
            </div>
            <div class="div-block-7 view-all"><img src="public/images/email.png" width="20" height="20" title="이메일">
              <div class="text-block-6">{{site.email ? site.email:'-'}}</div>
            </div>
            <div class="div-block-7 view-all address"><img src="public/images/location.png" width="20" height="20" title="주소">
              <div class="text-block-6">{{site.address ? site.address:'-'}}</div>
            </div>
          </div>  
          <!-- END OF SITE DETAIL -->
          <zone-list :key="site.id" :siteid="site.id"></zone-list>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import ZoneList from '@/components/ZoneList'
  // import TextCard from '@/components/dashboard/TextCard'
  // import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'
  import { toFixedNumber } from '@/util'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'

  export default {
    components: { ZoneList },
    data () {
      this.$store.state.menuItems =  [
          {id:1, name:'대시보드', icon:'005-dashboard.png', path:'/', class:''},
          {id:2, name:'보고서', icon:'004-profit-report.png', path:'/home-reporting', class:''},
          {id:3, name:'설정', icon:'001-cogwheel.png', path:'/home-settings', class:''},
          {id:4, name:'전체 보기', icon:'003-signs.png', path:'/view-all' , class:'w--current'},
        ]
      this.$store.state.switch = [
          {id:1, name:'자동스크롤', icon:'switch-off.png', path:'#'},
          {id:2, name:'자동스크롤', icon:'switch-on.png', path:'#'},
      ]
      return {
         // measures:{},
        measures : [],
        tempZone:'',
        search: '',
        zones:[],
        open: this.drawer,
        headerTitle: 'Organization',
        searchTitle: '사이트 검색 ...',
        detail_zone: [],
        items: [
          
        ],
        sensorTypes: [{"sensorType":{"name":"온도","uid":"temperature","unit":"℃"},"min_value":5.0,"max_value":40.0},{"sensorType":{"name":"습도","uid":"humidity","unit":"%"},"min_value":0.0,"max_value":100.0}],
        alarmEvents: [],
        alarmRules: [],
        loading: { list: true, info: false },
        duration: '-24h',
        chartType: 'line',
        chartData: { 'temperature': null, 'humidity': null },
      }
    },
    computed:
    {
      filteredItems:function()
      {
        var self=this
        return this.items.filter(function(item){return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
      },
      getNodes : function () {
        return this.nodes
      },
      getNode3 : function() {
        if (this.nodeAll[3])
          return this.nodeAll[3]
        else return []
      }
      
    },
    mounted () {
      this.getSite()
    },
    methods: {
      getSite() {
        var ORGS_API = API_BASE + "/users/self/orgs"
        axios.get(ORGS_API).then(res => {
          this.org = res.data[0]
          this.headerTitle = this.org.name
          var SITE_API = API_BASE + '/orgs/'+this.org.id+'/sites'
          axios.get(SITE_API).then(res => {
            this.items = res.data
            this.getAllZones()
          })
        })
      },
      setZoneLocal: function(zone) {
        var self=this;
        localStorage.setItem('zone', JSON.stringify(zone));
        localStorage.setItem('zoneid', zone.id);
        localStorage.setItem('zonename', zone.name);
        this.$router.push('/zone')
        return
      },
      getSensors(zoneId) {
          var NODES = `${API_BASE}/zones/`+ zoneId + '/nodes'
          axios.get(NODES).then(response => {
              return response.data
          })

      },
      getAllZones () {
          var ZONE_API = 
          axios.get(ZONES_API).then(res => {
          this.zones = res.data;
          localStorage.setItem('zones', JSON.stringify(this.zones))
        })
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
      getSensorTypes() {     
        this.chartData = {}
        const SENSOR_MIN_MAX_API = `${API_BASE}/zones/3/sensorTypes`;
        axios.get(SENSOR_MIN_MAX_API).then(res => {
          this.sensorTypes = res.data
        })
		  },
    }
  }
</script>

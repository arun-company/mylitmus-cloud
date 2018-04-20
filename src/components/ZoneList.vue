<template>
  <div>
    <div v-for="zone in zones" class="div-block-reporting" v-bind:key="zone.name">
          <zone-component v-bind:zoneid="zone.id" v-bind:zonename="zone.name"></zone-component>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import ZoneComponent from '@/components/ZoneComponent'
  import { ZONES_API, ZONE_INFO_API, API_BASE } from '@/global'

  export default {
    components: { ZoneComponent },
    watch: {
    },
    props: ['siteid','zoneid'],
    data() {
       return {
         zones:[]
       }
    },
    watch: {
    },
    mounted () { 
      this.getZones() 
      
    },
    methods: {
       getZones() {
        this.loading=true
        var ZoneAPI = API_BASE + "/sites/"+this.siteid+"/zones"
        axios.get(ZoneAPI).then(res => {
          this.zones = res.data
          console.log(this.zones)
          var self = this;
          self.loading = false;
        })
      },
    }
  }
</script>
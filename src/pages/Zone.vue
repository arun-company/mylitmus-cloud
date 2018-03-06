<template>
  <div class="section zone">
    <div class="div-block-3 home">
      <div class="div-block-4">
          <router-link class="link" to="/">
            Home
          </router-link>
        <div class="text-block-5">&gt;</div>
          <router-link to="/site" class="link">
            Site
          </router-link>
        <div class="text-block-5">&gt;</div>
        <div class="text-block-5">Zone</div>
      </div>
      <div class="div-block-4 search">
        <input id="search-box" keyup="reverseMessage" class="w-input" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
    </div>

    <div class="w-container">
      <h1 class="heading">{{headerTitle}}</h1>
    </div>

    <div class="div-block-5">
      <div class="text-block-4">Map Area</div>
    </div>

    <router-link class="div-block-2 w-inline-block" v-for="key in items" to="#">
      <div class="text-block-3">{{ key.name }}</div>
      <div class="text-block-4">{{ key.description }}</div>
    </router-link>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  import moment from 'moment'

  import EventGraph from '@/components/charts/EventGraph'
  import TextCard from '@/components/dashboard/TextCard'
  import ServiceStatusBar from '@/components/dashboard/ServiceStatusBar'

  export default {
    components: { EventGraph, TextCard, ServiceStatusBar },
    data () {
        this.$store.state.menu = true
        return {
          headerTitle: "Zone",
          searchTitle: "Search sensors ...",
          items: [
            {id:1, name:"Sensor1", description:"1"},
            {id:2, name:"Sensor2", description:"2"},
            {id:3, name:"Sensor3", description:"3"},
            {id:4, name:"Sensor4", description:"4"}
          ],
        }
      },
      methods: {
        reverseMessage: function () {
          this.searchTitle = 'Hello world'
        }
      }


  }
</script>

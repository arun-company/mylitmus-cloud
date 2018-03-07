<template>
    <div class="section">
      <div class="div-block-3 home">
        <div class="div-block-4">
          <div class="text-block-5">Home</div>
        </div>
        <div class="div-block-4 search">
          <input id="search-box" class="w-input" v-model="search" type="text" :placeholder="searchTitle"><a href="#" class="w-inline-block"><img src="public/images/search.333333.png" width="20" height="20" class="image"></a></div>
      </div>
      <div class="w-container">
        <h1 class="heading">{{headerTitle}}</h1>
      </div>

      <router-link to="/site" class="div-block-2 w-inline-block" v-for="(key, index) in filteredItems">
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
      this.$store.state.menu = false
      return {
        search: '',
        open: this.drawer,
        headerTitle: 'Organization Name',
        searchTitle: 'Search sites ...',
        items: [
          {id:1, name:"Default Site",description:"1"},
        ],
      }
    },
    computed:
    {
      filteredItems:function()
      {
        var self=this;
        return this.items.filter(function(item){return item.name.toLowerCase().indexOf(self.search.toLowerCase())>=0;});
      }
    }
  }
</script>

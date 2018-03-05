<template>
  <section class="container">
       <div class="section top">
          <div class="div-block-3">
            <div class="div-block-4"><a href="/" class="link">Home</a>
              <div class="text-block-5">&gt;</div>
              <div class="text-block-5">Site</div>
            </div>
            <Search v-if="search" :data="'Hello World'"/>
          </div>
          <div class="w-container">
            <h1 class="heading">Site Name</h1>
          </div>

          <div class="div-block-5">
            <div class="text-block-4">Map Area</div>
          </div>
          <nuxt-link :to="'/zone?' + key.id" v-for="(key, index) in zones" :key="index" class="div-block-2 w-inline-block">
                <div class="text-block-3">{{key.name}}</div>
                <div class="text-block-4">{{key.description}}</div>
          </nuxt-link>
        </div>
  </section>
</template>

<script>
  import Search from '~/components/Search.vue'
  export default {
    components: {
      Search,
    },
    data() {
    return {
      search: 1
    }
  },
  async asyncData({ app, store }) {
    // TODO get zone cookies
    var zones = [{id:1, name:"Default Zone", description:"Zone 1"}];
//    app.$axios.setHeader('Authorization', 'token ' + localStorage.getItem('token'));
//    const zone = await app.$axios.$get('https://mylitmus.cloud/v1/users/self/zones/');
    return { zones}
  }
  }
</script>

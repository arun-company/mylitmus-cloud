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
          <nuxt-link :to="'/zone?' + key " v-for="(key, index) in 12" :key="index" class="div-block-2 w-inline-block">
                <div class="text-block-3">Zone {{key}}</div>
                <div class="text-block-4">{{key}}</div>
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
  asyncData({ store, route, userAgent }) {
    return {
      userAgent
    }
  }
  }
</script>

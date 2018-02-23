<template>
  <section class="container">
      <div class="section">
        <div class="div-block-3 home">
          <Search v-if="search"/>
        </div>
        <div class="w-container">
          <h1 class="heading">Organization Name</h1>
        </div>
        <nuxt-link :to="'/site?' + key" v-for="(key, index) in 12" :key="index" class="div-block-2 w-inline-block">
              <div class="text-block-3">Site {{ key }}</div>
              <div class="text-block-4">{{ key }}</div>
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
        search: 1,
      }
    },

    asyncData({ store, route, userAgent }) {
        return {
          userAgent
        }
      }
  }
</script>

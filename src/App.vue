<template>
  <v-app light>
    <Toolbar :drawer.sync="drawer" v-if="$store.getters.isAuthenticated && this.$store.state.menu"></Toolbar>
    <div class="hidden">
    <zone-selector></zone-selector>
    </div>
    <div data-collapse="none" data-animation="over-right" data-duration="400" class="navbar w-nav">
      <a href="/" class="brand w-nav-brand">
        <div class="text-block-2">Litmus.Cloud</div>
      </a>
      <nav role="navigation" class="nav-menu w-nav-menu"><a v-if="$store.getters.isAuthenticated"  @click='logout' class="nav-link w-nav-link">Sign out</a></nav>
      <div class="menu-button w-nav-button">
        <div class="w-icon-nav-menu"></div>
      </div>
    </div>
    <router-view></router-view>
  </v-app>
</template>
<style>
  #search-box {
    border: none;
    background: transparent;
    text-align: right;
    vertical-align: bottom;
    padding-bottom: 0;
    margin-bottom: 0;
  }
</style>
<script>
  import auth from '@/auth'
  import Toolbar from '@/components/Toolbar'
  import ZoneSelector from '@/components/ZoneSelector'

  export default {
    components: { Toolbar, ZoneSelector },
    data (state) {
      return {
        drawer: false,
        title: 'Litmus --- Cloud',
      }
    },
    created() {
      let jQuery = document.createElement('script')
      jQuery.setAttribute('src', 'https://code.jquery.com/jquery-3.3.1.min.js')
      document.head.appendChild(jQuery)
    },
    methods: {
      logout () {
        auth.logout()
      }
    }
  }
</script>

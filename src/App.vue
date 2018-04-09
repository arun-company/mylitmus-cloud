<template>
  <v-app light>
    <Toolbar :drawer.sync="drawer" v-if="$store.getters.isAuthenticated"></Toolbar>
    <div data-collapse="none" data-animation="over-right" data-duration="400" class="navbar w-nav">
      <router-link to="/" class="brand w-nav-brand">
        <div class="text-block-2">Litmus.Cloud</div>
      </router-link>
      <nav role="navigation" class="nav-menu w-nav-menu"><a v-if="$store.getters.isAuthenticated"  @click='logout' class="nav-link w-nav-link">로그아웃</a></nav>
      <div class="menu-button w-nav-button">
        <div class="w-icon-nav-menu"></div>
      </div>
    </div>
    <router-view></router-view>
  </v-app>
</template>
<script>
  import auth from '@/auth'
  import Toolbar from '@/components/Toolbar'
  // import ZoneSelector from '@/components/ZoneSelector'

  export default {
    components: { Toolbar },
    data (state) {
      return {
        drawer: false,
        title: 'Litmus - Cloud Client',
      }
    },
    created() {
      document.title = this.title
      let litmus_js = document.createElement('script')
      litmus_js.setAttribute('src', 'public/js/webflow.js')
      document.head.appendChild(litmus_js)
    },
    methods: {
      logout () {
        auth.logout()
      }
    }
  }
</script>

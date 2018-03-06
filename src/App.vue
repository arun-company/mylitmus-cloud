<template>
  <v-app light>
    <Toolbar :drawer.sync="drawer" v-if="$store.getters.isAuthenticated || $store.state.menu"></Toolbar>
    <!--<v-toolbar class="secondary" fixed>-->
      <!--<v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="$store.getters.isAuthenticated"></v-toolbar-side-icon>-->
      <!--&lt;!&ndash;<v-toolbar-title @click.stop="$router.push('/dashboard')" class="white&#45;&#45;text hidden-sm-and-down" v-text="title" style="cursor: pointer"></v-toolbar-title>&ndash;&gt;-->
      <!-- -->
      <!--<zone-selector></zone-selector>-->
      <!--<v-spacer></v-spacer>-->
    <!--</v-toolbar>-->
    <div data-collapse="none" data-animation="over-right" data-duration="400" class="navbar w-nav">
      <a href="/" class="brand w-nav-brand">
        <div class="text-block-2">Litmus.Cloud</div>
      </a>
      <nav role="navigation" class="nav-menu w-nav-menu"><a v-if="$store.getters.isAuthenticated"  @click='logout' href="/" class="nav-link w-nav-link">로그아웃</a></nav>
      <div class="menu-button w-nav-button">
        <div class="w-icon-nav-menu"></div>
      </div>
      <router-view></router-view>
    </div>

  </v-app>
</template>

<script>
  import auth from '@/auth'
  import Toolbar from '@/components/Toolbar'
  import ZoneSelector from '@/components/ZoneSelector'

  export default {
    components: { Toolbar, ZoneSelector },
    data (state) {
      return {
        drawer: false,
        title: 'Litmus.Cloud',
      }
    },
    methods: {
      logout () {
        auth.logout()
      }
    }
  }
</script>

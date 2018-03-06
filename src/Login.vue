<template>
  <v-app light>
    <sidebar :drawer.sync="drawer" v-if="$store.getters.isAuthenticated || drawer"></sidebar>
    <v-toolbar class="secondary" fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="$store.getters.isAuthenticated"></v-toolbar-side-icon>
      <v-toolbar-title @click.stop="$router.push('/dashboard')" class="white--text hidden-sm-and-down" v-text="title" style="cursor: pointer"></v-toolbar-title>
      <zone-selector></zone-selector>
      <v-spacer></v-spacer>
      <v-btn
        class="white--text"
        flat
        v-if='$store.getters.isAuthenticated'
        @click='logout'>Logout</v-btn>
    </v-toolbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
  import auth from '@/auth'
  import Sidebar from '@/components/Sidebar'
  import ZoneSelector from '@/components/ZoneSelector'

  export default {
    name: 'login',
    components: { Sidebar, ZoneSelector },
    data () {
      return {
        drawer: false,
        title: 'Litmus.Login',
      }
    },
    methods: {
      logout () {
        auth.logout()
      }
    }
  }
</script>

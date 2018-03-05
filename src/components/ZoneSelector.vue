<template>
  <v-menu :nudge-width="100" class="white--text" v-if="this.$store.state.zones.length">
    <v-toolbar-title slot="activator">
      <span v-if="this.$store.state.zone">{{this.$store.state.zone.name}}</span>
      <span v-else>로드 중..</span>
      <v-icon dark>arrow_drop_down</v-icon>
    </v-toolbar-title>
    <v-list>
      <v-list-tile
        v-for="zone in this.$store.state.zones"
        :key="zone.id"
        @click="$store.dispatch('setZone', { zoneId: zone.id, shouldClear: true })">
        <v-list-tile-title v-text="zone.name"></v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    watch: {
      '$store.state.token': function () { this.loadZone(true) },
    },
    mounted () { this.loadZone(true) },
    methods: {
      loadZone (shouldSetZone) {
        if (this.$store.state.token) {
          this.$store.dispatch('loadZone', shouldSetZone)
        } else {
          this.$store.commit('setZones', [])
        }
      }
    }
  }
</script>

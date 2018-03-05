<template>
  <v-btn-toggle mandatory v-model="localDuration" class="mt-2 mb-2">
      <v-btn flat value="-1h">
          <span>1h</span>
      </v-btn>
      <v-btn flat value="-6h">
          <span>6h</span>
      </v-btn>
      <v-btn flat value="-24h">
          <span>24h</span>
      </v-btn>
      <v-btn flat value="-7d">
          <span>7d</span>
      </v-btn>
      <v-btn flat value="-30d">
          <span>30d</span>
      </v-btn>
  </v-btn-toggle>
</template>

<script>
  export default {
    props: ['duration'],
    data () {
      return {
        localDuration: this.duration,
      }
    },
    watch: {
      localDuration () {
        this.$emit('update:duration', this.localDuration)
      }
    }
  }
</script>

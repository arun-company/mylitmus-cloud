<template>
  <div>
    <h2>HELLO WORLD</h2>
    <h3>{{ zonename }}</h3>
  </div>
</template>

<script>
  export default {
    props: ['zonename'],
    watch: {
      zonename: function () {
        this.zonename = this.zonename
      },
    },
    data () {
      return {
        zonename: this.zonename,
      }
    },
     created() {
     
    },
    mounted () {
     
    }
  }
</script>

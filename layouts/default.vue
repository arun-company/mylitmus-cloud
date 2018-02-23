<template>
  <div>
    <no-ssr>
      <Menu />
    </no-ssr>
    <nuxt/>
  </div>
</template>

<script>
  import Menu from '~/components/Menu.vue'

  export default {
    components: {
      Menu
    },
    head: {
      bodyAttrs: {
        class: 'body'
      }
    }
  }
</script>
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

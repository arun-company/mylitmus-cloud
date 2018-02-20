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
    }
  }
</script>

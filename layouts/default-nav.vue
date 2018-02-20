<template>
  <div>
    <no-ssr>
      <MenuNav />
    </no-ssr>
    <nuxt/>
  </div>
</template>

<script>
  import MenuNav from '~/components/MenuNav.vue'

  export default {
    components: {
      MenuNav
    }
  }
</script>

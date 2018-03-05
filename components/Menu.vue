<template>
   <div data-collapse="none" data-animation="over-right" data-duration="400" class="navbar w-nav">
      <a href="/" class="brand w-nav-brand">
        <div class="text-block-2">Litmus.Cloud</div>
      </a>
      <nav role="navigation" class="nav-menu w-nav-menu"><a href="#" class="nav-link w-nav-link">Sign out</a></nav>
      <div class="menu-button w-nav-button">
        <div class="w-icon-nav-menu"></div>
      </div>
    </div>

</template>
<script>


export default{
  data () {
   return { todo: '' }
  },
  methods: {

    addTodo () {
      var value = this.todo && this.todo.trim()
      console.log(value);
      if (value) {
        this.$store.dispatch('addTodo', { title: value, completed: this.$route.params.slug === 'completed' })
        this.$store.dispatch('saveTodos')
        this.todo = ''
      }

//      console.log(localStorage.getItem('token')));
//       {localStorage.getItem('token')};
    }
  }
}
</script>

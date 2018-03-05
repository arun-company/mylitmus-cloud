<template>
  <section class="container">
      <div class="section">
        <div class="div-block-3 home">
          <Search v-if="search"/>
        </div>
        <div class="w-container">
          <h1 class="heading">Organization</h1>
        </div>
        <nuxt-link :to="'/site?' + key.id " v-for="(key, index) in sites" :key="index" class="div-block-2 w-inline-block">
              <div class="text-block-3">{{ key.name }}</div>
              <div class="text-block-4">{{ key.description }}</div>
        </nuxt-link>

      </div>
  </section>
</template>

<script>
  import axios from 'axios'
  import Search from '~/components/Search.vue'

  export default {
    components: {
      Search,
    },
    data() {
      return {
        search: 1,
      }
    },
    computed: {
      todos () {
        console.log(getAuthHeader());
        if (this.$route.params.slug === 'active') {
          return this.$store.getters.activeTodos
        }
        if (this.$route.params.slug === 'completed') {
          return this.$store.getters.completedTodos
        }
        return this.$store.getters.allTodos
      }
    },
    methods: {
      allDone () {
        this.$store.dispatch('allDone')
      },
      editTodo (todo) {
        this.beforeEditCache = todo.title
        this.editedTodo = todo
      },
      doneEdit (todo) {
        this.editedTodo = null
        todo.title = todo.title.trim()
        if (!todo.title) {
          this.$store.dispatch('removeTodo', todo)
        }
      },
      cancelEdit (todo) {
        this.editedTodo = null
        todo.title = this.beforeEditCache
      },
      removeTodo (todo) {
        this.$store.dispatch('removeTodo', todo)
      },
      save () {
        this.$store.dispatch('saveTodos')
      },
      getAuthHeader () {
        return `Token ${localStorage.getItem('token')}`
      }
    },
    directives: {
      'todo-focus' (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    },

    async asyncData({ app, store }) {
      var sites = [{id:1, name:"Default Site",description:"Site 1"}];
      var zone = {}
//      app.$axios.setHeader('Authorization','token ' + localStorage.getItem('token'));
//      const zone = await app.$axios.$get('https://mylitmus.cloud/v1/zones/2');
//      console.log(zone);
      return { sites, zone}
    }
  }
</script>

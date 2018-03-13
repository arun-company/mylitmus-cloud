<template>
  <div data-collapse="all" data-animation="over-left" data-duration="10" data-doc-height="1" class="navbarside w-nav">
    <div class="container w-container">
      <nav role="navigation" class="nav-menu sidebar w-nav-menu">
        <a href="#" title="Close Menu" class="link-block-2 w-inline-block">
          <img src="public/images/left-arrow-key.png" width="20" height="20">
        </a>
        <router-link v-for="(key, index) in items" :key="index" :to="key.path" :class="key.class + ' link-block-2 w-inline-block'">
          <img :src="'public/images/'+key.icon" width="20" height="20">
          <div class="text-block">{{key.name}}</div>
        </router-link>

      </nav>

      <div title="Open Menu" class="menu-button w-nav-button">
        <div class="w-icon-nav-menu"></div>
      </div>

      <div class="div-block">
        <router-link v-for="(key, index) in items" :key="index" :to="key.path" :class="key.class + ' link-block-2 w-inline-block'">
          <img :src="'public/images/'+key.icon" width="20" height="20">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['drawer'],
    watch: {
      drawer: function () {
        this.open = this.drawer
      },
      open: function () {
        this.$emit('update:drawer', this.open)
      }
    },
    data () {
      return {
        open: this.drawer,
        items: [
          {id:1, name:'Dashboard', icon:'005-dashboard.png', path:'/zone', class:''},
          // {id:2, name:'Sensor List', icon:'003-signs.png', path:'/dashboard', class:''},
          {id:3, name:'Reporting', icon:'002-sign.png', path:'/report', class:''},
          {id:4, name:'Notifications', icon:'004-alarm-clock.png', path:'/alarmrules' , class:''},
          {id:5, name:'Settings', icon:'001-cogwheel.png', path:'/settings', class:''},
        ],
      }
    },
     created() {
     
    },
    mounted () {
      this.open = this.drawer
    }
  }
</script>

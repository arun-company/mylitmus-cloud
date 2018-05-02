<template>
  <div data-collapse="all" data-animation="over-left" data-duration="10" data-doc-height="1" class="navbarside w-nav">
    <div class="container w-container">
      <nav role="navigation" class="nav-menu sidebar w-nav-menu">
        <a href="#" title="메뉴 닫기" class="link-block-2 w-inline-block">
          <img src="public/images/left-arrow-key.png" width="20" height="20">
        </a>
        <router-link v-for="(key, index) in $store.state.menuItems" :key="index" :to="key.path" :class="key.class + ' link-block-2 w-inline-block'">
          <img :src="'public/images/'+key.icon" width="20" height="20">
          <div class="text-block">{{key.name}}</div>
        </router-link>
      </nav>

      <div title="메뉴 열기" class="menu-button w-nav-button">
        <div class="w-icon-nav-menu"></div>
      </div>

      <div class="div-block">
        <router-link v-for="(key, index) in $store.state.menuItems" :title="key.name" :key="index" :to="key.path" :class="key.class + ' link-block-2 w-inline-block'">
          <img :src="'public/images/'+key.icon" width="20" height="20">
        </router-link>
      </div>
      <div class="auto-scroll-switch-block" v-for="(key, index) in $store.state.switch" :title="key.name" :key="index" :class="scroll==index?'hidden':''" @click="setActive(index)" >
        <a href="#" title="자동스크롤" class="w-inline-block">
          <img :src="'public/images/'+key.icon" width="30">
          </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['drawer', 'index'],
    watch: {
      drawer: function () {
        this.open = this.drawer
      },
      open: function () {
        this.$emit('update:drawer', this.open)
      },
      '$store.state.switch': function() {
           this.setActive(1)
      }
    },
    data () {
      return {
        open: this.drawer,
        scroll: this.index,
        interval: null,
        scrollDown:true
      }
    },
    
    mounted () {
      this.setActive(this.scroll)
      this.open = this.drawer

    },
    methods: {
      setActive(index) {
        this.scroll = index
        if (! this.scroll) {
          this.autoScroll()
        } else {
          window.clearInterval(this.$store.state.interval);
        }
      },
      
    autoScroll() {
      if (document.getElementsByClassName('div-block-15')[0].scrollHeight < (window.innerHeight-60)) {
          return;
      }
        
      var pause = false
      var TotalHeight = document.body.scrollHeight - (window.innerHeight-60);
      var increment = window.scrollY
      var timer;
      window.addEventListener('scroll', function(){
        if (increment != window.scrollY) {
            increment = window.scrollY
            if (timer) {
              window.clearTimeout(timer);
            }
            timer = window.setTimeout(function() {
                pause = false
            }, 1500);
        }
      });
      
      window.addEventListener('mousemove', function(){
        pause = true
        if (timer) {
          window.clearTimeout(timer);
        }
        timer = window.setTimeout(function() {
            pause = false
        }, 1500);
      })
      
      var scrollMove = 7
      this.$store.state.interval = setInterval(function() {
        if (!pause) {
          if (this.scrollDown) {
              increment += scrollMove
              window.scrollTo(0, increment);
          } else {
            increment -= scrollMove
            window.scrollTo(0, increment);
          }
          if (TotalHeight < increment & this.scrollDown) {
              this.scrollDown = false
              increment = TotalHeight
          } else if ( increment < 0 ) {
              this.scrollDown = true
              increment = 0
          }
        }
      }, 100);
    }
    }
  }
</script>

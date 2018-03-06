<template>
  <v-navigation-drawer
    persistent
    clipped
    v-model="open"
    enable-resize-watcher
  >
    <v-list>
      <v-list-tile
        v-for="(item, i) in items"
        :key="i"
        value="true"
        @click="$router.push(item.path)"
      >
        <v-list-tile-action>
          <v-icon light v-html="item.icon"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
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
//          { icon: 'dashboard', title: '대시보드', path: '/' },
//          { icon: 'list', title: '센서 리스트', path: '/sensor-list' },
//          { icon: 'report', title: '보고서', path: '/report' },
//          { icon: 'alarm', title: '알람', path: '/alarmrules' },
//          { icon: 'settings', title: '설정', path: '/settings' }
        ],
      }
    },
    mounted () {
      this.open = this.drawer
    }
  }
</script>

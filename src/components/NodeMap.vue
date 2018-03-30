<template>
  <div class="text-block-4" style="width: 100%; height: 100%; min-height:300px;" v-if="imageLink">
    <span class="map"> 
  <div class="div-block-14">
    <div class="map-calendar-block">
      <div class="map-calendar-area">
        <div class="progress-bar" v-if="!nodes" >
          <v-progress-circular  indeterminate :size="100" color="amber" :width="3"></v-progress-circular>
        </div>
      </div>
      <svg  width="100%" :height="svgHeight" ref="svg" v-if="$store.state.zone">
        <image :xlink:href="imageLink" x="50%" y="50%" :width="imageDisplayWidth" :height="svgHeight" :transform="`translate(${-imageDisplayWidth/2}, ${-svgHeight/2})`" v-if="imageLink"></image>
        <node v-for="node in remappedNodes" :key="node.id" :node="node" :selected="selected" @click="onClick(node)"></node>
      </svg>
    </div>
  </div>
  </span>
</div>
</template>

<script>
  import axios from 'axios'
  import { ENDPOINT, SVG_DEFAULT_HEIGHT } from '@/global'
  import Node from '@/components/nodemap/Node'
  
  import { API_BASE } from '@/global'

  export default {
    props: {
      selectionEnabled: {
        type: Boolean,
        default: true,
      }
    },
    data: () => ({
      SVG_DEFAULT_HEIGHT,
      svgSize: null,
      nodes: null,
      selected: null,
      checkbox: false,
      zone:null
    }),
    components: { Node },
    watch: {
      '$store.state.zone': function () {
        this.$nextTick(() => {
          this.setSize()
          this.getNodes()
        })
      },
    },
    computed: {
      remappedNodes () {
        if (!this.svgSize || !this.nodes) { return [] }
        return this.nodes.map(node => ({
          ...node,
          x: this.svgSize.width/2 - this.imageDisplayWidth/2 + this.imageDisplayWidth * node.x,
          y: this.svgHeight * node.y,
        }))
      },
      infoExists () {
        return this.$store.state.zone.map_width && this.$store.state.zone.map_height
      },
      orientation () {
        if (!this.svgSize) { return 'landscape' }
        const ratio = SVG_DEFAULT_HEIGHT / this.$store.state.zone.map_height
        const imageDisplayWidth = this.$store.state.zone.map_width * ratio
        return this.svgSize.width >= imageDisplayWidth ? 'landscape' : 'portrait'
      },
      svgHeight () {
        if (!this.svgSize) { return SVG_DEFAULT_HEIGHT }
        const ratio = this.svgSize.width / this.$store.state.zone.map_width
        const imageDisplayHeight = this.$store.state.zone.map_height * ratio
        return !this.infoExists || this.orientation === 'landscape' ? SVG_DEFAULT_HEIGHT : imageDisplayHeight
      },
      imageLink () {
        var zoneId = localStorage.getItem('zoneid');
        var zone = JSON.parse(localStorage.getItem('detail_zone'+zoneId))
        return zone.data.floor_map
        
      },
      imageDisplayWidth () {
        if (!this.infoExists) { return 0 }
        const ratio = this.svgHeight / this.$store.state.zone.map_height
        return this.$store.state.zone.map_width * ratio
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getNodes()
        this.setSize()
      })
      window.addEventListener('resize', this.setSize);
    },
    destroyed () {
      window.removeEventListener('resize', this.setSize);
    },
    methods: {
      getNodes() {
        var zoneId = localStorage.getItem('zoneid')
        this.nodes = null;
        const NODES_API = `${API_BASE}/zones/${zoneId}/nodes`;
        axios.get(NODES_API).then(res => {
          this.nodes = res.data
        })
      },
      onClick (node) {
        if (!this.selectionEnabled) { return }
        this.selected = node
        this.$emit('onSelectNode', node)
      },
      setSize () {
        if (!this.$refs.svg) { return }
        this.svgSize = { width: this.$refs.svg.clientWidth, height: this.$refs.svg.clientHeight}
      }
    }
  }
</script>
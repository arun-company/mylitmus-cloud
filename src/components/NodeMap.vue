<template>
      <div class="div-block-14" v-if="imageLink">
        <div class="map-block">
        <v-layout row wrap  v-if="!nodes">
          <v-progress-circular v-bind:indeterminate="true" size="40"></v-progress-circular>
        </v-layout>
        <svg  width="100%" :height="svgHeight" ref="svg" v-if="$store.state.zone">
          <image :xlink:href="imageLink" x="50%" y="50%" :width="imageDisplayWidth" :height="svgHeight" :transform="`translate(${-imageDisplayWidth/2}, ${-svgHeight/2})`"></image>
          <node v-for="node in remappedNodes" :key="node.id" :node="node" :selectedNodes="selectedNodes" @click="onClick(node)"></node>
        </svg>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { ENDPOINT, SVG_DEFAULT_HEIGHT , API_BASE} from '@/global'
  import Node from '@/components/nodemap/Node'
  export default {
    props: {
      imageLink: {
        type: String,
      },
      selectionEnabled: {
        type: Boolean,
        default: true,
      }
    },
    data: () => ({
      SVG_DEFAULT_HEIGHT,
      svgSize: null,
      nodes: null,
      selected: [],
      checkbox: false,
      zone:null,
      selectedNodes:[]
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
        this.addSelecte(node)
        
      },
      addSelecte(node) {
        var index = this.selectedNodes.indexOf(node.id)
        if ( index < 0 ) {
            this.selectedNodes.push(node.id)
        } else {
            this.selectedNodes.splice(index, 1)
        }
        this.$emit('onSelectNode', this.selectedNodes)
      },
      setSize () {
        if (!this.$refs.svg) { return }
        this.svgSize = { width: this.$refs.svg.clientWidth, height: this.$refs.svg.clientHeight}
      }
    }
  }
</script>
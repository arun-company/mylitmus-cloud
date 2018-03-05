<template>
  <g class="container" :transform="`translate(${node.x}, ${node.y})`" @click="onClick(node)">
    <circle 
      :class="{
        'node-circle': true,
        'selected': selected ? selected.id === node.id : false,
        'inactive': node.currentMeasures.length === 0,
      }" r="10"></circle>
    <text 
      text-anchor="middle"
      :transform="`translate(0, ${-18})`"
      style="font-size: 10px;"
    >
      {{node.name}}
    </text>
    <text
      class="label"
      v-for="(measure, index) in node.currentMeasures" 
      :key="measure.uid"
      text-anchor="middle"
      :transform="`translate(35, ${-3 + index * 15})`"
      style="font-size: 10px;"
    >
      {{`${measure.value.toFixed(2)}${measure.unit}`}}
    </text>
  </g>
</template>

<script>
  export default {
    props: ['node', 'selected'],
    methods: {
      onClick (node) {
        this.$emit('click', node) 
      }
    }
  }
</script>

<style scoped>
  .container {
    cursor: pointer;
  }

  .node-circle {
    fill: #fef5ef;
    stroke: #2e3047;
    stroke-width: 2;
  }

  .selected {
    fill: #ee513b;
  }

  .inactive {
    stroke: #b71c1c;
  }

  .node-title {
    fill: white;
    stroke: #2e3047;
    stroke-width: 2;
  }

  .label {
    font-size: 13px;
  }
</style>
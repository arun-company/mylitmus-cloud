<template>
	<v-card>
	  <v-card-text>
      <v-progress-circular :size="50" indeterminate color="primary" v-if="!data"></v-progress-circular>
      <template v-else>
        <h3 v-if="size == 3">{{data.value}}</h3>
        <h4 v-if="size == 4">{{data.value}}</h4>
        <div>{{data.desc || ''}}<span v-if="data.subtitle" style="color: gray;">{{data.subtitle}}</span></div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script type="text/javascript">
export default {
  props: {
    data: Object,
    size: {
      type: [String, Number],
      default: 3,
    }
  },
}	
</script>
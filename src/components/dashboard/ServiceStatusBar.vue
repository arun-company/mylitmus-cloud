<template>
  <v-alert info value="true" v-if="!active">서비스 작동 검사 중..</v-alert>
  <v-alert success value="true" v-else-if="value >= success">서비스 정상 작동 중 {{subtitle}}</v-alert>
  <v-alert warning value="true" v-else-if="error <= value && value < success">일부 센서 작동 확인 필요 {{subtitle}}</v-alert>
  <v-alert error value="true" v-else-if="value < error">센서 점검 필요 {{subtitle}}</v-alert>
</template>

<script>
  export default {
    props: ['active', 'value', 'error', 'warn', 'success', 'text'],
    computed: {
      subtitle() {
        return ` - ${this.value * 100}% (${this.text})`
      }
    }
  }
</script>

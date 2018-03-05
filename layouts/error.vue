<template>
  <div class="">
    <div v-if="error.statusCode === 404">
      <div class="utility-page-wrap">
        <div class="utility-page-content"><img src="https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg">
          <h2>Page not found</h2>
          <div>The page you are looking for doesn&#x27;t exist or has been moved.</div>
        </div>
      </div>
    </div>
    <h1 v-else>An error occured</h1>
  </div>
</template>

<script>
  export default {
    layout: '404layout',
    props: ['error']
  }
</script>

<style scoped>
  .container {
    font-family: sans-serif;
    padding-top: 10%;
    text-align: center;
  }
  h1 {
    font-size: 20px;
  }
</style>

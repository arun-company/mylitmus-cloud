<template>
  <section class="container">
      <div class="section zone">
         <div class="div-block-3">
           <div class="div-block-4"><a href="/" class="link">Home</a>
             <div class="text-block-5">&gt;</div><a href="/site" class="link">Site</a>
             <div class="text-block-5">&gt;</div>
             <div class="text-block-5">Zone</div>
           </div>
         </div>
         <div class="w-container">
           <h1 class="heading">Zone Name</h1>
         </div>
         <div class="div-block-5">
           <div class="text-block-4">Map Area</div>
         </div>
         <div class="div-block-2" v-for="(value, index) in 12" :key="index">
           <div class="text-block-3">Sensor {{value}}</div>
           <div class="text-block-4">{{value}}</div>
         </div>
      </div>
  </section>
</template>

<script>
  export default {
    layout: 'default-nav',
    middleware: 'auth',

  }

</script>

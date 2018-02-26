<template>
  <section class="container">
    <div class="section zone">

      <div>
        <h2 class="text-center">Login</h2>
        <hr>
        <b-alert v-if="error" show variant="danger">{{ error + '' }}</b-alert>
        <b-alert show v-if="$auth.getState('redirect')">
          <!--You have to login before accessing to <strong>{{ $auth.getState('redirect') }}</strong>-->
        </b-alert>

        <form @keydown.enter="login" method="post">
        <b-form-group label="Username">
          <b-input v-model="username" placeholder="anything" ref="username" />
        </b-form-group>

        <b-form-group label="Password">
          <b-input type="password" v-model="password" placeholder="123" />
        </b-form-group>
        <div class="text-center">
          <b-btn @click="login" variant="primary" block>Login</b-btn>
        </div>
        </form>
      </div>

    </div>
  </section>
</template>

<script>
  import busyOverlay from '~/components/busy-overlay'

  export default {
//    middleware: ['auth'],
    components: { busyOverlay },
    data() {
      return {
        username: 'flo',
        password: '@flotrack',
        error: null
      }
    },
  methods: {
    async login() {
      this.error = null
      console.log( this.$auth.login({
        data: {
          username: this.username,
          password: this.password
        }
      }) );
    }
  }
  }
</script>

<template>
      <div class="loginsection">
        <div class="w-container">
          <div class="logindiv">
            <h2 class="brandtitle">Litmus.Cloud</h2>
            <div class="">
              <form id="wf-form-Login-Form" class="loginform" @keydown.enter="login" method="post" >
                <div class="div-block-6">
                  <label for="usernameinput">ID:</label>
                  <b-input class="w-input" id="usernameinput" maxlength="256" autofocus="true" v-model="username" placeholder="Enter your ID" ref="username" required />

                </div>
                <div class="div-block-6"><label for="password">Password:</label>
                  <b-input type="password" v-model="password" class="w-input" maxlength="256" autofocus="true" placeholder="Enter your password" id="password" required="" />
                </div>
                <b-btn @click="login" class="submit-button w-button" type="submit" value="Sign In" >Sign In</b-btn>

              </form>
              <div class="w-form-done">
                <div>Thank you! Your sign in has been successful!</div>
              </div>
              <div class="w-form-fail">
                <div>Your sign in has  failed.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
  import busyOverlay from '~/components/busy-overlay'
  import axios from 'axios'

  export default {
    components: { busyOverlay },
    data() {
      return {
        username: "",
        password: "",
        error: null
      }
    },
  methods: {
    async login() {
      this.error = null
      var result = this.$auth.login({
        data: {
          username: this.username,
          password: this.password
        }
      });
    }
  }
  }
</script>

<template>
  <main>
    <div class="loginsection">
      <div class="w-container">
        <div class="logindiv">
          <h2 class="brandtitle">Litmus.Cloud</h2>
          <div class="w-form">
            <form @submit.prevent="onLogin" class="loginform" id="wf-form-Login-Form">
              <v-layout class="div-block-6">
                <label for="username">ID:</label>
                <input type="text" class="w-input" v-model="credentials.username" maxlength="256" autofocus="true" placeholder="Enter your ID" id="username" >

                <label for="password">Password:</label>
                <input class="w-input" id="password"  type="password"  name="password" v-model="credentials.password" required=""  placeholder="Enter your password" >
              </v-layout>
              <input type="submit" value="Sign In" class="submit-button w-button">
            </form>

            <v-snackbar
                    :timeout="3000" class="error" v-model="snackbar">
                    <div class="w-form-fail" style="display: block">
                      <div>{{ '로그인에 실패하였습니다.' }}</div>
                    </div>
            </v-snackbar>
          </div>
        </div>
      </div>
    </div>
    <!--<v-btn dark flat @click.native="snackbar = false">Close</v-btn>-->
  </main>
</template>

<script>
  import auth from '@/auth'

  export default {
    data () {
      this.$store.state.menu = false
      return {
        snackbar: false,
        credentials: { username: '', password: '' },
      }
    },
    methods: {
      onLogin() {
        auth.login(this.credentials)
        .then((result) => {
          if (!result.authenticated) {
            this.snackbar = true
            return
          }

          auth.checkAuth()
          this.$router.push('/')
        })
      }
    }
  }
</script>

<template>
  <main>
    <v-container>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-container>
                <form @submit.prevent="onLogin">
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="username"
                        label="아이디"
                        id="username"
                        v-model="credentials.username"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field
                        name="password"
                        label="비밀번호"
                        id="password"
                        v-model="credentials.password"
                        type="password"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn primary type="submit" style="width: 100%">
                        로그인
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      :timeout="3000" class="error" v-model="snackbar">
      {{ '로그인에 실패하였습니다.' }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </main>
</template>

<script>
  import auth from '@/auth'

  export default {
    layout:'login',
    data () {
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

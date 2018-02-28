module.exports = {
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'mylitmus-cloud',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script:[
      {src:'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'},
    ]
  },
  css: [
    '~/assets/css/webflow.css',
    '~/assets/css/normalize.css',
    '~/assets/css/mylitmus-cloud.webflow.css'
  ],
  plugins: [
    { src: '~/assets/js/webflow.js', ssr: false },
    { src: '~/assets/js/script.js', ssr: false },
    { src: '~/plugins/auth.js' },
  ],



modules: [
  ['@nuxtjs/axios', { baseURL: 'https://mylitmus.cloud',
    proxyHeaders: false,
    credentials: false
  }],
  '@nuxtjs/auth',
  ['@nuxtjs/bootstrap-vue', { css: false }]
  ],

  auth: {
    fetchUserOnLogin: true,
    resetOnError: false,
    rewriteRedirects: true,
    watchLoggedIn: true,
    namespace: 'auth',
    scopeKey: 'scope',
    token: {
      type: 'Bearer',
      name: 'token'
    },
    cookie: {
      name: 'token',
      options: {
        path: '/'
      }
    },
    endpoints: {
      login: { url: '/auth/login/', method: 'post', propertyName: 'token' },
      logout: { url: '/auth/logout/', },
      user: { url: '/auth/user', method: 'post', propertyName: 'user' }
    },
    redirect: {
      login: '/login',
      home: '/'
    },

  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#d50000' },
  /*
  ** Build configuration
  */

  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

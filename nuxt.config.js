module.exports = {
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
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
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

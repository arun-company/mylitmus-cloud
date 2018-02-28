export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config)
  })

  $axios.onError(error => {

    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/login/?message='+ error.response.data.non_field_errors[0])
    }
  })

}

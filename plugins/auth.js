export default function ({ $axios, redirect }) {
//  $axios.onRequest(config => {
//    console.log('############## ')
//    console.log(config)
//    console.log('________________')
//  })
//
  $axios.onError(error => {

    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/login/?message='+ error.response.data.non_field_errors[0])
    }
  })
//
//  $axios.onResponse(response => {
//    console.log(response);
//  })
//
//
}

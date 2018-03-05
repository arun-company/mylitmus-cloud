import axios from 'axios'
import { LOGIN_URL } from '@/global'
import { store, router } from '@/main'

export default {
  user: { authenticated: false },
  login (credentials) {
    return axios.post(LOGIN_URL, credentials)
    .then(response => {
      localStorage.setItem('token', response.data.key)
      this.user.authenticated = true

      return this.user
    })
    .catch(error => {
      this.logout()
      return this.user
    })
  },
  logout () {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    this.user.authenticated = false
    store.commit('setToken', null)
    router.push('/login')
  },
  checkAuth() {
    const token = localStorage.getItem('token')
    this.user.authenticated = !!token

    if (this.user.authenticated) {
      axios.defaults.headers.common['Authorization'] = this.getAuthHeader()
      store.commit('setToken', token)
    }
  },
  getAuthHeader () {
    return `Token ${localStorage.getItem('token')}`
  }
}

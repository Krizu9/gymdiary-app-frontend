import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    username: ''
  }),
  actions: {
    async login(username: string, token: string) {
      try {
        console.log('Logging in with token:', token)
        this.isLoggedIn = true
        this.username = username || 'User'
        sessionStorage.setItem('authToken', token)
        sessionStorage.setItem('username', this.username)

        if (!axios.defaults.headers.common['Authorization']) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Login error:', error)
      }
    },

    logout() {
      console.log('Logging out')
      this.isLoggedIn = false
      this.username = ''
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('username')

      delete axios.defaults.headers.common['Authorization']
    },

    async checkLoginStatus() {
      const token = sessionStorage.getItem('authToken')
      const username = sessionStorage.getItem('username')
      console.log('Checking login status with token:', token)

      if (!token) {
        console.log('No token found in sessionStorage')
        this.logout()
        return
      }

      try {
        const response = await axios.post(
          `http://${config.apiHost}:${config.backendPort}/user/checkToken`,
          { token }
        )
        console.log('Token validation response:', response.data)

        if (response.data.response === 'OK!' && response.data.access) {
          this.isLoggedIn = true
          this.username = username || 'User' 
        } else {
          console.log('Token invalid, logging out')
          this.logout()
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        this.logout()
      }
    }
  }
})

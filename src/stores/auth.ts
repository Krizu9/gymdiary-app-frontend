import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    username: ''
  }),
  actions: {
    login(username, token) {
      this.isLoggedIn = true;
      this.username = username;
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('username', username);
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('username');
    },
    checkLoginStatus() {
      const token = sessionStorage.getItem('authToken');
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        this.username = sessionStorage.getItem('username') || 'User';
      }
    }
  }
});

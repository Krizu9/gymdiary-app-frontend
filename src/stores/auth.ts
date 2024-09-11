import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    // additional state if needed
  }),
  actions: {
    async login(username: string, token: string, userId: string) {
  try {
    console.log('Logging in with token:', token);
    this.isLoggedIn = true;
    this.username = username;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userId', userId); // Store the user ID

    // Set token for Axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    console.error('Login error:', error);
  }
},

    logout() {
      console.log('Logging out');
      this.isLoggedIn = false;
      this.username = '';
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userId');

      // Remove Axios token
      delete axios.defaults.headers.common['Authorization'];
    },
    async checkLoginStatus() {
  const token = sessionStorage.getItem('authToken');
  const username = sessionStorage.getItem('username');
  console.log('Checking login status with token:', token);

  if (!token) {
    console.log('No token found in sessionStorage');
    this.isLoggedIn = false;
    this.username = '';
    return;
  }

  try {
    const response = await axios.post('http://localhost:5001/user/checkToken', { token });
    console.log('Token validation response:', response.data);

    if (response.data.valid) {
      this.isLoggedIn = true;
      this.username = username || 'User';
    } else {
      console.log('Token invalid, logging out');
      this.logout();
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    this.logout(); // Log out if there's an error in token validation
  }
}

  }
});

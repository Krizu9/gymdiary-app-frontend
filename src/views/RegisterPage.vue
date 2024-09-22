<template>
  <div class="register-page">
    <div class="register-container">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required />
        </div>
        <button type="submit">Register</button>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      </form>
      <div class="login-link">
        <p>Already have an account? <RouterLink to="/login">Login here</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import config from '../config';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

const register = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  try {
    await axios.post(`http://${config.apiHost}:${config.backendPort}/user/register`, {
      name: username.value,
      email: email.value,
      password: password.value,
      passwordConfirmation: confirmPassword.value
    });
    successMessage.value = 'Registration successful! Redirecting to login...';
    setTimeout(() => router.push('/login'), 2000); // Redirect after 2 seconds
  } catch (error) {
    if (error.response && error.response.data && error.response.data.msg) {
      errorMessage.value = error.response.data.msg;
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.register-container {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 2rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
}

.success-message {
  color: #28a745;
  margin-top: 1rem;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
}

.login-link p {
  margin: 0;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>

<template>
  <nav class="navbar">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">Gymdiary-app</RouterLink>
      <div class="navbar-center">
        <span v-if="authStore.isLoggedIn" class="navbar-greeting">Hello {{ authStore.username }}!</span>
      </div>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link-button">Home</RouterLink>
          </li>
          <li v-if="!authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/login" class="nav-link-button">Login</RouterLink>
          </li>
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/workouts" class="nav-link-button">Workouts Home</RouterLink>
          </li>
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/workouts/addTemplate" class="nav-link-button">Add Template</RouterLink>
          </li>
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/workouts/addWorkout" class="nav-link-button">Add Workout</RouterLink>
          </li>
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/workouts/checkWorkout" class="nav-link-button">Check Workouts</RouterLink>
          </li>
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/workouts/edit" class="nav-link-button">Edit Workouts</RouterLink>
          </li>
          <li v-if="authStore.isLoggedIn" class="nav-item">
            <button @click="logout" class="nav-link-button">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  position: relative;
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navbar-brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
}

.navbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.navbar-greeting {
  color: white;
  font-size: 1rem;
}

.navbar-toggler {
  border-color: white;
  background: white;
}

.navbar-collapse {
  margin-left: auto;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  margin-top: 1.2rem;
  align-self: end;
}

.nav-link-button {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background-color: #444;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.nav-link-button:hover {
  background-color: #555;
}

.nav-link-button:focus {
  outline: none;
}

@media (max-width: 768px) {
  .nav-link-button {
    padding: 0.75rem 1.5rem;
    font-size: 1.25rem;
  }
}

</style>

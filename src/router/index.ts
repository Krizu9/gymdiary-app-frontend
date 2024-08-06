import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

import Home from '../views/HomePage.vue';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import AddWorkouts from '../views/AddWorkoutsPage.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/addworkouts',
    name: 'Add Workouts',
    component: AddWorkouts,
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('authToken');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresAuth && token) {
    try {
      const response = await axios.post('http://localhost:5001/user/checkToken', { token });
      if (response.status === 200) {
        next();
      } else {
        sessionStorage.removeItem('authToken');
        next('/login');
      }
    } catch (error) {
      sessionStorage.removeItem('authToken');
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
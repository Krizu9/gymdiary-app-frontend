import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import Home from '../views/HomePage.vue';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import WorkoutsHome from '../views/WorkoutsHome.vue';
import AddWorkoutTemplate from '../views/AddWorkoutTemplate.vue';
import CheckWorkouts from '../views/CheckWorkouts.vue';
import EditWorkouts from '../views/EditWorkouts.vue';
import AddWorkout from '../views/AddWorkout.vue';

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
    path: '/workouts',
    name: 'Workouts',
    component: WorkoutsHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts/addTemplate',
    name: 'AddWorkout Template',
    component: AddWorkoutTemplate,
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts/checkWorkout',
    name: 'CheckWorkouts',
    component: CheckWorkouts,
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts/editWorkout',
    name: 'EditWorkouts',
    component: EditWorkouts,
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts/addWorkout',
    name: 'AddWorkout',
    component: AddWorkout,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log('Navigating to:', to.path);
  
  const token = sessionStorage.getItem('authToken');
  console.log('Token:', token);

  if (to.meta.requiresAuth && !token) {
    console.log('Redirecting to login due to no token');
    next('/login');
  } else if (to.meta.requiresAuth && token) {
    try {
      const response = await axios.post('http://localhost:5001/user/checkToken', { token });
      if (response.status === 200) {
        console.log('Token is valid');
        next();
      } else {
        sessionStorage.removeItem('authToken');
        console.log('Token invalid, redirecting to login');
        next('/login');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      sessionStorage.removeItem('authToken');
      next('/login');
    }
  } else {
    next();
  }
});




export default router;

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/HomePage.vue'
import Login from '../views/LoginPage.vue'
import Register from '../views/RegisterPage.vue'
import AddWorkoutTemplate from '../views/AddWorkoutTemplate.vue'
import CheckWorkouts from '../views/CheckWorkouts.vue'
import EditWorkouts from '../views/EditWorkouts.vue'
import AddWorkout from '../views/AddWorkout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/workouts/addTemplate',
    name: 'AddWorkoutTemplate',
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
  routes
})

router.beforeEach(async (to, from, next) => {
  console.log('Navigating to:', to.path)

  const authStore = useAuthStore()

  const status = await authStore.checkLoginStatus()

  if (to.meta.requiresAuth && !status.isLoggedIn) {
    console.log('Redirecting to login due to no token')
    next('/login')
  } else {
    next()
  }
})


export default router

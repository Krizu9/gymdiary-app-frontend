<template>
  <div class="workouts-home">
    <h1>Workouts</h1>
    <p>Select an option below to manage your workouts:</p>
    <ul>
      <li>
        <RouterLink to="/workouts/add">Add Workout</RouterLink>
      </li>
      <li>
        <RouterLink to="/workouts/check">Check Workouts</RouterLink>
      </li>
      <li>
        <RouterLink to="/workouts/edit">Edit Workouts</RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
</script>


<style scoped>
.workouts-home {
  padding: 2rem;
}

.workouts-home h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.workouts-home p {
  margin-bottom: 1rem;
}

.workouts-home ul {
  list-style: none;
  padding: 0;
}

.workouts-home li {
  margin-bottom: 0.5rem;
}
</style>

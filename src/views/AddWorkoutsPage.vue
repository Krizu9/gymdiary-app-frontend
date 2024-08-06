<template>
  <div class="add-workouts-page">
    <h1>Add New Workout</h1>
    <form @submit.prevent="handleSubmit" class="workout-form">
      <div v-for="(movement, index) in workoutMovements" :key="index" class="form-group">
        <div class="form-group-header">
          <h2>Movement {{ index + 1 }}</h2>
          <button type="button" @click="removeMovement(index)" class="remove-button">Remove</button>
        </div>
        <div class="form-group-field">
          <label :for="'movement-' + index">Movement:</label>
          <input 
            type="text" 
            v-model="workoutMovements[index].customMovement" 
            :id="'movement-' + index" 
            placeholder="Enter custom movement" 
            required
          />
        </div>
        <div class="form-group-field">
          <label :for="'sets-' + index">Sets:</label>
          <input 
            type="number" 
            :id="'sets-' + index" 
            v-model.number="workoutMovements[index].sets" 
            min="1" 
            required
          />
        </div>
        <div class="form-group-field">
          <label :for="'reps-' + index">Reps:</label>
          <input 
            type="number" 
            :id="'reps-' + index" 
            v-model.number="workoutMovements[index].reps" 
            min="1" 
            required
          />
        </div>
      </div>
      <div class="buttons">
        <button type="button" @click="addMovement" class="add-button">+ Add Another Movement</button>
        <button type="submit" class="submit-button">Submit Workout</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const workoutMovements = ref([{ customMovement: '', sets: 1, reps: 1 }]);

const addMovement = () => {
  workoutMovements.value.push({ customMovement: '', sets: 1, reps: 1 });
};

const removeMovement = (index: number) => {
  workoutMovements.value.splice(index, 1);
};

const handleSubmit = () => {
  const workouts = workoutMovements.value.map(item => ({
    movement: item.customMovement,
    sets: item.sets,
    reps: item.reps
  }));

  // add logic to submit workouts


  // clear
  workoutMovements.value = [{ customMovement: '', sets: 1, reps: 1 }];
};
</script>

<style scoped>
.add-workouts-page {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.buttons {
  display: flex;
  justify-content: space-evenly;
}

h1 {
  margin-bottom: 1rem;
  color: #333;
}

.workout-form {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.form-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-group-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #007bff;
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333;
}

.form-group-field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

select, input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-button {
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  margin-top: 1rem;
  background-color: #007bff;
  margin-bottom: 1rem;
}

.submit-button {
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  margin-top: 1rem;
  background-color: #007bff;
  margin-bottom: 1rem;
}


.add-button:hover, .submit-button:hover {
  background-color: #0056b3;
}
</style>

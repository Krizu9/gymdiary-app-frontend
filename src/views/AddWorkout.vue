<template>
  <div class="add-workouts">
    <h1>Add Workout</h1>

    <div class="date-picker">
      <label for="workout-date">Workout Date:</label>
      <input 
        type="date" 
        id="workout-date" 
        v-model="workoutDate" 
        :max="maxDate" 
        required
      />
    </div>
    
    <!-- display workout templates -->
    <div v-if="workoutTemplates.length" class="templates-list">
      <h2>Your Workout Templates</h2>
      <ul>
        <li v-for="template in workoutTemplates" :key="template._id" class="template-item">
          <button @click="selectTemplate(template)" class="template-button">
            {{ template.name }}
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No workout templates found.</p>
    </div>

    <!-- display template details and input results -->
    <div v-if="selectedTemplate" class="template-details">
      <h2>Results for {{ selectedTemplate.name }}</h2>
      <form @submit.prevent="submitResults">
        <div v-for="(movement, index) in selectedTemplate.movements" :key="index" class="form-group">
          <h3>Movement {{ index + 1 }}: {{ movement.movement }}</h3>
          <div v-for="(set, setIndex) in movement.sets" :key="setIndex" class="form-group-set">
            <h4>Set {{ setIndex + 1 }}</h4>
            <div class="form-group-field">
              <label :for="'weight-' + index + '-' + setIndex">Weight:</label>
              <input
                type="number"
                :id="'weight-' + index + '-' + setIndex"
                v-model.number="results[index].sets[setIndex].weight"
                min="0"
                required
              />
            </div>
            <div class="form-group-field">
              <label :for="'reps-' + index + '-' + setIndex">Reps:</label>
              <input
                type="number"
                :id="'reps-' + index + '-' + setIndex"
                v-model.number="results[index].sets[setIndex].reps"
                min="1"
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" class="submit-button">Submit Results</button>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed  } from 'vue';
import axios from 'axios';
import { WorkoutTemplate } from '../models/workoutTemplate';
import { Movement } from '../models/movements';

// state for workout templates and selected template
const workoutTemplates = ref<WorkoutTemplate[]>([]);
const selectedTemplate = ref<WorkoutTemplate | null>(null);
const results = ref<{ sets: { weight: number; reps: number }[] }[]>([]);
const workoutDate = ref<string>(new Date().toISOString().split('T')[0]);

const maxDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// fetch latest previous workout for a template ID
const fetchPreviousWorkout = async (templateId: string) => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    console.error('authentication token not found');
    return null;
  }

  try {
    const response = await axios.get(`http://localhost:5001/workout/${templateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // returns previous workout or null
  } catch (error) {
    console.error('error fetching previous workout:', error);
    return null;
  }
};

// select a workout template and initialize results based on previous data
const selectTemplate = async (template: WorkoutTemplate) => {
  selectedTemplate.value = template;

  // fetch previous workout data for selected template
  const previousWorkout = await fetchPreviousWorkout(template._id);

  // initialize results based on previous workout or defaults
  if (previousWorkout) {
    results.value = template.movements.map((movement: Movement, index) => {
      return {
        sets: Array.from({ length: movement.sets }, (_, setIndex) => ({
          weight: previousWorkout.movements[index]?.weight[setIndex] || 0, // previous weight or 0
          reps: previousWorkout.movements[index]?.reps[setIndex] || movement.lowestReps, // previous reps or lowest
        })),
      };
    });
  } else {
    // initialize using template defaults
    results.value = template.movements.map((movement: Movement) => ({
      sets: Array.from({ length: movement.sets }, () => ({
        weight: 0, // initialize weight to 0
        reps: movement.lowestReps, // lowest reps from template
      })),
    }));
  }
};

// fetch workout templates for logged-in user
const fetchWorkoutTemplates = async () => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    console.error('authentication token not found');
    return;
  }

  try {
    const response = await axios.get('http://localhost:5001/workoutTemplate/byUser', {
      headers: { Authorization: `Bearer ${token}` },
    });
    workoutTemplates.value = response.data as WorkoutTemplate[];
  } catch (error) {
    console.error('error fetching templates:', error);
  }
};

// submit workout results for selected template
const submitResults = async () => {
  if (!selectedTemplate.value) return;

  try {
    const token = sessionStorage.getItem('authToken');
    await axios.post(
      'http://localhost:5001/workout/create',
      {
        workoutTemplateId: selectedTemplate.value._id,
        date: workoutDate.value, // Use the selected date
        movements: selectedTemplate.value.movements.map((movement, index) => ({
          movement: movement.movement,
          weight: results.value[index].sets.map(set => set.weight),
          sets: results.value[index].sets.length,
          reps: results.value[index].sets.map(set => set.reps),
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert('Workout results submitted successfully!');
    selectedTemplate.value = null;
    results.value = [];
    workoutDate.value = new Date().toISOString().split('T')[0]; // Reset date to today
  } catch (error) {
    console.error('Error submitting workout results:', error);
  }
};


// fetch workout templates on component mount
onMounted(() => {
  fetchWorkoutTemplates().then(() => {
    console.log('fetched workout templates:', workoutTemplates.value);
  });
});
</script>




<style scoped>
.add-workouts {
  padding: 1.25rem;
  max-width: 50rem;
  margin: 0 auto;
}

h1, h2 {
  margin-bottom: 1.25rem;
  font-family: 'Arial', sans-serif;
  color: #333;
  text-align: center;
}

.templates-list {
  margin-bottom: 1.875rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

.template-item {
  margin-bottom: 0.625rem;
}

.template-button {
  display: block;
  width: 100%;
  padding: 0.625rem;
  border: none;
  border-radius: 0.3125rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.template-button:hover {
  background-color: #0056b3;
}

.template-details {
  border: 0.0625rem solid #ddd;
  border-radius: 0.5rem;
  padding: 1.25rem;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group-set {
  margin-bottom: 1rem;
}

.form-group-field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3125rem;
}

input[type="number"] {
  width: 100%;
  padding: 0.5rem;
  border: 0.0625rem solid #ccc;
  border-radius: 0.25rem;
}

.submit-button {
  display: inline-block;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.3125rem;
  background-color: #28a745;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #218838;
}

.date-picker{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.25rem;
}


@media (max-width: 768px) {
  .add-workouts {
    padding: 1rem;
  }
  

  h1, h2 {
    font-size: 1.5rem;
  }

  .template-button {
    font-size: 0.875rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group-set {
    margin-bottom: 0.75rem;
  }

  .form-group-field {
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 480px) { 
  h1, h2 {
    font-size: 1.25rem;
  }

  .template-button {
    font-size: 0.75rem;
  }

  input[type="number"] {
    padding: 0.375rem;
  }
}

</style>
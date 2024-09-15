<template>
  <div class="add-workouts">
    <h1>Add Workout</h1>
    
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


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// state to store the workout templates and selected template
const workoutTemplates = ref([]);
const selectedTemplate = ref(null);
const results = ref([]);

const fetchWorkoutTemplates = async () => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    console.error('Authentication token not found');
    return;
  }

  try {
    const response = await axios.get('http://localhost:5001/workoutTemplate/byUser', {
      headers: { Authorization: `Bearer ${token}` }
    });
    workoutTemplates.value = response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
  }
};

const selectTemplate = (template) => {
  selectedTemplate.value = template;
  // initialize results
  results.value = template.movements.map(movement => ({
    sets: Array.from({ length: movement.sets }, () => ({
      weight: 0,
      reps: 0,
    }))
  }));
};

const submitResults = async () => {
  if (!selectedTemplate.value) return;

  try {
    await axios.post('/workoutResults', {
      templateId: selectedTemplate.value._id,
      results: results.value,
    }, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
      },
    });
    alert('Workout results submitted successfully!');
    selectedTemplate.value = null;
    results.value = [];
  } catch (error) {
    console.error('Error submitting workout results:', error);
  }
};

onMounted(() => {
  fetchWorkoutTemplates().then(() => {
    console.log('Fetched workout templates:', workoutTemplates.value);
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
<template>
  <div class="workout-templates-page">
    <div class="toggle-buttons">
      <button @click="toggleMode('view')" :class="{ active: mode === 'view' }">View Templates</button>
      <button @click="toggleMode('add')" :class="{ active: mode === 'add' }">Add New Template</button>
    </div>

    <!-- View Mode -->
    <div v-if="mode === 'view'" class="view-mode">
      <h1>Your Workout Templates</h1>
      <div v-if="templates.length === 0" class="no-templates">No workout templates found.</div>
      <div v-else>
        <div v-for="template in templates" :key="template._id" class="template-card">
          <h2>{{ template.name }}</h2>
          <ul>
            <li v-for="(movement, index) in template.movements" :key="index">
              {{ movement.movement }} ({{ movement.sets }} sets, {{ movement.lowestReps }}-{{ movement.highestReps }}
              reps)
            </li>
          </ul>
          <div class="editbutton">
            <button @click="editTemplate(template)" class="edit-button">Edit</button>
            <button @click="template._id && deleteTemplate(template._id)" class="edit-button delete">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Mode -->
    <div v-if="mode === 'add'" class="add-mode">
      <h1>{{ currentTemplate ? 'Edit Workout Template' : 'Add New Workout Template' }}</h1>
      <form @submit.prevent="handleSubmit" class="workout-form">
        <div class="form-group-field">
          <label for="workout-name">Workout Name:</label>
          <input type="text" v-model="workoutName" id="workout-name" placeholder="Enter workout name" required />
        </div>

        <div class="form-group-container">
          <div v-for="(movement, index) in workoutMovements" :key="index" class="form-group">
            <div class="form-group-header">
              <h2>Movement {{ index + 1 }}</h2>
              <button type="button" @click="removeMovement(index)" class="remove-button">Remove</button>
            </div>

            <div class="form-group-field">
              <label :for="'movement-' + index">Movement:</label>
              <input type="text" v-model="workoutMovements[index].movement" :id="'movement-' + index"
                placeholder="Enter custom movement" required />
            </div>

            <div class="form-group-field">
              <label :for="'sets-' + index">Sets:</label>
              <input type="number" :id="'sets-' + index" v-model.number="workoutMovements[index].sets" min="1"
                required />
            </div>

            <div class="form-group-field">
              <label :for="'lowest-reps-' + index">Lowest Reps:</label>
              <input type="number" :id="'lowest-reps-' + index" v-model.number="workoutMovements[index].lowestReps"
                min="1" required />
            </div>

            <div class="form-group-field">
              <label :for="'highest-reps-' + index">Highest Reps:</label>
              <input type="number" :id="'highest-reps-' + index" v-model.number="workoutMovements[index].highestReps"
                min="1" required />
            </div>
          </div>
        </div>

        <div class="buttons">
          <button type="button" @click="addMovement" class="add-button">+ Add Another Movement</button>
          <button type="submit" class="submit-button">Submit Workout Template</button>
          <button type="button" @click="cancelEdit" class="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Movement } from '../models/movements';
import { WorkoutTemplate } from '../models/workoutTemplate';
import config from '../config';

// Ref variables using the model
const mode = ref<'view' | 'add'>('view');
const workoutName = ref('');
const workoutMovements = ref<Movement[]>([{ movement: '', sets: 1, weight: 1, lowestReps: 1, highestReps: 1 }]);
const templates = ref<WorkoutTemplate[]>([]);
const currentTemplate = ref<WorkoutTemplate | null>(null);

// Functions
const toggleMode = (newMode: 'view' | 'add') => {
  mode.value = newMode;
  if (newMode === 'view') {
    fetchTemplates();
  } else {
    workoutName.value = '';
    workoutMovements.value = [{ movement: '', sets: 1, lowestReps: 1, weight: 1, highestReps: 1 }];
    currentTemplate.value = null;
  }
};

const deleteTemplate = async (templateId: string) => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    console.error('Authentication token not found');
    return;
  }

  try {
    await axios.delete(`http://${config.apiHost}:${config.backendPort}/workoutTemplate/delete?id=${templateId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTemplates();
  } catch (error) {
    console.error('Error deleting template:', error);
  }
};

const cancelEdit = () => {
  workoutMovements.value = [{ movement: '', sets: 1, weight: 1, lowestReps: 1, highestReps: 1 }];
  workoutName.value = '';
  currentTemplate.value = null;
  toggleMode('view');
};

const fetchTemplates = async () => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    console.error('Authentication token not found');
    return;
  }

  try {
    const response = await axios.get(`http://${config.apiHost}:${config.backendPort}/workoutTemplate/byUser`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    templates.value = response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
  }
};

const addMovement = () => {
  workoutMovements.value.push({ movement: '', sets: 1, weight: 1, lowestReps: 1, highestReps: 1 });
};

const removeMovement = (index: number) => {
  workoutMovements.value.splice(index, 1);
};

const handleSubmit = async () => {
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    console.error('Authentication token not found');
    return;
  }

  const workoutTemplate: WorkoutTemplate = {
    name: workoutName.value,
    movements: workoutMovements.value
  };

  try {
    const url = currentTemplate.value
      ? `http://${config.apiHost}:${config.backendPort}/workoutTemplate/update`
      : `http://${config.apiHost}:${config.backendPort}/workoutTemplate/create`;
    const method = currentTemplate.value ? 'put' : 'post';
    const requestPayload = currentTemplate.value
      ? { id: currentTemplate.value._id, ...workoutTemplate }
      : workoutTemplate;

    await axios[method](url, requestPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    workoutMovements.value = [{ movement: '', sets: 1, weight: 1, lowestReps: 1, highestReps: 1 }];
    workoutName.value = '';
    currentTemplate.value = null;
    toggleMode('view');
  } catch (error) {
    console.error('Error submitting workout template:', error);
  }
};

const editTemplate = (template: WorkoutTemplate) => {
  mode.value = 'add';
  workoutName.value = template.name;
  workoutMovements.value = template.movements.map(movement => ({
    movement: movement.movement,
    sets: movement.sets,
    weight: movement.weight,
    lowestReps: movement.lowestReps,
    highestReps: movement.highestReps
  }));
  currentTemplate.value = template;
};

onMounted(() => {
  if (mode.value === 'view') {
    fetchTemplates();
  }
});
</script>

<style scoped>
h1 {
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
}

.workout-templates-page {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.edit-button,
.cancel-button,
.add-button,
.submit-button {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-block;
}

.delete {
  margin-left: 1rem;
  background-color: #dc3545;
}

.cancel-button {
  background-color: #dc3545;
  margin: 8px;
}

.editbutton {
  display: flex;
  justify-content: flex-end;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;

}

.toggle-buttons button {
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #ffffff;
  background-color: #007bff;
}

.toggle-buttons button.active {
  background-color: #0056b3;
}

.toggle-buttons button:hover {
  background-color: #0056b3;
}

.view-mode {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.view-mode h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}


.view-mode .no-templates {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
}

.template-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

.template-card h2 {
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.template-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.template-card li {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.template-card li:last-child {
  border-bottom: none;
}

.add-mode .workout-form {
  background-color: #ffffff;
}

.add-mode .form-group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.add-mode .form-group {
  width: 90%;
  flex: 1 1 calc(33.333% - 1rem);
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.add-mode .form-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-mode .form-group-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #007bff;
}

.add-mode .remove-button {
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
}

.add-mode .remove-button:hover {
  background-color: #c82333;
}

.add-mode .form-group-field {
  margin-bottom: 1rem;
}

.add-mode label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.add-mode select,
.add-mode input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-mode input[type="number"]::-webkit-inner-spin-button,
.add-mode input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-mode .add-button,
.add-mode .submit-button {
  margin: 0.5rem;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.add-mode .add-button {
  background-color: #28a745;
}

.add-mode .submit-button {
  background-color: #007bff;
}

.add-mode .add-button:hover {
  background-color: #218838;
}

.add-mode .submit-button:hover {
  background-color: #0056b3;
}

.add-mode .cancel-button {
  background-color: #dc3545;
}

.add-mode .cancel-button:hover {
  background-color: #c82333;
}

@media (max-width: 768px) {
  .add-mode .form-group {
    flex: 1 1 100%;
  }
}
</style>

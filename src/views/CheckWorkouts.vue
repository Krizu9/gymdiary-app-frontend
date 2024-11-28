<template>
  <div class="check-workouts">
    <h1>Check Workouts from templates:</h1>
    <div class="template-buttons">
      <button v-for="template in workoutTemplates" :key="template._id" @click="fetchWorkoutsByTemplate(template._id)"
        class="template-button">
        {{ template.name }}
      </button>
    </div>

    <div v-if="selectedWorkouts.length > 0" class="workout-list">
      <h2>Previous Workouts</h2>
      <button @click="openModal" class="stats-button">View Statistics</button>
      <div class="workout-grid">
        <div v-for="workout in selectedWorkouts" :key="workout._id" class="workout-card">
          <h3>{{ formatDate(workout.date) }}</h3>
          <div v-for="movement in workout.movements" :key="movement._id" class="movement-info">
            <p>
              <strong>{{ movement.movement }}</strong><br />
              <span v-for="(weight, index) in movement.weight" :key="index">
                Set {{ index + 1 }}: {{ weight }}kg, Reps: {{ movement.reps[index] }}<br />
              </span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="modalVisible" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="statistics-text">Statistics</h2>
            <span class="close" @click="closeModal">&times;</span>
          </div>
          <div class="graph-container">
            <div id="modal-graph" class="svg-grid"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import * as d3 from 'd3';
import { WorkoutTemplate } from '../models/workoutTemplate';
import config from '../config';

const workoutTemplates = ref<WorkoutTemplate[]>([]);
const selectedWorkouts = ref<any[]>([]);
const modalVisible = ref(false);

const fetchWorkoutTemplates = async () => {
  const token = sessionStorage.getItem('authToken');
  if (!token) return;

  try {
    const response = await axios.get(`http://${config.apiHost}:${config.backendPort}/workoutTemplate/byUser`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    workoutTemplates.value = response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
  }
};

const fetchWorkoutsByTemplate = async (templateId: string) => {
  const token = sessionStorage.getItem('authToken');
  if (!token) return;

  try {
    const response = await axios.get(`http://${config.apiHost}:${config.backendPort}/workout/all/${templateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    selectedWorkouts.value = response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching workouts:', error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const openModal = () => {
  if (selectedWorkouts.value.length > 0) {
    modalVisible.value = true;
    setTimeout(() => {
      createGraph();
    }, 100);
  } else {
    alert("No workouts selected.");
  }
};

const closeModal = () => {
  modalVisible.value = false;
  const modalGraphContainer = d3.select("#modal-graph");
  modalGraphContainer.selectAll("*").remove();
};

const createGraph = () => {
  const modalGraphContainer = d3.select("#modal-graph");
  modalGraphContainer.selectAll("*").remove();

  const flatData = selectedWorkouts.value.flatMap(workout =>
    workout.movements.map(movement => ({
      movement: movement.movement,
      date: formatDate(workout.date),
      totalWeight: movement.weight.reduce((sum, weight, index) => sum + (weight * movement.reps[index]), 0) // multiply weight by reps
    }))
  );

  const groupedData = d3.groups(flatData, d => d.movement);

  groupedData.forEach(([movementName, data]) => {
    // sort data by date in descending order for graph
    data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const margin = { top: 20, right: 30, bottom: 50, left: 40 };
    const width = Math.max(400, window.innerWidth * 0.8) - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = modalGraphContainer.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.date).reverse()) // reverse the order of the dates
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalWeight)])
      .nice()
      .range([height, 0]);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.date))
      .attr("y", d => y(d.totalWeight))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.totalWeight))
      .attr("fill", "#007bff");

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -1)
      .attr("text-anchor", "middle")
      .style("font-size", "1.5em")
      .text(movementName);
  });
};



let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const modalGraphContainer = d3.select("#modal-graph");
    modalGraphContainer.selectAll("*").remove();
    createGraph();
  }, 300);
};

onMounted(() => {
  fetchWorkoutTemplates();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 100%;
  max-height: 95%;
  overflow-y: auto;
}

.close {
  color: #aaa;
  float: right;
  /* This keeps it to the right */
  font-size: 32px;
  /* Increase the font size */
  font-weight: bold;
  padding: 10px;
  /* Add padding for a larger clickable area */
  cursor: pointer;
  /* Change the cursor to pointer */
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.check-workouts {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.template-buttons {
  margin-bottom: 20px;
  align-items: center;
}

.template-button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.template-button:hover {
  background-color: #0056b3;
}

.statistics-text {
  text-align: center;
}

.stats-button {
  margin: 10px 0;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.workout-list {
  margin-top: 20px;
  width: 100%;
  /* Ensure it takes full width */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Center contents */
}

.workout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  width: 100%;
  /* Ensure it takes full width */
}

.workout-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background-color: #e0f7fa;
}

.movement-info {
  margin-top: 5px;
}

.modal-header {
  display: flex;
  align-items: center;
  /* Center vertically */
}

.statistics-text {
  flex-grow: 1;
  /* Allow title to take up available space */
  text-align: center;
  /* Center text */
}


.graph-container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.svg-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>

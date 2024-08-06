<template>
  <div class="home">
    <header class="hero">
      <h1>Welcome to Gymdiary!</h1>
      <p>Your ultimate tool for tracking workouts, analyzing performance, and achieving fitness goals.</p>
      <button >Track Your Workouts</button>
      <button >Generate Performance Graphs</button>
    </header>
    
    <section class="features">
      <div class="feature">
        <img src="../assets/notes.jpg" alt="Track Workouts" />
        <h2>Track Workouts</h2>
        <p>Log your exercises, monitor progress, and stay motivated with our easy-to-use workout tracker.</p>
      </div>
      <div class="feature">
        <img src="../assets/phonenotes.jpg" alt="Generate Graphs" />
        <h2>Generate Graphs</h2>
        <p>Visualize your workout data with powerful charts and graphs generated using D3.js.</p>
      </div>
      <div class="feature">
        <img src="../assets/placeholderchart.png" alt="Mark Workouts" />
        <h2>Mark Workouts</h2>
        <p>Effortlessly mark and review your workout history to see how far you've come.</p>
      </div>
    </section>
  </div>
</template>

<script setup>

</script>

<style scoped>
.home {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color: #333;
}

.hero {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  color: white;
  text-align: center;
  padding: 4rem 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.hero button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    margin: 0 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 0.75rem;
}

.hero button:hover {
  background-color: #0056b3;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem 1rem;
}

.feature {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
}

.feature img {
  width: 100%; /* Scale with the container */
  height: auto; /* Maintain aspect ratio */
  max-height: 250px; /* Optional: Limit max height for better visual consistency */
  object-fit: cover; /* Ensure the image covers the container */
  border-radius: 8px;
  margin-bottom: 1rem;
}

.feature h2 {
  font-size: 1.75rem; /* Slightly larger font size */
  margin: 1rem 0;
}

.feature p {
  font-size: 1.125rem; /* Slightly larger font size */
  color: #666;
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #f1f1f1;
  color: #333;
}
</style>



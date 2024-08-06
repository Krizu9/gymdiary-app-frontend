<template>
  <div class="app-container">
    <header>
      <NavBar />
    </header>
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/FooterBanner.vue'
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  width: 100%;
}
</style>

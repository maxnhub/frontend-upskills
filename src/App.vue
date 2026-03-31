<script setup>
import AppHeader from './components/AppHeader.vue';
import LessonView from './components/LessonView.vue';
</script>

<template>
  <div class="app">
    <AppHeader />
    <main>
      <LessonView />
    </main>
  </div>
</template>

<style>
@import './theme.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--background-light);
  transition: background-color var(--transition-base), color var(--transition-base);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 20px;
  background-color: var(--background-light);
}


</style>

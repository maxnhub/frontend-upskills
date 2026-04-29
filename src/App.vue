<script setup>
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import LessonView from './components/LessonView.vue';
import AuthModal from './components/AuthModal.vue';
import ProfilePage from './components/ProfilePage.vue';
import { useAuthStore } from './stores/auth.js';

const authStore = useAuthStore();
const currentView = ref('main');

function navigate(view) {
  currentView.value = view;
}
</script>

<template>
  <div class="app">
    <AuthModal v-if="!authStore.isAuthenticated" />
    <template v-else>
      <AppHeader @navigate="navigate" />
      <main>
        <ProfilePage v-if="currentView === 'profile'" @navigate="navigate" />
        <LessonView v-else />
      </main>
    </template>
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

<script setup>
import BurgerMenu from './BurgerMenu.vue';
import UiTypography from './UiKit/UiTypography.vue';
import { useLanguageStore } from '../stores/language';
import { useLessonsStore } from '../stores/lessons';
import { useAuthStore } from '../stores/auth.js';

const emit = defineEmits(['navigate']);

const languageStore = useLanguageStore();
const lessonsStore = useLessonsStore();
const authStore = useAuthStore();

function toggleLanguage() {
  const newLanguage = languageStore.currentLanguage === 'ru' ? 'en' : 'ru';
  languageStore.setLanguage(newLanguage);
  lessonsStore.fetchChapters();
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <BurgerMenu />
      <UiTypography variant="h1">JS: Compiler & Runtime</UiTypography>
      <div class="header-actions">
        <button class="language-toggle" @click="toggleLanguage">
          {{ languageStore.currentLanguage === 'ru' ? 'EN' : 'RU' }}
        </button>
        <button class="avatar-btn" title="Профиль" @click="emit('navigate', 'profile')">
          <img
            v-if="authStore.user?.avatar"
            :src="authStore.user.avatar"
            alt="Аватар"
            class="header-avatar-img"
          />
          <span v-else class="header-avatar-placeholder">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() || '?' }}
          </span>
        </button>
        <button class="logout-btn" title="Выйти" @click="authStore.logout()">
          Выйти
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--primary-dark);
  color: var(--text-light);
  padding: 20px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.app-header :deep(.ui-typography) {
  color: var(--text-light);
}

.header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-toggle {
  padding: 8px 16px;
  background-color: var(--primary-medium);
  color: var(--text-light);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 16px;
  transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 4px 10px var(--shadow);
}

.language-toggle:hover {
  background-color: var(--primary);
  transform: translateY(-1px);
}

.avatar-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: var(--primary-medium);
  transition: border-color var(--transition-fast);
  flex-shrink: 0;
}

.avatar-btn:hover {
  border-color: rgba(255, 255, 255, 0.9);
}

.header-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-light);
}

.logout-btn {
  padding: 8px 16px;
  background: transparent;
  color: var(--text-light);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.7);
}
</style>

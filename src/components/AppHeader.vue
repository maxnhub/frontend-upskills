<script setup>
import BurgerMenu from './BurgerMenu.vue';
import UiTypography from './UiKit/UiTypography.vue';
import { useLanguageStore } from '../stores/language';
import { useLessonsStore } from '../stores/lessons';

const languageStore = useLanguageStore();
const lessonsStore = useLessonsStore();

function toggleLanguage() {
  const newLanguage = languageStore.currentLanguage === 'ru' ? 'en' : 'ru';
  languageStore.setLanguage(newLanguage);
  lessonsStore.fetchChapters(); // Перезагружаем данные для нового языка
}
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <BurgerMenu />
      <UiTypography variant="h1">JS: Compiler & Runtime</UiTypography>
      <button class="language-toggle" @click="toggleLanguage">
        {{ languageStore.currentLanguage === 'ru' ? 'EN' : 'RU' }}
      </button>
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

.language-toggle {
  margin-left: auto;
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
</style>

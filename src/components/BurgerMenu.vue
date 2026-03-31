<script setup>
import { useLessonsStore } from '../stores/lessons';
import { ref } from 'vue';
import UiTypography from './UiKit/UiTypography.vue';

const store = useLessonsStore();
const openChapters = ref([]);

const toggleChapter = (chapterId) => {
  if (openChapters.value.includes(chapterId)) {
    openChapters.value = openChapters.value.filter(id => id !== chapterId);
  } else {
    openChapters.value.push(chapterId);
  }
};
</script>

<template>
  <button class="burger-menu" @click="store.toggleMenu">
    <span class="burger-line"></span>
    <span class="burger-line"></span>
    <span class="burger-line"></span>
  </button>

  <div class="menu-overlay" :class="{ open: store.isMenuOpen }" @click="store.toggleMenu">
    <div class="menu-content" @click.stop>
      <UiTypography variant="h2">Lessons</UiTypography>
      <div v-if="store.chapters.length > 0" class="chapters">
        <div v-for="chapter in store.chapters" :key="chapter.id" class="chapter">
          <UiTypography 
            variant="h3" 
            class="chapter-title" 
            @click="toggleChapter(chapter.id)"
          >
            {{ chapter.title }}
          </UiTypography>
          <ul v-if="openChapters.includes(chapter.id) && chapter.Lessons">
            <li 
              v-for="lesson in chapter.Lessons" 
              :key="lesson.id" 
              @click="store.setLesson(chapter.id, lesson.id)"
              :class="{ active: store.currentChapterId === chapter.id && store.currentLessonId === lesson.id }"
            >
              {{ lesson.title }}
            </li>
          </ul>
        </div>
      </div>
      <UiTypography v-else variant="body">No lessons available</UiTypography>
    </div>
  </div>
</template>

<style scoped>
.burger-menu {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 24px;
  width: 30px;
  padding: 0;
}

.burger-line {
  display: block;
  width: 100%;
  height: 3px;
  background-color: var(--text-light);
  border-radius: 999px;
  transition: transform var(--transition-fast), opacity var(--transition-fast);
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--primary-dark-rgb), 0.35);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-base);
}

.menu-overlay.open {
  opacity: 1;
  pointer-events: all;
}

.menu-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background-color: var(--primary-medium-dark);
  color: var(--text-light);
  padding: 20px;
  transform: translateX(-100%);
  transition: transform var(--transition-base);
  box-shadow: 0 16px 32px var(--shadow);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.menu-overlay.open .menu-content {
  transform: translateX(0);
}

.chapters {
  margin-top: 20px;
}

.chapter {
  margin-bottom: 20px;
}

.chapter-title {
  cursor: pointer;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  transition: color var(--transition-fast);
}

.chapter-title:hover {
  color: var(--accent);
}

ul {
  list-style: none;
  padding: 0;
  margin-left: 10px;
}

li {
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: color var(--transition-fast);
}

li:hover,
li.active {
  color: var(--accent);
}
</style>

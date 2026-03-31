import { defineStore } from 'pinia';
import axios from 'axios';
import { useLanguageStore } from './language.js';

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    currentChapterId: null,
    currentLessonId: null,
    isMenuOpen: false,
    chapters: [],
  }),
  getters: {
    currentChapter: (state) => state.chapters.find(chapter => chapter.id === state.currentChapterId) || null,
    currentLesson: (state) => {
      const chapter = state.chapters.find(chapter => chapter.id === state.currentChapterId);
      return chapter?.Lessons?.find(lesson => lesson.id === state.currentLessonId) || null;
    },
    hasNextLesson: (state) => {
      const chapter = state.chapters.find(chapter => chapter.id === state.currentChapterId);
      const lessonIndex = chapter?.Lessons?.findIndex(lesson => lesson.id === state.currentLessonId);
      return lessonIndex >= 0 && lessonIndex < chapter?.Lessons.length - 1;
    },
    hasNextChapter: (state) => state.currentChapterId && state.chapters.length > 0 && state.currentChapterId < state.chapters[state.chapters.length - 1].id,
  },
  actions: {
    async fetchChapters() {
      try {
        const languageStore = useLanguageStore();
        const response = await axios.get(`/api/chapters?lang=${languageStore.currentLanguage}`);
        console.log('API Response:', response.data);
        this.chapters = response.data;
        if (this.chapters.length > 0 && this.chapters[0].Lessons) {
          this.currentChapterId = this.chapters[0].id;
          this.currentLessonId = this.chapters[0].Lessons[0]?.id || null;
          console.log('Set initial values:', {
            currentChapterId: this.currentChapterId,
            currentLessonId: this.currentLessonId,
          });
        } else {
          console.warn('No chapters or lessons found in API response');
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    nextLesson() {
      if (this.hasNextLesson) {
        const chapter = this.chapters.find(chapter => chapter.id === this.currentChapterId);
        const lessonIndex = chapter.Lessons.findIndex(lesson => lesson.id === this.currentLessonId);
        this.currentLessonId = chapter.Lessons[lessonIndex + 1].id;
      } else if (this.hasNextChapter) {
        this.currentChapterId++;
        const nextChapter = this.chapters.find(chapter => chapter.id === this.currentChapterId);
        this.currentLessonId = nextChapter?.Lessons[0]?.id || null;
      }
    },
    setLesson(chapterId, lessonId) {
      this.currentChapterId = chapterId;
      this.currentLessonId = lessonId;
      this.isMenuOpen = false;
    },
  },
});
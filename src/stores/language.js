import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: 'ru', // Язык по умолчанию - русский
    translations: {
      ru: {
        nextLesson: 'Следующий урок',
        lesson: 'Урок',
        check: 'Проверить',
        getHint: 'Подсказка',
        correct: 'Правильно! Отличная работа!',
        incorrect: 'Неверно. Попробуйте ещё раз.',
        reset: 'Сбросить',
      },
      en: {
        nextLesson: 'Next Lesson',
        lesson: 'Lesson',
        check: 'Check',
        getHint: 'Get Hint',
        correct: 'Correct! Great job!',
        incorrect: 'Incorrect. Try again.',
        reset: 'Reset',
      },
    },
  }),
  actions: {
    setLanguage(language) {
      this.currentLanguage = language;
    },
    getTranslation(key) {
      return this.translations[this.currentLanguage][key] || key;
    },
  },
});

import { createI18n } from 'vue-i18n';

export default createI18n({
  legacy: false, // Отключаем legacy mode для Vue 3
  locale: 'ru', // Язык по умолчанию
  fallbackLocale: 'en', // Резервный язык
  messages: {
    ru: {
      header: { title: 'JS: Компилятор и среда выполнения' },
      menu: { lessons: 'Уроки', noLessons: 'Уроки отсутствуют' },
      lesson: { lesson: 'Урок', next: 'Следующий', loading: 'Загрузка...', error: 'Ошибка загрузки урока', imageAlt: 'Изображение урока' },
    },
    en: {
      header: { title: 'JS: Compiler & Runtime' },
      menu: { lessons: 'Lessons', noLessons: 'No lessons available' },
      lesson: { lesson: 'Lesson', next: 'Next', loading: 'Loading...', error: 'Error loading lesson', imageAlt: 'Lesson image' },
    },
  },
});

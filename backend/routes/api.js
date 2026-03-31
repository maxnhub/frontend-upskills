const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter.js');
const Lesson = require('../models/Lesson.js');

// Получить все главы с уроками
router.get('/chapters', async (req, res) => {
  try {
    const lang = req.query.lang || 'ru';
    const chaptersData = require(`../../src/locales/${lang}.js`);
    
    // Для простоты возвращаем данные из файла локализации
    // В реальном проекте можно хранить данные в базе с учетом языка
    res.json(chaptersData);
  } catch (err) {
    console.error('Error fetching chapters:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать новую главу
router.post('/chapters', async (req, res) => {
  try {
    const { title } = req.body;
    const chapter = await Chapter.create({ title });
    res.status(201).json(chapter);
  } catch (err) {
    console.error('Error creating chapter:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать новый урок
router.post('/chapters/:chapterId/lessons', async (req, res) => {
  try {
    const { title, content, audioExample } = req.body;
    const chapter = await Chapter.findByPk(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    const lesson = await Lesson.create({
      title,
      content,
      audioExample,
      chapterId: chapter.id,
    });
    res.status(201).json(lesson);
  } catch (err) {
    console.error('Error creating lesson:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
const Chapter = require('./models/Chapter.js');
const Lesson = require('./models/Lesson.js');
const sequelize = require('./db.js');
const fs = require('fs');

async function migrateData(language = 'ru') {
  try {
    // Загружаем данные в зависимости от языка
    const chaptersData = require(`../src/locales/${language}.js`);

    // Создаем директорию db, если она не существует
    if (!fs.existsSync('./db')) {
      fs.mkdirSync('./db');
      console.log('Directory db created');
    } else {
      console.log('Directory db already exists');
    }

    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('Database connected for migration');

    console.log('Synchronizing database...');
    await sequelize.sync({ force: true }); // Пересоздает таблицы
    console.log('Database synced');

    console.log('Starting data migration...');
    for (const chapterData of chaptersData) {
      console.log(`Creating chapter: ${chapterData.title}`);
      const chapter = await Chapter.create({ title: chapterData.title });
      for (const lessonData of chapterData.Lessons) {
        console.log(`Creating lesson: ${lessonData.title}`);
        await Lesson.create({
          title: lessonData.title,
          content: lessonData.content,
          audioExample: lessonData.audioExample,
          chapterId: chapter.id,
        });
      }
    }
    console.log('Data migrated successfully');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await sequelize.close();
    console.log('Database connection closed');
  }
}

migrateData(process.env.LANGUAGE || 'ru');
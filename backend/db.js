const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

const dbPath = path.join(__dirname, 'db', 'database.sqlite');

async function ensureDbDirectory() {
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    console.log('Directory db created or already exists');
  } catch (err) {
    console.error('Error creating db directory:', err);
  }
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log, // Включаем логирование для отладки
});

// Выполняем создание директории при инициализации
ensureDbDirectory();

module.exports = sequelize;
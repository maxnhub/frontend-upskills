const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Chapter = require('./Chapter');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  audioExample: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  chapterId: {
    type: DataTypes.INTEGER,
    references: {
      model: Chapter,
      key: 'id',
    },
  },
});

// Определяем обе связи здесь
Chapter.hasMany(Lesson, { as: 'Lessons', foreignKey: 'chapterId' });
Lesson.belongsTo(Chapter, { foreignKey: 'chapterId' });

module.exports = Lesson;
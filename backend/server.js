const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./db.js');
const chapterRoutes = require('./routes/api.js');
const authRoutes = require('./routes/auth.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Подключение маршрутов
app.use('/api', chapterRoutes);
app.use('/auth', authRoutes);

// Проверка подключения к базе данных
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

startServer();
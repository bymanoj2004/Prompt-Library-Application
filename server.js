require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const { createClient } = require('redis');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'library',
  password: process.env.DB_PASSWORD || 'password',
  port: Number(process.env.DB_PORT) || 5432,
});

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

pool.on('error', (err) => {
  console.error('PostgreSQL Pool Error:', err.message);
});

const promptsRoutes = require('./routes/prompts');
app.use('/prompts', promptsRoutes(pool, redisClient));

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    const redisReady = redisClient.isReady;
    res.json({ status: 'ok', postgres: 'connected', redis: redisReady ? 'connected' : 'disconnected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

async function startServer() {
  try {
    await redisClient.connect();
    await pool.query('SELECT 1');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;

const express = require('express');
const cors = require('cors');

const app = express();

// Configuración de CORS más permisiva para desarrollo
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuración de variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verificar variables de entorno requeridas
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI no está definida en las variables de entorno');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET no está definida en las variables de entorno');
  process.exit(1);
}

// Conexión a MongoDB con mejor manejo de errores
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado exitosamente a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  });

// Manejo de errores de MongoDB después de la conexión inicial
mongoose.connection.on('error', (err) => {
  console.error('Error de MongoDB:', err.message);
});

// Rutas
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del Blog' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor con manejo de errores
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}).on('error', (err) => {
  console.error('Error al iniciar el servidor:', err.message);
  process.exit(1);
});
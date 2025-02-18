const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Cambia '*' por la URL de tu frontend para mayor seguridad
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Si usas cookies o autenticación
}));

// Rutas
app.use('/api', require('./routes/api.js')); // Todas las rutas estarán bajo /api

const PORT = process.env.PORT || 5000;

// Solo inicia el servidor si el archivo se ejecuta directamente (no en tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

module.exports = app;
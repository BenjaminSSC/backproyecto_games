const express = require('express');
const cors = require('cors');
const app = express();
const API_URL = 'https://gamers-site.netlify.app' // 'http://localhost:3000'; 

// Middleware
app.use(express.json());
app.use(cors({
  origin: API_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.static('public'));

// Rutas
app.use('/api', require('./routes/api.js')); // Todas las rutas estarán bajo /api

const PORT = process.env.PORT || 5000;

// Solo inicia el servidor si el archivo se ejecuta directamente (no en tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

module.exports = app;
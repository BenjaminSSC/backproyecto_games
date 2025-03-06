const express = require('express');
const cors = require('cors');
const path = require('path'); 
const app = express();
const API_URL = 'https://gamers-site.netlify.app' //'http://localhost:3000'

// Middleware
app.use(express.json());
app.use(cors({
  origin: API_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api', require('./routes/api.js')); 

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

module.exports = app;
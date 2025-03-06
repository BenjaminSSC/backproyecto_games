const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db/db.js');
const path = require('path')
const multer = require('multer');
const { SECRET_KEY } = require('../secretKey');
const { authenticateToken, validateLoginCredentials } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  },
});
const upload = multer({ storage });

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
}

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Se requiere email y password' });
    }

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserResult = await db.query(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id',
      [email, hashedPassword]
    );

    const token = jwt.sign(
      { userId: newUserResult.rows[0].id, email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token: token,
    });
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Ruta para login
router.post('/login', validateLoginCredentials, async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
        const token = generateAccessToken(user);
        res.json({ token });
      } else {
        res.status(401).send('Contraseña incorrecta');
      }
    } else {
      res.status(401).send('Usuario no encontrado');
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send(err.message);
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT email FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        lastPost: user.lastPost || 'Sin publicaciones recientes',
        avatarUrl: user.avatarUrl || null,
      });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener datos del usuario:', err);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT id AS id, nombre_juego AS name, descripcion AS description, precio AS price, fecha_lanzamiento AS releaseDate, imageurl FROM products');
    const products = result.rows.map((product) => ({
      ...product,
      price: parseFloat(product.price),
    }));
    res.json(products);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productResult = await db.query(
      'SELECT id, nombre_juego, descripcion, precio, fecha_lanzamiento, imageurl, videourl FROM products WHERE id = $1',
      [id]
    );
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const product = productResult.rows[0];

    const platformsResult = await db.query(
      `SELECT p.id_plataforma AS id, p.nombre_plataforma, jp.usado
       FROM plataformas p
       JOIN juegos_plataformas jp ON p.id_plataforma = jp.id_plataforma
       WHERE jp.id = $1`,
      [id]
    );
    const platforms = platformsResult.rows;

    res.json({
      id: product.id,
      name: product.nombre_juego,
      description: product.descripcion || 'Sin descripción',
      price: parseFloat(product.precio),
      releaseDate: product.fecha_lanzamiento,
      imageurl: product.imageurl,
      videourl: product.videourl || null,
      platforms: platforms.map((platform) => ({
        id: platform.id,
        name: platform.nombre_plataforma,
        used: platform.usado,
      })),
    });
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

router.post('/products', authenticateToken, upload.single('image'), async (req, res) => {
  const { nombre_juego, descripcion, precio, id_plataforma, usado } = req.body;
  const imageurl = req.file ? `/uploads/${req.file.filename}` : null;

  // Validación básica
  if (!nombre_juego || !precio || !id_plataforma) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre_juego, precio, id_plataforma' });
  }

  // Convertimos "usado" a booleano (viene como string desde FormData)
  const isUsado = usado === 'true' || usado === true;

  try {
    // Insertar el producto en la tabla products
    const productQuery = `
      INSERT INTO products (nombre_juego, descripcion, precio, imageurl, fecha_lanzamiento)
      VALUES ($1, $2, $3, $4, CURRENT_DATE)
      RETURNING *;
    `;
    const productValues = [nombre_juego, descripcion, precio, imageurl];
    const productResult = await db.query(productQuery, productValues);

    const newProduct = productResult.rows[0];

    // Insertar la relación en juegos_plataformas con el valor de "usado"
    const plataformaQuery = `
      INSERT INTO juegos_plataformas (id, id_plataforma, usado)
      VALUES ($1, $2, $3);
    `;
    await db.query(plataformaQuery, [newProduct.id, id_plataforma, isUsado]);

    // Devolver el producto en el formato esperado por el frontend
    res.status(201).json({
      id: newProduct.id,
      name: newProduct.nombre_juego,
      description: newProduct.descripcion,
      price: parseFloat(newProduct.precio),
      imageurl: newProduct.imageurl,
      releaseDate: newProduct.fecha_lanzamiento,
    });
  } catch (err) {
    console.error('Error al crear producto:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

module.exports = router;
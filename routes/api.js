const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db/db.js');
const { SECRET_KEY } = require('../secretKey');
const { authenticateToken, validateLoginCredentials } = require('../middleware/auth');

// Función para generar un token JWT
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

    // Obtener los datos del producto
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const product = productResult.rows[0];

    // Obtener las plataformas asociadas al producto
    const platformsResult = await db.query(
      `SELECT p.id_plataforma AS id, p.nombre_plataforma, jp.usado
       FROM plataformas p
       JOIN juegos_plataformas jp ON p.id_plataforma = jp.id_plataforma
       WHERE jp.id = $1`,
      [id]
    );
    const platforms = platformsResult.rows;

    // Combinar los datos del producto con las plataformas
    res.json({
      id: product.id,
      name: product.nombre_juego,
      description: product.descripcion,
      price: product.precio,
      releaseDate: product.fecha_lanzamiento,
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

// Ruta protegida
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Ruta protegida, acceso concedido!' });
});

module.exports = router;
// Importamos Express para crear el servidor
const express = require('express');

// Importamos los datos desde archivos JSON locales.
// Esto nos permite simular una "fuente de datos" sin usar base de datos todavía.
const usuarios = require('./usuarios.json');
const productos = require('./productos.json');

// Creamos la aplicación Express
const app = express();

// Definimos el puerto donde correrá el servidor
const PORT = 3000;

// Middleware para poder recibir JSON en futuras peticiones.
// En este ejercicio de GET no es indispensable, pero es buena práctica dejarlo preparado.
app.use(express.json());

/*
  =========================
  RUTAS DEL RECURSO USUARIOS
  =========================
*/

// GET /api/v1/usuarios
// Devuelve la colección completa de usuarios
app.get('/api/v1/usuarios', (req, res) => {
  res.status(200).json({
    ok: true,
    data: usuarios
  });
});

// GET /api/v1/usuarios/:id
// Devuelve un usuario específico según su id
app.get('/api/v1/usuarios/:id', (req, res) => {
  // req.params.id llega como string, por eso lo convertimos a número
  const id = Number(req.params.id);

  // Buscamos el usuario que tenga ese id
  const usuarioEncontrado = usuarios.find(usuario => usuario.id === id);

  // Si no existe, respondemos con 404
  if (!usuarioEncontrado) {
    return res.status(404).json({
      ok: false,
      mensaje: 'Usuario no encontrado'
    });
  }

  // Si existe, respondemos con 200 y el recurso encontrado
  res.status(200).json({
    ok: true,
    data: usuarioEncontrado
  });
});

/*
  ==========================
  RUTAS DEL RECURSO PRODUCTOS
  ==========================
*/

// GET /api/v1/productos
// Devuelve la colección completa de productos
app.get('/api/v1/productos', (req, res) => {
  res.status(200).json({
    ok: true,
    data: productos
  });
});

// GET /api/v1/productos/:id
// Devuelve un producto específico según su id
app.get('/api/v1/productos/:id', (req, res) => {
  const id = Number(req.params.id);

  // Buscamos el producto por id
  const productoEncontrado = productos.find(producto => producto.id === id);

  // Si no se encuentra, respondemos con 404
  if (!productoEncontrado) {
    return res.status(404).json({
      ok: false,
      mensaje: 'Producto no encontrado'
    });
  }

  // Si sí existe, respondemos con el producto
  res.status(200).json({
    ok: true,
    data: productoEncontrado
  });
});

// Levantamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
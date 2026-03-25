// Importamos Express para crear el servidor
const express = require('express')

// Importamos fs/promises para trabajar con archivos de forma asincrónica
const fs = require('fs/promises')

// path nos ayuda a construir rutas seguras al archivo
const path = require('path')

const app = express()
const PORT = 3000

// Ruta absoluta al archivo catalogo.json
const DATA_PATH = path.join(__dirname, 'catalogo.json')

// Middleware para interpretar JSON en el body de las peticiones
app.use(express.json())


/*
=========================
FUNCIONES AUXILIARES
=========================
Estas funciones encapsulan la lógica de leer y escribir archivos
*/

// Leer el catálogo desde el archivo
async function leerCatalogo() {

  try {

    // leemos el archivo como texto
    const contenido = await fs.readFile(DATA_PATH, 'utf8')

    // convertimos texto JSON a objeto JavaScript
    return JSON.parse(contenido)

  } catch (error) {

    // si el archivo no existe, lo creamos vacío
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_PATH, '[]')
      return []
    }

    throw error
  }
}


// Guardar catálogo en archivo
async function escribirCatalogo(data) {

  // JSON.stringify convierte objeto JS en texto JSON
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2))
}


/*
=========================
GET /libros
=========================
Devuelve todos los libros del catálogo
*/

app.get('/libros', async (req, res) => {

  const libros = await leerCatalogo()

  res.status(200).json({
    ok: true,
    data: libros
  })

})


/*
=========================
POST /libros
=========================
Crea un nuevo libro
*/

app.post('/libros', async (req, res) => {

  const { titulo, autor, anio } = req.body

  // validación básica
  if (!titulo || !autor || !Number.isInteger(anio)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Datos inválidos'
    })
  }

  const libros = await leerCatalogo()

  // generamos nuevo ID
  const nuevoId = Math.max(0, ...libros.map(l => l.id)) + 1

  const nuevoLibro = {
    id: nuevoId,
    titulo,
    autor,
    anio
  }

  libros.push(nuevoLibro)

  await escribirCatalogo(libros)

  res.status(201).json({
    ok: true,
    data: nuevoLibro
  })

})


/*
=========================
PUT /libros/:id
=========================
Actualiza un libro existente
*/

app.put('/libros/:id', async (req, res) => {

  const id = Number(req.params.id)
  const { titulo, autor, anio } = req.body

  if (!Number.isInteger(id) || !titulo || !autor || !Number.isInteger(anio)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Datos inválidos'
    })
  }

  const libros = await leerCatalogo()

  // buscamos el índice del libro
  const indice = libros.findIndex(libro => libro.id === id)

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: 'Libro no encontrado'
    })
  }

  const libroActualizado = { id, titulo, autor, anio }

  libros[indice] = libroActualizado

  await escribirCatalogo(libros)

  res.status(200).json({
    ok: true,
    data: libroActualizado
  })

})


/*
=========================
DELETE /libros/:id
=========================
Elimina un libro
*/

app.delete('/libros/:id', async (req, res) => {

  const id = Number(req.params.id)

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'ID inválido'
    })
  }

  const libros = await leerCatalogo()

  const indice = libros.findIndex(libro => libro.id === id)

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      mensaje: 'Libro no encontrado'
    })
  }

  const libroEliminado = libros.splice(indice, 1)[0]

  await escribirCatalogo(libros)

  res.status(200).json({
    ok: true,
    data: libroEliminado
  })

})


// levantamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
// importamos dependencias
const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const app = express()
const PORT = 3000


/*
========================
ASEGURAR CARPETA UPLOADS
========================
Si la carpeta no existe, la creamos automáticamente
*/

const UPLOAD_DIR = path.join(__dirname, 'uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}


/*
========================
CONFIGURACIÓN DE MULTER
========================
Definimos dónde y cómo se guardan los archivos
*/

const storage = multer.diskStorage({

  // carpeta destino
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },

  // nombre único para evitar colisiones
  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname).toLowerCase()

    const uniqueName = Date.now() + ext

    cb(null, uniqueName)
  }

})


/*
========================
VALIDACIÓN DE TIPO MIME
========================
Solo permitimos imágenes
*/

const fileFilter = (req, file, cb) => {

  const allowed = /image\/(jpeg|png|gif)/

  if (allowed.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipo de archivo no permitido'))
  }

}


/*
========================
CONFIGURAR MULTER
========================
*/

const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },

  fileFilter

})


/*
========================
SERVIR ARCHIVOS ESTÁTICOS
========================
Aquí vive nuestro frontend
*/

app.use(express.static(path.join(__dirname, 'public')))


/*
========================
ENDPOINT DE SUBIDA
========================
*/

app.post('/upload', upload.single('foto'), (req, res) => {

  if (!req.file) {

    return res.status(400).json({
      ok: false,
      mensaje: 'No se recibió una imagen válida'
    })

  }

  res.status(201).json({

    ok: true,
    mensaje: 'Imagen subida correctamente',
    archivo: req.file.filename,
    ruta: `/uploads/${req.file.filename}`

  })

})


/*
========================
MANEJO DE ERRORES
========================
*/

app.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {

    return res.status(400).json({
      ok: false,
      mensaje: err.message
    })

  }

  if (err) {

    return res.status(415).json({
      ok: false,
      mensaje: err.message
    })

  }

  res.status(500).json({
    ok: false,
    mensaje: 'Error interno'
  })

})


/*
========================
INICIAR SERVIDOR
========================
*/

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})
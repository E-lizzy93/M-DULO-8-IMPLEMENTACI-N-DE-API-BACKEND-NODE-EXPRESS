require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const auth = require('./middlewares/auth')

const app = express()

app.use(express.json())

/*
================================
BASE DE USUARIOS (EN MEMORIA)
================================
En producción esto sería una base de datos
*/

const users = []

/*
================================
REGISTRO DE USUARIO
================================
*/

app.post('/auth/register', async (req, res) => {

  const { email, password } = req.body

  if (!email || !password) {

    return res.status(400).json({
      ok: false,
      mensaje: 'Email y password son requeridos'
    })

  }

  // evitar duplicados
  if (users.find(u => u.email === email)) {

    return res.status(409).json({
      ok: false,
      mensaje: 'Email ya registrado'
    })

  }

  // hash de contraseña
  const passwordHash = await bcrypt.hash(password, 10)

  users.push({
    email,
    passwordHash,
    role: 'user'
  })

  res.status(201).json({
    ok: true,
    mensaje: 'Usuario creado'
  })

})

/*
================================
LOGIN
================================
*/

app.post('/auth/login', async (req, res) => {

  const { email, password } = req.body

  if (!email || !password) {

    return res.status(400).json({
      ok: false,
      mensaje: 'Email y password son requeridos'
    })

  }

  const user = users.find(u => u.email === email)

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {

    return res.status(401).json({
      ok: false,
      mensaje: 'Credenciales inválidas'
    })

  }

  // generar token
  const token = jwt.sign(

    {
      sub: email,
      email,
      role: user.role
    },

    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_EXPIRES
    }

  )

  res.json({
    ok: true,
    token
  })

})

/*
================================
RUTA PROTEGIDA
================================
*/

app.get('/api/perfil', auth, (req, res) => {

  res.json({

    ok: true,

    data: {
      email: req.user.email,
      role: req.user.role
    }

  })

})

/*
================================
INICIAR SERVIDOR
================================
*/

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {

  console.log(`API segura en http://localhost:${PORT}`)

})
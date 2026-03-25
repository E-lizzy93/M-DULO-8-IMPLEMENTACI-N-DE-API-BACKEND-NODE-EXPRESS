const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {

  // leer header Authorization
  const header = req.headers.authorization || ''

  const [type, token] = header.split(' ')

  // validar formato Bearer
  if (type !== 'Bearer' || !token) {

    return res.status(401).json({
      ok: false,
      mensaje: 'Token requerido'
    })

  }

  try {

    // verificar token
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // adjuntar usuario al request
    req.user = payload

    next()

  } catch (error) {

    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o expirado'
    })

  }

}
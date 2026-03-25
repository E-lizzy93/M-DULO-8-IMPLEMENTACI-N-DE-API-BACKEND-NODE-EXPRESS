const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token requerido",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    return next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token invalido o expirado",
    });
  }
};

module.exports = auth;

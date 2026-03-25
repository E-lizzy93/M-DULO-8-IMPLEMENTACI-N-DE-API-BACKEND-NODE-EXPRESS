const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: "username, email y password son requeridos",
    });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({
      ok: false,
      mensaje: "El email no tiene un formato valido",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      ok: false,
      mensaje: "La password debe tener al menos 6 caracteres",
    });
  }

  try {
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

    if (existingUser.rowCount > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El email ya esta registrado",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username.trim(), email.trim().toLowerCase(), passwordHash]
    );

    return res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("register error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al registrar usuario",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: "email y password son requeridos",
    });
  }

  try {
    const result = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [
      email.trim().toLowerCase(),
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        ok: false,
        mensaje: "Credenciales invalidas",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,
        mensaje: "Credenciales invalidas",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    return res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error("login error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al iniciar sesion",
    });
  }
};

module.exports = {
  register,
  login,
};

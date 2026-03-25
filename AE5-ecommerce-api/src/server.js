require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const port = Number(process.env.PORT || 3000);
const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    data: { status: "up" },
  });
});

app.use((err, _req, res, _next) => {
  if (err.message === "Solo se permiten archivos jpg y png") {
    return res.status(400).json({
      ok: false,
      mensaje: err.message,
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      ok: false,
      mensaje: "El archivo supera el tamano maximo de 2MB",
    });
  }

  console.error("unhandled error", err);
  return res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor",
  });
});

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: "Ruta no encontrada",
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;

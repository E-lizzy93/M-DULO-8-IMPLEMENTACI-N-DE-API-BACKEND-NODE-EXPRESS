const express = require("express");
const multer = require("multer");
const path = require("path");

const auth = require("../middlewares/auth");
const { uploadFile } = require("../controllers/upload.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Solo se permiten archivos jpg y png"));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

router.post("/", auth, upload.single("image"), uploadFile);

module.exports = router;

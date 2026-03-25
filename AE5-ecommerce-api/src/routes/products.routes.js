const express = require("express");

const auth = require("../middlewares/auth");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

const router = express.Router();

router.get("/", auth, getProducts);
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;

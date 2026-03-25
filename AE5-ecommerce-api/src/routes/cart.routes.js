const express = require("express");

const auth = require("../middlewares/auth");
const { addToCart, getCart, removeFromCart } = require("../controllers/cart.controller");

const router = express.Router();

router.post("/", auth, addToCart);
router.get("/", auth, getCart);
router.delete("/:productId", auth, removeFromCart);

module.exports = router;

const pool = require("../config/db");

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || Number(quantity) < 1) {
    return res.status(400).json({
      ok: false,
      mensaje: "productId y quantity validos son requeridos",
    });
  }

  try {
    const productResult = await pool.query("SELECT id FROM products WHERE id = $1", [productId]);

    if (productResult.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado",
      });
    }

    const existingItem = await pool.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [req.userId, productId]
    );

    let result;

    if (existingItem.rowCount > 0) {
      const newQuantity = existingItem.rows[0].quantity + Number(quantity);
      result = await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING id, user_id, product_id, quantity",
        [newQuantity, req.userId, productId]
      );
    } else {
      result = await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id, user_id, product_id, quantity",
        [req.userId, productId, Number(quantity)]
      );
    }

    return res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("addToCart error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al agregar producto al carrito",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         c.product_id,
         c.quantity,
         p.name,
         p.description,
         p.price
       FROM cart_items c
       INNER JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1
       ORDER BY c.id ASC`,
      [req.userId]
    );

    return res.status(200).json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("getCart error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener carrito",
    });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING id",
      [req.userId, productId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado en el carrito",
      });
    }

    return res.status(200).json({
      ok: true,
      data: { productId: Number(productId) },
    });
  } catch (error) {
    console.error("removeFromCart error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al eliminar producto del carrito",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};

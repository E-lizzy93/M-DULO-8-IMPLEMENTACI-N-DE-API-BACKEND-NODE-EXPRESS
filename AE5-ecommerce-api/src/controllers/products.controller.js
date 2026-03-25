const pool = require("../config/db");

const getProducts = async (_req, res) => {
  try {
    const result = await pool.query("SELECT id, name, description, price FROM products ORDER BY id ASC");

    return res.status(200).json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("getProducts error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener productos",
    });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: "name, description y price son requeridos",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING id, name, description, price",
      [name.trim(), description.trim(), Number(price)]
    );

    return res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("createProduct error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al crear producto",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || price === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: "name, description y price son requeridos",
    });
  }

  try {
    const result = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING id, name, description, price",
      [name.trim(), description.trim(), Number(price), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("updateProduct error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al actualizar producto",
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      data: { id: Number(id) },
    });
  } catch (error) {
    console.error("deleteProduct error", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al eliminar producto",
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

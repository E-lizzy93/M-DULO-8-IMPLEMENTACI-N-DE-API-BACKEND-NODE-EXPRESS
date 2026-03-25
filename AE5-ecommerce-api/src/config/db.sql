DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

INSERT INTO products (name, description, price) VALUES
  ('Teclado Mecanico', 'Teclado gamer con retroiluminacion RGB.', 59.99),
  ('Mouse Inalambrico', 'Mouse ergonomico con conexion 2.4G.', 24.90),
  ('Monitor 24 Pulgadas', 'Monitor Full HD ideal para estudio y trabajo.', 189.00),
  ('Audifonos Bluetooth', 'Audifonos over-ear con cancelacion pasiva.', 79.50);

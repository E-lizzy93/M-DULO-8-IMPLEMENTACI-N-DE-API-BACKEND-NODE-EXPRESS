# E-Commerce API RESTful con JWT y PostgreSQL

Proyecto academico fullstack con backend en Node.js + Express + PostgreSQL y un frontend simple en HTML, Bootstrap 5 y Fetch API.

## Caracteristicas

- Registro y login de usuarios con JWT.
- Middleware de autenticacion para rutas protegidas.
- CRUD basico de productos.
- Carrito de compras asociado al usuario autenticado.
- Subida de archivos con `multer`.
- Frontend simple que consume la API desde `public/index.html`.

## Estructura

```text
ecommerce-api
├── src
│   ├── config
│   │   ├── db.js
│   │   └── db.sql
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── products.controller.js
│   │   └── upload.controller.js
│   ├── middlewares
│   │   └── auth.js
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── products.routes.js
│   │   └── upload.routes.js
│   └── server.js
├── public
│   └── index.html
├── uploads
├── .env
├── package.json
├── README.md
└── server.js
```

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior

## Instalacion

1. Instala dependencias:

```bash
npm install
```

2. Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE ecommerce_db;
```

3. Ejecuta el script SQL ubicado en [`/Users/fabo/resolucion-modulo-8/AE5-ecommerce-api/src/config/db.sql`](/Users/fabo/resolucion-modulo-8/AE5-ecommerce-api/src/config/db.sql).

4. Configura las variables de entorno en [`/Users/fabo/resolucion-modulo-8/AE5-ecommerce-api/.env`](/Users/fabo/resolucion-modulo-8/AE5-ecommerce-api/.env).

5. Levanta el proyecto:

```bash
npm run dev
```

6. Abre en el navegador:

```text
http://localhost:3000
```

## Variables de entorno

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=super_secret_jwt_key
```

## Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart

- `POST /api/cart`
- `GET /api/cart`
- `DELETE /api/cart/:productId`

### Upload

- `POST /api/upload`

Campo esperado para archivo: `image`

## Formato de respuestas

Exito:

```json
{
  "ok": true,
  "data": {}
}
```

Login:

```json
{
  "ok": true,
  "token": "jwt_token"
}
```

Error:

```json
{
  "ok": false,
  "mensaje": "Descripcion del error"
}
```

## Notas

- El token JWT expira en 15 minutos.
- Las rutas protegidas requieren `Authorization: Bearer <token>`.
- La subida de archivos acepta solo `jpg` y `png` con limite de 2MB.

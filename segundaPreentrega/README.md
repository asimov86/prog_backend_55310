## Segunda pre entrega del proyecto final

### Rutas de usuarios

GET  /users/create
GET  /users/
POST /users/

### Rutas de productos

GET     /api/products/
GET     /api/products/:pid
POST    /api/products
PUT     /api/products/:pid
DELETE  /api/products/:pid

### Rutas de carrito

GET    /api/carts/:cid
POST   /api/carts/
POST   /api/carts/:cid/products/:pid
PUT    /api/carts/:cid
PUT    /api/carts/:cid/products/:pid
DELETE /api/carts/:cid
DELETE /api/carts/:cid/products/:pid

### Rutas de chats

GET     /api/chats
POST    /api/chats

### Rutas de vistas

GET     /api/views/products
GET     /api/views/carts:cid
GET     /api/views/realTimeProducts
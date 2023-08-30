## Segunda pre entrega del proyecto final

### Rutas de usuarios

GET  /users/create <br>
GET  /users/<br>
POST /users/<br>

### Rutas de productos

GET     /api/products/<br>
GET     /api/products/:pid<br>
POST    /api/products<br>
PUT     /api/products/:pid<br>
DELETE  /api/products/:pid<br>

### Rutas de carrito

GET    /api/carts/:cid<br>
POST   /api/carts/<br>
POST   /api/carts/:cid/products/:pid<br>
PUT    /api/carts/:cid<br>
PUT    /api/carts/:cid/products/:pid<br>
DELETE /api/carts/:cid<br>
DELETE /api/carts/:cid/products/:pid<br>

### Rutas de chats

GET     /api/chats<br>
POST    /api/chats<br>

### Rutas de vistas

GET     /api/views/products<br>
GET     /api/views/carts:cid<br>
GET     /api/views/realTimeProducts<br>
//const products_api = require('./DAOs/api/products_api');
const ProductsDao = require('./DAOs/dbManagers/ProductsDao');
// Configura socket.io para escuchar eventos de conexión

// Esta clase se utilizará para configurar y manejar la lógica de WebSocket
class SocketConfig {
    // El constructor es el método que se ejecutará cada vez que se cree una nueva instancia de 'io'
    constructor(io){
        this.io = io;// almacenamos la instancia de io
        //this.productsApi = new products_api();
        this.productsApi = new ProductsDao();
        this.configureSocket();
    }
    configureSocket() {
        this.io.on('connection', async (socket) => {
            console.log('A user connected');

            // Carga inicial de productos
            socket.emit('products', await this.productsApi.findAll());

            // Manejo de eventos de socket.io
            // actualizacion de productos
            socket.on('update', async producto => {
                //aca debo agregarun trycatch
                //this.productsApi.save(producto);
                const insertProduct = await this.productsApi.insertOne(producto);
                this.io.sockets.emit('products', await this.productsApi.findAll());
            });

            // Manejo de mensajes del chat
            socket.on('message', (data) => {
                // Aquí puedes agregar lógica para guardar el mensaje en el servidor si es necesario
                // Y luego emitirlo a todos los clientes conectados
                this.io.sockets.emit('newMessage', data);
            });

            // Eliminamos un producto
            socket.on('delete', async productId => {
                const deleteProduct = await this.productsApi.deleteById(productId);
                this.io.sockets.emit('products', await this.productsApi.findAll());
            })

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }

}

module.exports = SocketConfig;
//const products_api = require('./DAOs/api/products_api');
const ProductsDao = require('./DAOs/dbManagers/ProductsDao');
// Configura socket.io para escuchar eventos de conexión
const limitValue = 10;
const page = 1;
const customQuery = '';
const sort = '';
// Esta clase se utilizará para configurar y manejar la lógica de WebSocket
class SocketConfig {
    // El constructor es el método que se ejecutará cada vez que se cree una nueva instancia de 'io'
    constructor(io){
        this.io = io;// almacenamos la instancia de io
        //this.productsApi = new products_api();
        this.productsApi = new ProductsDao();
        this.configureSocket();
        
    }

    async sendUpdatedProducts() {
        const updatedProducts = await this.productsApi.findAll(customQuery,page,limitValue,sort);
        this.io.sockets.emit('products', updatedProducts.docs);
    }

    configureSocket() {
        this.io.on('connection', async (socket) => {
            console.log('A user connected');
            // Carga inicial de productos
            const initialProducts  = await this.productsApi.findAll(customQuery,page,limitValue,sort);
            //const productos = initialProducts.docs;
            //console.log(productos);
            socket.emit('products', initialProducts);

            // Manejo de eventos de socket.io
            // actualizacion de productos
            socket.on('update', async producto => {
                //aca debo agregarun trycatch
                //this.productsApi.save(producto);
                //console.log(producto);
                const insertProduct = await this.productsApi.insertOne(producto);
                //const newProduct = await this.productsApi.findAll(customQuery,page,limitValue,sort);
                //const productos = newProduct.docs;
                //this.io.sockets.emit('products', newProduct);
                this.sendUpdatedProducts(customQuery,page,limitValue,sort);
            });

            // Manejo de mensajes del chat
            socket.on('message', (data) => {
                // Agregar lógica para guardar el mensaje en el servidor si es necesario
                // Y luego emitirlo a todos los clientes conectados
                this.io.sockets.emit('newMessage', data);
            });

            // Eliminamos un producto
            socket.on('delete', async productId => {
                try {
                    const deleteProduct = await this.productsApi.deleteById(productId);
                    //this.io.sockets.emit('products', await this.productsApi.findAll());
                    const updatedProducts = await this.productsApi.findAll(customQuery,page,limitValue,sort);
                    // Emitir evento de confirmación y enviar la lista actualizada de productos al cliente
                    // socket.emit('productDeleted', updatedProducts);
                    this.sendUpdatedProducts();
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                }
            })

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }

}

module.exports = SocketConfig; 
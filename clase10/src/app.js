const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars');
const http = require('http');
const io = require('socket.io');

const products_api = require('./api/products_api.js');


//--------------------------------------------
// instancio servidor, socket y api

const app = express();

const myServer = http.Server(app);
const myWSServer = io(myServer);

const productosApi = new products_api();

//--------------------------------------------
// configuro el socket

myWSServer.on('connection', async socket => {
    console.log('Un nuevo usuario se ha conectado');

    // carga inicial de productos
    socket.emit('products', productosApi.showAll());

    // actualizacion de productos
    socket.on('update', producto => {
        productosApi.save(producto)
        myWSServer.sockets.emit('products', productosApi.showAll());
    })

});


// Se agrega lo sig para poder trabajar correctamente con lo que nos envian en el body de un POST o PUT
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));


let productos = [
    {
        "id":1,
        "title":"Hamburguesa Simple",
        "description":"Hamburguesa simple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
        "product":"Hamburguesa",
        "price":980,
        "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
        "code":"2A32F3212",
        "stock":85
    },
    {
        "id":2,
        "title":"Hamburguesa Doble","description":"Hamburguesa doble carne, doble queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
        "product":"Hamburguesa",
        "price":1080,
        "thumbnail":"https://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg",
        "code":"2A32F3214",
        "stock":28
    },
    {
        "id":3,
        "title":"Coca Cola",
        "description":"Bebida Coca Cola de lata 355 ml.",
        "product":"Bebida",
        "price":980,
        "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
        "code":"2A32F3226",
        "stock":120
    },
    {
        "id":4,
        "title":"Hamburguesa Triple",
        "description":"Hamburguesa triple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
        "product":"Hamburguesa",
        "price":1380,
        "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
        "code":"2A32F3228",
        "stock":189
    },
    {
        "id":5,
        "title":"Hamburguesa cuadruple",
        "description":"Hamburguesa cuadruple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
        "product":"Hamburguesa",
        "price":1580,
        "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
        "code":"2A32F3230",
        "stock":98
    },
    {
        "id":6,
        "title":"Hamburguesa de pollo",
        "description":"Hamburguesa de pollo con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
        "product":"Hamburguesa",
        "price":1180,
        "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
        "code":"2A32F3231",
        "stock":83
    }
];

//Rutas para productos

//GET

app.get("/realTimeProducts", (req, res) => {
    const product = productos;
    res.render('realTimeProducts', { 
        product: product,
        listExists: true,});
});

app.get("/home", (req, res) => {
    const product = productos;
    res.render('home', { 
        product: product,
        listExists: true,});
});

// Inicializacion de servidor, definicion y asignacion de puerto
const puerto = 8080
const server = myServer.listen(puerto, () => {
    console.log('Server arriba en puerto', puerto)
})
server.on('error', error => console.log(`Error en servidor ${error}`))

const express = require('express');
const handlebars = require('express-handlebars');
const router = require('./router');
const connectMongo = require('./db');
const http = require('http'); // Importa el módulo http
const socketIo = require('socket.io'); // Importa socket.io
const app = express();
const server = http.createServer(app); // Crea el servidor http utilizando tu instancia de Express
const io = socketIo(server); // Crea una instancia de socket.io y pásale el servidor http
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGODB_URI } = require('./public/js/config');
// Middleware configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({
    store : MongoStore.create({
        mongoUrl: "mongodb+srv://mongooseUser:MpMeleWU5BNrhOgg@mongoosecluster0.a4g1hor.mongodb.net/ecommerce55310?retryWrites=true",
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl:20
    }),
    secret: "secretCode", 
    resave: false, 
    saveUninitialized: false
}));

// End middleware configuration
// Motor de plantillas que utilizará express
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');

connectMongo();
router(app);


module.exports = {app, server, io};
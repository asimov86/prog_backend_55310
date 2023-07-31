const express = require('express');
const router = require('./routes');
const morgan = require('morgan');
const app = express();



// --------- Inicio middleware

// Morgan: HTTP request logger middleware for node.js
app.use(morgan('combined')); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));// __dirname: path absoluto
// ----------- fin middleware

// -------- Inicio de enrutador
router(app); // router trae la app de express y se importa de ./router
// ------------ Fin de enrutador

module.exports = app;

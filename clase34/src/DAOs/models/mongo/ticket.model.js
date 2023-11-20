const mongoose = require('mongoose');


const ticketCollection = 'ticket';
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        require: true
    },
    products: [
        {
            productId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Product' // Referencia al modelo de productos
            },
            title: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            // Otros campos específicos del producto si es necesario
            // Ejemplo: precio, descripción, etc.
        }
    ],
    amount: {
        type: Number,
        require: true
    },
    purcharser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }
})


const Tickets = mongoose.model(ticketCollection, ticketSchema);
module.exports = Tickets;
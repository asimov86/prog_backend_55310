const mongoose = require('mongoose');

const userCollection = 'user';
const userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: false
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "cart"
    },
    role: {
        type:mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "role"
    },
    picture: String,
    confirmed: {
        type: Boolean,
        default: false
    },
    createTimestamp: {
        type: Date, // Utiliza el tipo de dato Date para almacenar la fecha y hora
        default: Date.now, // Establece la fecha y hora actual por defecto
    },
});

const Users = mongoose.model(userCollection, userSchema);
module.exports = Users;
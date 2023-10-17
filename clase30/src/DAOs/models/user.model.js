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
        required: true
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "carts"
    },
    role: {
        type:mongoose.SchemaTypes.ObjectId,
        required: false,
        ref: "roles"
    },
    picture: String,
    confirmed: {
        type: Boolean,
        default: false
    }
});

const Users = mongoose.model(userCollection, userSchema);
module.exports = Users;
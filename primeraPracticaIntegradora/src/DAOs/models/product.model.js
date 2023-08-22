const mongoose = require('mongoose');

const productCollection = 'product';
const productSchema= new mongoose.Schema({
    title:{
        type:String,
        unique: true
    },
    description:String,
    category:String,
    price:Number,
    thumbnail:String,
    code:String,
    stock:Number
})

const Products = mongoose.model(productCollection,productSchema);
module.exports = Products;
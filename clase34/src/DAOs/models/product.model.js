const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const productCollection = 'products';
const productSchema= new mongoose.Schema({
    title:{
        type:String,
        unique: true,
    },
    description:String,
    category:{
        type:String,
        enum:["Comida", "Bebida", "Postre"],
        index:true
    },
    price:Number,
    thumbnail:String,
    code:String,
    stock:Number
})
productSchema.plugin(mongoosePaginate);
const Products = mongoose.model(productCollection,productSchema);
module.exports = Products;
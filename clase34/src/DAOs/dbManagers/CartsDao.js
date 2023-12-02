const Carts = require('../models/mongo/cart.model');
//const Products = require('../models/mongo/product.model');
const Products = require('../../services/service.products');
class CartsDao {
    constructor(logger) {
        this.logger = logger;
    }

    async getCartById(idC) {
        try{
            let cart = await Carts.find({_id:idC}).lean().populate('products.product');
            return cart
        }catch(error){
            this.logger.info("No se pudo traer el carrito.")
        }
    }

    async createCart(product) {
        try{ 
            const newCart = await Carts.create(product);
            return newCart._id
        }catch(error){
            this.logger.info("No se pudo crear el carrito ")
        }
    }

    async addProductToCart (idC, idP) {
        try{
            // Busco que ambos existan, carrito y producto.
            // Busco el carrito
            // Busco el producto dentro de products en el carrito.
            // Si existe le aumento la cantidad sino agrego el id del producto y la cantidad en 1.
    /* db.carts.updateOne({_id:ObjectId("63e2f3aecae487e581d06f70"), products: {$elemMatch: {product: {$eq:23263}}}}, {$set:{"products.$.quantity":6}}) */
            let quantity = 1; 
            let product = await Products.getById(idP);
            if (!product) {
                return {error: 'El producto no existe.'};
            }
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            // Esto debo mejorarlo con esto>
            // https://es.stackoverflow.com/questions/511479/como-se-accede-a-un-array-de-objetos-en-javascript

            if (!cart) {
                return {error: 'El carrito no existe.'};
            }else{
                //Buscamos si el carrito tiene productos.
                if((productsCart).length===0){
                    this.logger.info("Carrito vacio");
                    let carts = await Carts.updateOne({_id: idC}, {$set:{products: {product: idP, quantity:1}}});
                    return carts
                }else{
                    this.logger.info("Carrito con productos");
                    let carts = await Carts.updateOne({_id: idC, products: {$elemMatch: {product: {$eq:idP}}}}, {$inc:{"products.$.quantity":quantity}});
                    if(carts.matchedCount===0){
                        let newProduct = [{ "product":idP, "quantity":quantity}]
                        this.logger.info("Producto nuevo, no se debe incrementar sino agregar.")
                        let carts = await Carts.updateOne({_id: idC}, {$push:{products:{$each:newProduct}}});
                        return carts
                    }
                    return carts    
                } 
            }
        }catch(error){
            this.logger.info('No se pudo agregar el producto al carrito.');
        }    
    }

    async putProduct (idC, items) {
        try {
            let cart = await Carts.find({_id:idC});
            if (!cart){
                this.logger.info('error', 'El carrito no existe.');
                return res.status(404).json({error: true , message:'El carrito no existe.'});
            }else{
                    await Carts.updateOne({_id: idC }, {$unset : {"products":1}});
                    cart = await Carts.updateOne({_id: idC }, {$set : {"products":items}});
                    return cart          
            }

        } catch (error) {
            this.logger.info("No se pudo modificar el carrito ")
        }
    }

    async putProducts (idC, idP, item) {
        try {
            let cart = await Carts.find({_id:idC});
            if (!cart){
                this.logger.info('error', 'El carrito no existe.');
                return res.status(404).json({error: true , message:'El carrito no existe.'});
            }else{
                    let number = item.findIndex(item => item.product === idP);
                    let quantityP = item[number].quantity;
                    cart = await Carts.updateOne({_id: idC, products: {$elemMatch: {product: {$eq:idP}}}}, {$set:{"products.$.quantity":quantityP}});
                    return cart     
            }
        } catch (error) {
            this.logger.info("No se pudo agregar los productos al carrito.")
        }
    }

    async deleteProduct (idC, idP) {
        try{
            let product = await Products.getById(idP);
            if (!product) {
                this.logger.info('El producto no existe.');
                return res.status(404).json({error: true , message:'El producto no existe.'});
            }
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            if (!cart) {
                this.logger.info('El carrito no existe.');
                return res.status(404).json({error: true , message:'El carrito no existe.'});
            }else{
                //Buscamos si el carrito tiene productos.
                if((productsCart).length===0){
                    // Carrito vacio
                    return
                }else{
                    // Carrito con productos
                    let cart = await Carts.updateOne({
                        _id: idC,
                      },
                      {
                        $pull: {
                          products: {
                             product: idP,
                          },
                        },
                      }
                    );
                    
                    return cart    
                } 
            }
        }catch(error){
            this.logger.info("No se pudo borrar el producto del carrito.")
        } 
    }

    async deleteProducts (idC) {
        try{
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            if (!cart) {
                this.logger.info('El carrito no existe.');
                return res.status(404).json({error: true , message:'El carrito no existe.'});
            }else{
                //Buscamos si el carrito tiene productos.
                if((productsCart).length===0){
                    //Carrito vacio
                    return
                }else{
                    //Carrito con productos
                    let cart = await Carts.updateOne({_id: idC }, {$unset : {"products":1}});
                    return cart   
                } 
            }
        }catch(error){
            this.logger.info('No se pudo borrar los productos del carrito.');
        } 
    }
}

module.exports = CartsDao;
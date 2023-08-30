const Carts = require('../models/cart.model');
const Products = require('../models/product.model');
class CartsDao {
    async getById(idC) {
        try{
            console.log(idC);
            let cart = await Carts.find({_id:idC}).lean().populate('products.product');
            return cart
        }catch(error){
            console.log ("No se pudo traer el carrito " + error)
        }
    }

    async createCart(product) {
        try{ 
            const newCart = await Carts.create(product);
            return newCart._id
        }catch(error){
            console.log ("No se pudo crear el carrito " + error)
        }
    }

    async post (idC, idP) {
        try{
            // Busco que ambos existan, carrito y producto.
            // Busco el carrito
            // Busco el producto dentro de products en el carrito.
            // Si existe le aumento la cantidad sino agrego el id del producto y la cantidad en 1.
    /* db.carts.updateOne({_id:ObjectId("63e2f3aecae487e581d06f70"), products: {$elemMatch: {product: {$eq:23263}}}}, {$set:{"products.$.quantity":6}}) */
            let quantity = 1; 
            let product = await Products.find({_id:idP});
            if (!product) {
                return {error: 'El producto no existe.'};
            }
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            // Esto debo mejorarlo con esto>
            // https://es.stackoverflow.com/questions/511479/como-se-accede-a-un-array-de-objetos-en-javascript
            console.log(productsCart);
            if (!cart) {
                return {error: 'El carrito no existe.'};
            }else{
                //Buscamos si el carrito tiene productos.
                if((productsCart).length===0){
                    console.log("Carrito vacio");
                    let carts = await Carts.updateOne({_id: idC}, {$set:{products: {product: idP, quantity:1}}});
                    return carts
                }else{
                    console.log("Carrito con productos");
                    let carts = await Carts.updateOne({_id: idC, products: {$elemMatch: {product: {$eq:idP}}}}, {$inc:{"products.$.quantity":quantity}});
                    if(carts.matchedCount===0){
                        let newProduct = [{ "product":idP, "quantity":quantity}]
                        console.log("Producto nuevo, no se debe incrementar sino agregar.")
                        let carts = await Carts.updateOne({_id: idC}, {$push:{products:{$each:newProduct}}});
                        return carts
                    }
                    return carts    
                } 
            }
        }catch(error){
            console.log ("No se pudo agregar el producto al carrito " + error)
        }    
    }

    putProduct = async(idC, items) => {
        try {
            let cart = await Carts.find({_id:idC});
            if (!cart){
                req.logger.log('error', 'El carrito no existe.');
                return res.status(404).json({error: true , message:'El carrito no existe.'});
            }else{
                    await Carts.updateOne({_id: idC }, {$unset : {"products":1}});
                    cart = await Carts.updateOne({_id: idC }, {$set : {"products":items}});
                    return cart          
            }

        } catch (error) {
            console.log ("No se pudo modificar el carrito " + error)
        }
    }

    putProducts = async(idC, idP, item) => {
        try {
            let cart = await Carts.find({_id:idC});
            if (!cart){
                req.logger.log('error', 'El carrito no existe.');
                return res.status(404).json({error: true , message:'El carrito no existe.'});
            }else{
                    let number = item.findIndex(item => item.product === idP);
                    let quantityP = item[number].quantity;
                    cart = await Carts.updateOne({_id: idC, products: {$elemMatch: {product: {$eq:idP}}}}, {$set:{"products.$.quantity":quantityP}});
                    return cart     
            }
        } catch (error) {
            console.log ("No se pudo agregar los productos al carrito. " + error)
        }
    }

    deleteProduct = async(idC, idP) => {
        try{
            let product = await Products.find({_id:idP});
            if (!product) {
                req.logger.log('error', 'El producto no existe.');
                return res.status(404).json({error: true , message:'El producto no existe.'});
            }
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            if (!cart) {
                req.logger.log('error', 'El carrito no existe.');
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
        }catch{
            console.log ("No se pudo borrar el producto del carrito. " + error)
        } 
    }

    deleteProducts = async(idC) => {
        try{
            let cart = await Carts.find({_id: idC});
            let productsCart = cart[0].products;
            if (!cart) {
                req.logger.log('error', 'El carrito no existe.');
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
        }catch{
            req.logger.log('error', 'No se pudo borrar los productos del carrito.'+ error.message);
            console.log ("No se pudo borrar los productos del carrito. " + error)
        } 
    }
}

module.exports = CartsDao;
const CartsDao = require('../DAOs/dbManagers/CartsDao');
//const products= require('../DAOs/dbManagers/ProductsDao.js');
const productsService = require('../services/service.products.js');
const ticketsService = ('../services/service.tickets.js');
//const Products = new products();
const Carts = new CartsDao();

const getCartById = async (idC) => {
    try {
        return Carts.getCartById(idC);
    } catch (error) {
        throw error;
    }
}

const createCart = async (product) => {
    try {
        return Carts.post(product);
    } catch (error) {
        throw error;
    }
}

const addProductToCart = async (idC, idP) => {
    try {

            ////////////////////////////////////////////////////////////////////////////////////////////////
            //      Busco que ambos existan, carrito y producto.
            //      Busco el producto dentro de products en el carrito.
            //      Si existe le aumento la cantidad sino agrego el id del producto y la cantidad en 1.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            let quantity = 1;
            let productList = [];
            const product = await productsService.getById(idP);
            if (product.stock === 0) { 
                const error = new Error('Producto sin existencia');
                error.code = 10001; // Asignar un código al error
                throw error;
            }
            //busco el owner del producto, si es el mismo id del usuario que está logueado no podrá comprar el producto
           /*  let ownerProduct = product[0].owner;
            let idOwnerProduct = ownerProduct.toString();
            let user = await userModel.find({cart: idC});
            let idUser= user[0]._id;
            let idOwner = idUser.toString();
            console.log(idOwner);
            console.log(idOwnerProduct); 
            if(idOwnerProduct === idOwner){
                console.log('El usuario no puede adquirir un producto que ya le pertenece.');
                return 
            }*/
            //
            let cart = await Carts.getCartById(idC);
        if(!cart){ 
            //req.logger.info(`Error!: El carrito no existe, carrito: ${cart}`);
            //return done(null, false, {message: 'Cart not found'})
            return res.send({ status: 400, message: "El carrito no existe!" });
        }
        let productsCart = cart[0].products;
        // Esto debo mejorarlo con esto>
        // https://es.stackoverflow.com/questions/511479/como-se-accede-a-un-array-de-objetos-en-javascript
        if (!cart) {
            return res.status(404).json({error: true , message:'El carrito no existe.'});
        }else{
            //Buscamos si el carrito tiene productos.
            if((productsCart).length===0){
                ////////////////////
                const stockProduct = product.stock;
                const idProduct = product.id;
                const priceProduct = product.price;
                if(stockProduct >= quantity){
                    // si es menor o igual al stock se puede comprar"
                    const newStock = stockProduct - quantity;
                    const productInfo = {  
                        productId: idProduct,
                        title: product.title,
                        quantity: quantity,
                        price: priceProduct
                    }
                    productList.push(productInfo);
                    product.stock = newStock;
                    // Actualizo el stock del producto agragdo al carrito
                    const updateStockProduct = await productsService.update(product, idProduct);
                    let carts = await Carts.addProductToCart(idC, idP);
                    return carts
                }else{
                    const error = new Error('No se puede continuar la compra. Producto con stock insuficiente.');
                    error.code = 11001; // Asignar un código al error
                    throw error;
                }
                ////////////////////
                //let carts = await cartModel.updateOne({_id: idC}, {$set:{products: {product: idP, quantity:1}}});
                //return carts
            }else{
                const stockProduct = product.stock;
                const idProduct = product.id;
                const priceProduct = product.price;
                if(stockProduct >= quantity){
                    // si es menor o igual al stock se puede comprar"
                    const newStock = stockProduct - quantity;
                    const productInfo = {  
                        productId: idProduct,
                        title: product.title,
                        quantity: quantity,
                        price: priceProduct
                    }
                    productList.push(productInfo);
                    product.stock = newStock;
                    // Actualizo el stock del producto agragdo al carrito
                    const updateStockProduct = await productsService.update(product, idProduct);
                    let carts = await Carts.addProductToCart(idC, idP);
                    return carts
                }else{
                    const error = new Error('No se puede continuar la compra. Producto con stock insuficiente.');
                    error.code = 11001; // Asignar un código al error
                    throw error;
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

const putProduct = async (idC, items) => {
    try {
        return Carts.putProduct(idC, items);
    } catch (error) {
        throw error;
    }
}

const putProducts = async (idC, idP, item) => {
    try {
        return Carts.putProducts(idC, idP, item);
    } catch (error) {
        throw error;
    }
}

const deleteProduct = async (idC, idP) => {
    try {
        const product = await productsService.getById(idP);
        const stockProduct = product.stock;
        const idProduct = product.id;
        // si es menor o igual al stock se puede comprar"
        let cart = await Carts.getCartById(idC);
        let productsCart = cart[0].products;
        for(let i=0; i<productsCart.length; i++){
            const productCart = productsCart[i].product;
            const idProductFound = productCart._id.toString();
            if (idProductFound == idP) {
                // El producto con el ID deseado está en el array "products" del carrito
                let quantity = productsCart[i].quantity;
                const newStock = stockProduct + quantity;
                product.stock = newStock;                          
            } else {
                // El producto con el ID deseado no está en el array "products" del carrito
                /* const error = new Error('El producto no está en el carrito. No se puede eliminar.');
                error.code = 11002; // Asignar un código al error
                throw error; */
            }
        }   
        // Actualizo el stock del producto eliminado del carrito
        const updateStockProduct = await productsService.update(product, idProduct);
        return Carts.deleteProduct(idC, idP);
    } catch (error) {
        throw error;
    }
}

const deleteProducts = async (idC) => {
    try {
        return Carts.deleteProducts(idC);
    } catch (error) {
        throw error;
    }
}


module.exports = {  getCartById, 
                    createCart,
                    addProductToCart, 
                    putProduct, 
                    putProducts, 
                    deleteProduct, 
                    deleteProducts};
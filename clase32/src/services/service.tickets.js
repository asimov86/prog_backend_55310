const User = require('./service.users.js');
const cartModel = require('../DAOs/models/mongo/cart.model.js');
const productModel = require('../DAOs/models/mongo/product.model.js');
const ticketModel = require('../DAOs/models/mongo/ticket.model.js');
const Ticket = require('../DAOs/dbManagers/ticketsDao.js');

const ticketService = new Ticket();


const getTickets = async () => {
    try {
        let result = await ticketService.getAll();
        return result
    } catch (error) {
        throw error;
    }
    
}

const createTicket = async (idC) => {
    try {
        /* const {cid} = req.params;
        let idC = cid; */
        //Genero codigo unico
        let codeT = await ticketService.createCode();
        //Fecha 
        let purchase_datetime = new Date();
        //Usuario que realiza la compra
        let user = await User.getUserByCart(idC);
        if(!user){
            console.log('User no existe')
            req.logger.log('error', `Error!: El usuario no existe, user: ${user}`);
            //return done(null, false, {message: 'User not found'})
            return res.status(404).send({ status: 404, message: "El usuario no existe!" });
        }
        //Monto total a pagar del carrito
        //
        //Busco los valores del carrito
        let cart = await cartModel.findOne({_id:idC}).lean().populate('products.product');
        if(!cart){ 
            req.logger.log('error', `Error!: El carrito no existe, carrito: ${cart}`);
            //return done(null, false, {message: 'Cart not found'})
            return res.send({ status: 400, message: "El carrito no existe!" });
        }
        let addToPayment = 0;
        // Recorro el carrito
        for(let i=0; i<cart.products.length; i++){
            //Busco id, precio, stock, quantity
            const idProduct = cart.products[i].product._id;
            const priceProduct = cart.products[i].product.price;
            const stockProduct = cart.products[i].product.stock;
            const quantityProduct = cart.products[i].quantity;
            // Comparo si el stock es mayor a la cantidad de compra del producto.
            if(stockProduct >= quantityProduct){
                // si es menor o igual al stock se puede comprar"
                const newStock = stockProduct - quantityProduct;
                let priceXQuantity = priceProduct*quantityProduct;
                // multiplico el precio del producto por la cantidad y lo agrego al pago total
                addToPayment = addToPayment + priceXQuantity;
                // Eliminar el producto del carrito por id, una vez que se agrega al pago total
                let idP = idProduct.toString();
                let updateCart = await cartModel.updateOne({
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
                // Actualizo el stock del producto comprado
                const updateStockProduct = await productModel.updateOne(
                    {_id: idP}, 
                    {$set:{
                        stock:newStock}
                    }
                );

            }else{
               //No se realiza la compra.
            }
        }
        
        //crear ticket de compra
        let result = await ticketModel.create({
                code:codeT, 
                purchase_datetime, 
                amount:addToPayment,
                purcharser:user.id
        });
        console.log(result);
        return result
    } catch (error) {
        throw error;
    }
    
    
};

module.exports = {
    createTicket,
    getTickets,
}




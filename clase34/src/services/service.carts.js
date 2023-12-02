const CartsDao = require('../DAOs/dbManagers/CartsDao');

const Carts = new CartsDao();

const getCartById = async (idC) => {
    try {
        return Carts.getBgetCartByIdyId(idC);
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
        return Carts.addProductToCart(idC, idP);
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
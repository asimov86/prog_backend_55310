const {Router} = require('express');
const ProductsDao = require('../DAOs/dbManagers/ProductsDao');
const CartsDao = require('../DAOs/dbManagers/CartsDao');

const router = Router();


const Products = new ProductsDao();
const Carts = new CartsDao();


// Render

router.get('/realTimeProducts', async (req, res) => {
    // Agregando límite, si no se agrega el límite trae todo los productos, de traer el límite trae la cantidad indicada.
    let limitValue = parseInt(req.query.limit, 10) || 10;
    let page = parseInt(req.query.page, 10) || 1;
    //console.log(page);
    let customQuery = req.query.query;
    if(!customQuery){
        customQuery = '';
    }else{
        customQuery = customQuery.toLowerCase();
    }
    console.log(customQuery);
    let sort = parseInt(req.query.sort) || '';
    const products = await Products.findAll(customQuery,page,limitValue,sort);
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink} = products;
    // Para la paginación
    let arr = [];
    for (let i = 0; i < totalPages; i++) {
        arr[i]=i + 1;
      }
    res.render('realTimeProducts.handlebars', { 
        newProduct: docs,
        hasPrevPage:hasPrevPage,
        hasNextPage:hasNextPage,
        prevPage:prevPage,
        nextPage:nextPage,
        totalPages:totalPages,
        prevLink:prevLink,
        nextLink:nextLink,
        limitValue:limitValue,
        sort:sort,
        customQuery:customQuery,
        arr,
        listExists: true,
    });
});

/* router.get('/realTimeProducts', async (req, res) => {
    const newProduct = await Products.findAll();
    console.log(newProduct);
    const stringifiedProducts = newProduct.map(product => ({
        ...product.toObject(),
        _id: product._id.toString()
    }));
    console.log(stringifiedProducts);
    res.render('realTimeProducts.handlebars', { 
        newProduct: stringifiedProducts,
        listExists: true,});
}); */

router.get('/products', async (req, res) => {
    // Agregando límite, si no se agrega el límite trae todo los productos, de traer el límite trae la cantidad indicada.
    let limitValue = parseInt(req.query.limit, 10) || 10;
    let page = parseInt(req.query.page, 10) || 1;
    let customQuery = req.query.query;
    if(!customQuery){
        customQuery = '';
    }else{
        customQuery = customQuery.toLowerCase();
    }
    console.log(customQuery);
    let sort = parseInt(req.query.sort) || 1;
    const listProducts = await Products.findAll(customQuery,page,limitValue,sort);
    const allProducts = listProducts.docs;
    console.log(allProducts);
    const stringifiedProducts = allProducts.map(product => ({
        ...product,
        _id: product._id.toString()
    }));
    // Para la paginación
    let arr = [];
    for (let i = 0; i < listProducts.totalPages; i++) {
        arr[i]=i + 1;
      }
    res.render('home.handlebars', { 
        listProducts: stringifiedProducts,
        hasPrevPage:listProducts.hasPrevPage,
        hasNextPage:listProducts.hasNextPage,
        prevPage:listProducts.prevPage,
        nextPage:listProducts.nextPage,
        totalPages:listProducts.totalPages,
        prevLink:listProducts.prevLink,
        nextLink:listProducts.nextLink,
        limitValue:listProducts.limitValue,
        sort:listProducts.sort,
        customQuery:listProducts.customQuery,
        arr:arr,
        listExists: true,});
});

//Renderizar carrito
router.get('/carts/:cid', async (req,res) => {
    let idC = req.params.cid;
    let car = '';
    console.log(idC);
    car = await Carts.getById(idC);
    let carP = [];
    console.log(car);
    if(!car){
        carP=null;
        console.log('error', `Alerta!: El carrito al que intenta acceder no existe. id: ${idC}`);
    }else{
        carP =car[0].products;
    }   
    res.render('cart.handlebars', {cartP: carP, idCart: idC});
})

module.exports = router;
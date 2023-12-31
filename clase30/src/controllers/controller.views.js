const {Router} = require('express');
//const ProductsDao = require('../DAOs/dbManagers/ProductsDao');
const productsService = require('../services/service.products.js');
const CartsDao = require('../DAOs/dbManagers/CartsDao');
//const UsersDao = require('../DAOs/dbManagers/UsersDao');
const usersService = require('../services/service.users.js');
const passportCall = require('../utils/passport-call');
const { isAdmin } = require('../middleware/authorization.js');
const router = Router();


//const Products = new ProductsDao();
const Carts = new CartsDao();
//const Users = new UsersDao();

// Render

router.get('/realTimeProducts', passportCall('jwt'), isAdmin, async (req, res, next) => {
    const uid = req.user.user;
    console.log(uid);
    const {id, email, name, lastname, role, picture} = await usersService.getUserByID(uid);
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
    let sort = parseInt(req.query.sort) || '';
    const products = await productsService.findAll(customQuery,page,limitValue,sort);
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

router.get('/products', passportCall('jwt'), async (req, res) => {
    const uid = req.user.user;
    console.log(uid);
    const {id, email, name, lastname, role, cart, picture} = await usersService.getUserByID(uid);
    
    // Agregando límite, si no se agrega el límite trae todo los productos, de traer el límite trae la cantidad indicada.
    let limitValue = parseInt(req.query.limit, 10) || 10;
    let page = parseInt(req.query.page, 10) || 1;
    let customQuery = req.query.query;
    if(!customQuery){
        customQuery = '';
    }else{
        customQuery = customQuery.toLowerCase();
    }
    let sort = parseInt(req.query.sort) || 1;
    const listProducts = await productsService.findAll(customQuery,page,limitValue,sort);
    const allProducts = listProducts.docs;
    //console.log(allProducts);
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
        listExists: true,
        id:id,
        email:email,
        name:name,
        lastname:lastname,
        role:role,
        cart:cart._id.toString(),
        picture:picture,
    });
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

router.get('/register', (req, res) => {
    res.render('register.handlebars');
})

router.get('/login', (req, res) => {
    res.render('login.handlebars');
})

module.exports = router;
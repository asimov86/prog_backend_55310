const {Router} = require('express');
const ProductsDao = require('../DAOs/dbManagers/ProductsDao');

const Products = new ProductsDao();
const router = Router();



// Render

/* router.get('/realTimeProducts', async (req, res) => {
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
}); */

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

/* router.get('/home', async (req, res) => {
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
}); */

// API
router.get('/', async (req, res) => {
    // Agregando límite, si no se agrega el límite trae todo los productos, de traer el límite trae la cantidad indicada.
    let limitValue = parseInt(req.query.limit, 10) || 10;
    let page = parseInt(req.query.page, 10) || 1;
    let customQuery = req.query.query;
    if(!customQuery){
        customQuery = '';
    }else{
        customQuery = customQuery.toLowerCase();
    }
    let sort = parseInt(req.query.sort) || '';
    const products = await Products.findAll(customQuery,page,limitValue,sort);
    res.json({messages: products});
}) 



router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const prod = await Products.getById(pid);
    res.json({messages: prod});
});

router.post('/', async (req, res) => {
    const { title, description, category, price, thumbnail, code, stock } = req.body;
    const newProductInfo = { title, description, category, price, thumbnail, code, stock }
    const newProduct = await Products.insertOne(newProductInfo);
    res.json({message: newProduct});
});

router.put('/:pid', async (req, res) => {
    const item = req.body;
    const itemId = req.params.pid;
    const prod = await Products.update(item, itemId);
    res.json({message:prod});
})

router.delete('/:pid', async (req, res) => {
    const itemId = req.params.pid;
    const prod = await Products.deleteById(itemId);
    res.json({message:prod});
});





module.exports = router;
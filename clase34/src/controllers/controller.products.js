const {Router} = require('express');
//const authorizationMiddleware = require('../middleware/authorization.js');
const {isAdmin} = require('../middleware/authorization.js');
//const ProductsDao = require('../DAOs/dbManagers/ProductsDao');
const productsService = require('../services/service.products.js');
const ProductsDTO = require('../DTO/product.dto.js');
const { authToken, verifyJwt } = require('../utils/jwt.js');
//const Products = new ProductsDao();
const router = Router();

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
    const products = await productsService.findAll(customQuery,page,limitValue,sort);
    req.logger.info(products)
    res.json({messages: products});
}) 

router.get('/:pid', async (req, res) => {
    const user = req.params.user;
    const pid = req.params.pid;
    const prod = await productsService.getById(pid);
    req.logger.info(prod)
    res.json({messages: prod});
});

router.post('/', authToken, isAdmin, async (req, res) => {
    const { title, description, category, price, thumbnail, code, stock } = req.body;
    const lowerCategoryProduct = category.toLowerCase();
    const productRegister = { title, description, lowerCategoryProduct, price, thumbnail, code, stock }
    const newProductInfo = new ProductsDTO(productRegister);
    const newProduct = await productsService.insertOne(newProductInfo);
    req.logger.info(`The product has been created with ID: ${newProduct}`);
    res.json({message: newProduct});
});

router.put('/:pid', authToken, isAdmin, async (req, res) => {
    const productRegister = req.body;
    const itemId = req.params.pid;
    const newProductInfo = new ProductsDTO(productRegister);
    const prod = await productsService.update(newProductInfo, itemId);
    req.logger.info(prod)
    res.json({message:prod});
})

router.delete('/:pid', authToken, isAdmin, async (req, res) => {
    const itemId = req.params.pid;
    const prod = await productsService.deleteById(itemId);
    req.logger.info(prod)
    res.json({message:prod});
});


module.exports = router;
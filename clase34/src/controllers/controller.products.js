const {Router} = require('express');
const authorizationMiddleware = require('../middleware/authorization.js');
const ProductsDao = require('../DAOs/dbManagers/ProductsDao');

const Products = new ProductsDao();
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
    const products = await Products.findAll(customQuery,page,limitValue,sort);
    req.logger.info(products)
    res.json({messages: products});
}) 



router.get('/:pid', authorizationMiddleware.isUser , async (req, res) => {
    const user = req.params.user;
    const pid = req.params.pid;
    const prod = await Products.getById(pid);
    req.logger.info(prod)
    res.json({messages: prod});
});

router.post('/', async (req, res) => {
    const { title, description, category, price, thumbnail, code, stock } = req.body;
    const newProductInfo = { title, description, category, price, thumbnail, code, stock }
    const newProduct = await Products.insertOne(newProductInfo);
    req.logger.info(`The product has been created with ID: ${newProduct}`);
    res.json({message: newProduct});
});

router.put('/:pid', async (req, res) => {
    const item = req.body;
    const itemId = req.params.pid;
    const prod = await Products.update(item, itemId);
    req.logger.info(prod)
    res.json({message:prod});
})

router.delete('/:pid', async (req, res) => {
    const itemId = req.params.pid;
    const prod = await Products.deleteById(itemId);
    req.logger.info(prod)
    res.json({message:prod});
});





module.exports = router;
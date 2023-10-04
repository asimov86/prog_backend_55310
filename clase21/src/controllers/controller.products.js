const {Router} = require('express');
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
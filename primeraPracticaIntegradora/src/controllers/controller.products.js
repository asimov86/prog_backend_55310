const {Router} = require('express');
const ProductsDao = require('../DAOs/dbManagers/ProductsDao');

const Products = new ProductsDao();
const router = Router();



// Render

router.get('/realTimeProducts', async (req, res) => {
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
});

router.get('/home', async (req, res) => {
    const listProducts = await Products.findAll();
    console.log(listProducts);
    const stringifiedProducts = listProducts.map(product => ({
        ...product.toObject(),
        _id: product._id.toString()
    }));
    res.render('home.handlebars', { 
        listProducts: stringifiedProducts,
        listExists: true,});
});

// API
router.get('/', async (req, res) => {
    const products = await Products.findAll();
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
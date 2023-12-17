const {Router} = require('express');
//const authorizationMiddleware = require('../middleware/authorization.js');
const {isAdmin, isPremium} = require('../middleware/authorization.js');
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
    try {
        const { title, description, category, price, thumbnail, code, stock } = req.body;
        //req.logger.info(req)
        const lowerCategoryProduct = category.toLowerCase();
        const productRegister = { title, description, lowerCategoryProduct, price, thumbnail, code, stock }
        const newProductInfo = new ProductsDTO(productRegister);
        const newProduct = await productsService.insertOne(newProductInfo);
        req.logger.info(`The product has been created with ID: ${newProduct}`);
        res.json({message: newProduct});
    } catch (error) {
        if (error.code === 13003) {
            req.logger.error('Error: The product could not be inserted.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
    
});

    /* const user = req.session.user;
    //console.log(user);
    const item = req.body;
    //console.log(item);
    let owner =  user.id;
    //console.log(result);
    console.log(owner.toString());
    item['owner']=owner.toString();
    //console.log(item);
    const prod = await product.postProduct(item);
    if(prod.statusCode === 400){
        res.send({ status: (prod.statusCode), payload: prod });
        req.logger.log('error', `Error!: ${prod}: ${statusCode}`);
    }else{
       res.send({status:"success",payload:prod})
    }
 */


router.put('/:pid', authToken, isAdmin, async (req, res) => {
    const productRegister = req.body;
    const itemId = req.params.pid;
    const newProductInfo = new ProductsDTO(productRegister);
    const prod = await productsService.update(newProductInfo, itemId);
    req.logger.info(prod)
    res.json({message:prod});
})

router.delete('/:pid', authToken, isAdmin, isPremium, async (req, res) => {
    const itemId = req.params.pid;
    console.log(req.params.user)
    const prod = await productsService.deleteById(itemId);
    req.logger.info(prod)
    res.json({message:prod});
});


module.exports = router;
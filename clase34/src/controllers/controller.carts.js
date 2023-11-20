const {Router} = require('express');
const CartsDao = require('../DAOs/dbManagers/CartsDao');
const ticketsService = require('../services/service.tickets');
const logger = require('../utils/winston/prodLogger.winston');

const Carts = new CartsDao(logger);
const router = Router();

router.get('/:cid', async (req, res) => {
    let idC = req.params.cid;
    const cart = await Carts.getById(idC);
    res.json({message: cart});
})

router.post('/', async (req, res) => {
    const product = []; 
    const newCart = await Carts.createCart({product});
    req.logger.info(`Cart created.`, newCart);
    res.json({message: 'Cart creado con ID ' + newCart._id});
});

router.post('/:cid/products/:pid', async (req, res) => {
    let idC = req.params.cid;
    let idP = req.params.pid;
    const car = await Carts.post(idC, idP);
    req.logger.info(`Product ${idC} added to cart.`, car);
    res.json({ message : car});
});

router.put('/:cid', async(req, res) =>{
    let idC = req.params.cid;
    const items = req.body;
    const car = await Carts.putProduct(idC, items);
    req.logger.info(`Product ${idC} added to cart.`, car);
    res.json({ message : car});
});


router.put('/:cid/products/:pid', async(req, res) =>{
    let idC = req.params.cid;
    let idP = req.params.pid;
    const item = req.body;
    const car = await Carts.putProducts(idC, idP, item);
    req.logger.info(`Product ${idC} added to cart.`, car);
    res.json({ message : car});
});

router.delete('/:cid', async(req, res) =>{
    let idC = req.params.cid;
    const car = await Carts.deleteProducts(idC);
    res.json({ message : car});
});

router.delete('/:cid/products/:pid', async(req, res) =>{
    let idC = req.params.cid;
    let idP = req.params.pid;
    const car = await Carts.deleteProduct(idC, idP);
    req.logger.info(`Product ${idC} removed from cart.`, car);
    res.json({ message : car});
});

router.post('/:cid/purchase', async (req, res) => {
    let idC = req.params.cid;
    const ticket = await ticketsService.createTicket(idC);
    req.logger.info(`Purchase ticket created.`, ticket);
    res.json({ message : ticket});
});

module.exports = router;
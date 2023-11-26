const {Router} = require('express');
const CartsDao = require('../DAOs/dbManagers/CartsDao');
const ticketsService = require('../services/service.tickets');
const { verifyJwt } = require('../utils/jwt')
const { isUser } = require('../middleware/authorization');

const Carts = new CartsDao();
const router = Router();

router.get('/:cid', async (req, res) => {
    let idC = req.params.cid;
    const cart = await Carts.getCartById(idC);
    res.json({message: cart});
})

router.post('/', async (req, res) => {
    const product = []; 
    const newCart = await Carts.createCart({product});
    res.json({message: 'Cart creado con ID ' + newCart._id});
});

router.post('/:cid/products/:pid', verifyJwt, isUser, async (req, res) => {
    try {
        let idC = req.params.cid;
        console.log(idC);
        let idP = req.params.pid;
        const car = await Carts.addProductToCart(idC, idP);
        res.json({ message : car});
    } catch (error) {
        throw error;
    }
    l/* et idC = req.params.cid;
    console.log(idC);
    let idP = req.params.pid;
    const car = await Carts.addProductToCart(idC, idP);
    res.json({ message : car}); */
});

router.put('/:cid', verifyJwt, isUser, async(req, res) =>{

    let idC = req.params.cid;
    const items = req.body;
    const car = await Carts.putProduct(idC, items);
    res.json({ message : car});
});


router.put('/:cid/products/:pid', verifyJwt, isUser, async(req, res) =>{
    let idC = req.params.cid;
    let idP = req.params.pid;
    const item = req.body;
    const car = await Carts.putProducts(idC, idP, item);
    res.json({ message : car});
});

router.delete('/:cid', verifyJwt, isUser, async(req, res) =>{
    let idC = req.params.cid;
    const car = await Carts.deleteProducts(idC);
    res.json({ message : car});
});

router.delete('/:cid/products/:pid', verifyJwt, isUser, async(req, res) =>{
    let idC = req.params.cid;
    let idP = req.params.pid;
    const car = await Carts.deleteProduct(idC, idP);
    res.json({ message : car});
});

router.post('/:cid/purchase', verifyJwt, isUser, async (req, res) => {
    let idC = req.params.cid;
    const ticket = await ticketsService.createTicket(idC);
    res.json({ message : ticket});
});

module.exports = router;
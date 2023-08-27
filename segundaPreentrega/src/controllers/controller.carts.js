const {Router} = require('express');
const CartsDao = require('../DAOs/dbManagers/CartsDao');

const Carts = new CartsDao();
const router = Router();

router.get('/:cid', async (req, res) => {
    let idC = req.params.cid;
    const cart = await Carts.getById(idC);
    res.json({message: cart});
})

router.post('/', async (req, res) => {
    const product = []; 
    const newCart = await Carts.createCart({product});
    res.json({message: 'Cart creado con ID ' + newCart._id});
});

router.post('/:cid/products/:pid', async (req, res) => {
    let idC = req.params.cid;
    let idP = req.params.pid;
    const car = await Carts.post(idC, idP);
    res.json({ message : car});
});

module.exports = router;
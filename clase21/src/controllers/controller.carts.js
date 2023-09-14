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

router.put('/:cid', async(req, res) =>{
    let idC = req.params.cid;
        const items = req.body;
        const car = await Carts.putProduct(idC, items);
        res.json({ message : car});
});


router.put('/:cid/products/:pid', async(req, res) =>{
    let idC = req.params.cid;
    let idP = req.params.pid;
    const item = req.body;
    const car = await Carts.putProducts(idC, idP, item);
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
    res.json({ message : car});
});

module.exports = router;
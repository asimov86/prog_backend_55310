const { Router } = require('express');
const Messages = require('../DAOs/dbManagers/MessagesDao.js');

const message = new Messages();
const router  = Router();
router.get('/', async (req,res)=>{
    res.render('home.handlebars');
})

router.post('/', async (req,res)=>{
    const item = req.body;
    const mess =  await message.post(item);
    res.send({status:"success",payload:mess})
})
module.exports= router;
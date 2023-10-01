const {Router} = require('express');
const UsersDao = require('../DAOs/dbManagers/UsersDao');

const Users = new UsersDao();
const router = Router();

router.get('/create', (req, res) => {
    res.render('createUser.handlebars')
}) 

router.get('/', async (req, res) => {
    const users = await Users.findAll();
    res.json({messages: users});
}) 

router.get('/:uid', async (req, res) => {
    const uid = req.params.uid;
    const user = await Users.findById(uid);
    res.json({messages: user});
}) 

router.post('/', async (req, res) => {
    const {name, lastname, email, password} = req.body;
    const newUserInfo = {
        name,
        lastname,
        email,
        password,
        role
    } 
    const newUser = await Users.insertOne(newUserInfo);
    res.json({message: 'Usuario creado con ID ' + newUser._id});
});

module.exports = router;


//////////////   Este controller.user hasta ahora quedaría deprecado
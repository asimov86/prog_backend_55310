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

router.post('/', async (req, res) => {
    const {name, lastname, email, password} = req.body;
    const newUserInfo = {
        name,
        lastname,
        email,
        password
    } 
    const newUser = await Users.insertOne(newUserInfo);
    res.json({message: 'Usuario creado con ID ' + newUser._id});
});

module.exports = router;
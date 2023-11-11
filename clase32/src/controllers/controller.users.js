const {Router} = require('express');
const jwt = require('../utils/jwt');
const { generateToken, authToken, verifyJwt} = require('../utils/jwt')
const UsersDao = require('../DAOs/dbManagers/UsersDao');
const usersService = require('../services/service.users.js');
const generateUsers = require('../utils/mock');
const Users = new UsersDao();
const router = Router();

router.get('/mockuser', async (req, res) => {
    try {
        const {numUsers=1} = req.query;
        const users = generateUsers(numUsers);
        res.json({payload: users});
    } catch (error) {
        console.log(error)
        res.status(500).json({status:'error', error: error})
    }
});

router.get('/create', (req, res) => {
    try {
        res.render('register.handlebars')
    } catch (error) {
        console.log(error)
        res.json({ error: error})
    }
    
}) 

router.get('/', async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.json({messages: users});
    } catch (error) {
        console.log(error)
        res.json({ error: error})
    }
}) 

router.get('/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await usersService.getUserByID(uid);
        res.json({messages: user});
    } catch (error) {
        console.log(error)
        res.json({ error: error})
    }
    
}) 

/* router.post('/', async (req, res) => {
    const {name, lastname, email, password, cart} = req.body;
    const newUserInfo = {
        name,
        lastname,
        email,
        password,
        cart,
        role
    } 
    const newUser = await usersService.createUser(newUserInfo);
    res.json({message: 'Usuario creado con ID ' + newUser._id});
}); */

router.get('/confirm/:token', async (req, res) => {
    try {
        const authToken = req.params.token;
        //const id = req.user.userId;
        console.log(authToken);
        const confirmUser = await usersService.confirmToken(authToken);
        res.json({message: 'Usuario confirmado.'});
    // Acá podría verificar el campo modifiedCount para confirmar si fue modificado el campo "confirmed" en el usuario creado.
    } catch (error) {
        console.log(error)
        res.status(500).json({status:'error', error: error})
    }
    
});



module.exports = router;


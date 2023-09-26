const { Router } = require ("express");
const Users = require('../DAOs/models/user.model');
const { getHashedPassword, comparePassword } = require('../utils/bcrypt.js');
//const { generateToken } = require('../utils/jwt.js');
const passport = require('passport');
const { generateToken } = require("../utils/jwt");
const passportCall = require('../utils/passport-call');

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect:'/failRegister'}), async (req, res) => {
    try {      
        return res.status(201).json({message: 'User ' + req.user.email + ' successfully registered'});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }

});

router.get('/failRegister', (req, res) => {
    res.json({status: 'error', error: 'Failed to register'});
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await Users.findOne({email});
        if(!user) {
            return res.status( 400 ).json({status: 'error', error: 'Invalid credentials'});  
        }
        if (!comparePassword(password, user.password)) {
            return res.status( 400 ).json({status: 'error', error: 'Invalid credentials'});  
        }
        req.user = {
            id:user._id, 
            email:user.email, 
            name:user.name, 
            lastname:user.lastname, 
            role:user.role
        };
        const token = generateToken(user._id)
        //return res.json({status:'Success', message:'User logged in!', token});
        res
        .cookie('authCookie', token, { maxAge: 240000, httpOnly: true })
        .json({ status: 'success', payload: 'New session initialized' })

    } catch (error) {
        res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }
});

router.get('/faillogin', (req, res) => {
    res.json({status: 'error', error: 'Login failed'});
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(!err) {
            res.render('login', {mensaje: 'Sesión cerrada.'})
        }else{
            res.send({status: "No pudo cerrar sesion", body:err});
        } 
    });
})


router.get('/github', passport.authenticate('github', {scope: ['user:email']}, async(req, res)=>{}));

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res)=>{
    req.session.user = req.user;
    res.redirect('/api/views/products');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/googlecallback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect('/api/views/products');
  });

router.get('/current', passportCall('jwt'), (req,res)=>{
    const user = req.user;
    res.json({ user: user});
});

module.exports = router;
const { Router } = require ("express");
const Users = require('../DAOs/models/user.model');
const {comparePassword } = require('../utils/bcrypt.js');
const passport = require('passport');
const { generateToken } = require("../utils/jwt");
const passportCall = require('../utils/passport-call');

const router = Router();

router.post('/register', passport.authenticate('register', {session: false, failureRedirect:'/failRegister'}), async (req, res) => {
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
            role:user.role,
            picture:user.picture,
        };
        const token = generateToken(user._id)
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
        // Elimina el token JWT almacenado en el cliente (por ejemplo, borrando una cookie)
        res.clearCookie('authCookie');
        res.redirect('/login');
    });



router.get('/github', passport.authenticate('github', {scope: ['user:email']}, async(req, res)=>{}));

router.get('/githubcallback', passport.authenticate('github', {session: false, failureRedirect: '/login'}), async(req, res)=>{
    const user = req.user;
    const token = generateToken(user._id)
    res.cookie('authCookie', token, { maxAge: 240000, httpOnly: true });
    res.redirect('/api/views/products');
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/googlecallback', passport.authenticate('google', {session: false, failureRedirect: '/login' }), async (req, res) => {
    const user = req.user;
    const token = generateToken(user._id)
    res.cookie('authCookie', token, { maxAge: 240000, httpOnly: true });
    res.redirect('/api/views/products');
  });

router.get('/current', passportCall('jwt'), (req,res)=>{
    const user = req.user;
    return res.json({ user: user});
});

module.exports = router;
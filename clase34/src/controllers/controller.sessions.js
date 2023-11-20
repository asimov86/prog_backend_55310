const { Router } = require ("express");
const Users = require('../DAOs/models/mongo/user.model.js');
const {comparePassword } = require('../utils/bcrypt.js');
const passport = require('passport');
const { generateToken } = require("../utils/jwt");
const passportCall = require('../utils/passport-call');
const CustomErrors = require("../handlers/errors/CustomErrors.js");
const TYPES_ERRORS = require("../handlers/errors/types.errors.js");
const { generateUserErrorInfo, userLoginErrorInfo } = require("../handlers/errors/info.js");
const MESSAGES_ERRORS = require("../handlers/errors/messages.errors.js");
const EnumErrors = require("../handlers/errors/EnumError.js");


const router = Router();

router.post('/register', passport.authenticate('register', {session: false, failureRedirect:'/failRegister'}), async (req, res) => {
    try {      
        return res.status(201).json({message: 'User ' + req.user.email + ' successfully registered'});
    } catch (error) {
        req.logger.error(error);
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
        const emailUser = email.trim();

        
        if(user===null) {
            req.logger.debug('Invalid credentials.');
            req.logger.warning('Invalid credentials.');
            const err = new Error(`Bad request!`);
            err.code = 10001;
            
            //return res.status( 400 ).json({status: 'error', error: 'Invalid credentials'});
            /* CustomErrors.createError({
                name: TYPES_ERRORS.USER_LOGIN_ERROR,
                cause: userLoginErrorInfo(emailUser),
                message: MESSAGES_ERRORS.USER_LOGIN_MESSAGE,
                code: EnumErrors.LOGIN_ERROR
              })  */
            throw err;
        }
        if (!comparePassword(password, user.password)) {
            req.logger.warning('Invalid credentials.');
            return res.status( 400 ).json({status: 'error', error: 'Invalid credentials'});
             
           /*  CustomErrors.createError({
                name: TYPES_ERRORS.USER_LOGIN_ERROR,
                cause: userLoginErrorInfo(emailUser),
                message: MESSAGES_ERRORS.USER_LOGIN_MESSAGE,
                code: EnumErrors.LOGIN_ERROR
              })  */ 
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

    } catch (err) {

        if (err.code===10001){
           /*  req.logger.warning('Invalid credentials. Please try again.');
            req.logger.debug('Invalid credentials. Please try again.'); */
            return res.status( 400 ).json({status: 'error', error: err.message });
        }
        req.logger.debug('Nivel debug');
        //res.status(500).json({status: 'error', error: 'Internal Server Error'})
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



router.get('/github', passport.authenticate('github', {scope: ['user:email']}));

router.get('/githubcallback', passport.authenticate('github', {session: false, failureRedirect: '/login'}), async(req, res)=>{
    const user = req.user;
    if(req.user.confirmed===true) {
        const token = generateToken(user._id)
        res.cookie('authCookie', token, { maxAge: 240000, httpOnly: true });
        return res.redirect('/api/views/products');
    }
    return res.redirect('/api/views/login');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/googlecallback', passport.authenticate('google', {session: false, failureRedirect: '/login' }), async (req, res) => {
    const user = req.user;
    if(req.user.confirmed===true) {
        const token = generateToken(user._id)
        res.cookie('authCookie', token, { maxAge: 240000, httpOnly: true });
        return res.redirect('/api/views/products');
    }
    return res.redirect('/api/views/login');
  });

router.get('/current', passportCall('jwt'), (req,res)=>{
    const user = req.user;
    return res.json({ user: user});
});

module.exports = router;
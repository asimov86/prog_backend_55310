const {Router} = require('express');
const jwt = require('../utils/jwt');
const { getTokenData} = require('../utils/jwt')
//const UsersDao = require('../DAOs/dbManagers/UsersDao');
const usersService = require('../services/service.users.js');
const rolesService = require('../services/service.roles.js');
//const generateUsers = require('../utils/mock');
//const Users = new UsersDao();
const router = Router();

router.get('/mockuser', async (req, res) => {
    try {
        const {numUsers=1} = req.query;
        const users = generateUsers(numUsers);
        return res.json({payload: users});
    } catch (error) {
        req.logger.info(error)
        return res.status(500).json({status:'error', error: error})
    }
});

router.get('/create', (req, res) => {
    try {
        res.render('register.handlebars')
    } catch (error) {
        req.logger.info(error)
        return res.json({ error: error})
    }
    
}) 

router.get('/', async (req, res) => {
    try {
        const users = await usersService.getUsers();
        res.json({messages: users});
    } catch (error) {
        req.logger.info(error)
        return res.json({ error: error})
    }
}) 

router.get('/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await usersService.getUserByID(uid);
        return res.json({messages: user});
    } catch (error) {
        req.logger.info(error)
        return res.json({ error: error})
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
        const confirmUser = await usersService.confirmToken(authToken);
        res.json({message: 'Usuario confirmado.'});
    // Acá podría verificar el campo modifiedCount para confirmar si fue modificado el campo "confirmed" en el usuario creado.
    } catch (error) {
        req.logger.info('The user could not be confirmed.');
        return res.status(500).json({status:'error', error: error})
    }
    
});

router.get('/passwordChanged/:token', async (req, res) => {
    try {
        //obtener token
        console.log("Estoy acá")
        const { token} = req.params;
        let data = await getTokenData(token);
        console.log("Verified")
        console.log(data);
        //verificar la data
        if(data===null) {
          req.logger.log('error','Error al obtener data del token. Se redirigirá para volver a resetear la contraseña.');
          return res.redirect('/resetPassword');
        }
        // verificar si existe el usuario
        const { email, code } = data.user;
        let user = await usersService.getUserByEmail(email);
        if (!user) {
            return res.json({ 
                success: false,
                msg: 'Error al obtener data'
            });
        }
        // verificar el código
        console.log(user);
        //Redireccionar a la vista que permite resetear la contraseña
        req.logger.info(data);
        return res.redirect('/api/views/resetPasswordDos');
    } catch (error) {
      req.logger.error(error);
    }
  
  });

router.get("/premium/:uid", async (req, res) => {
    try {
        //Actualizamos usuario
        const uid  = req.params.uid;
        const user = await usersService.getUserByID(uid);
        /* if (!user){
            //const error = new Error(`Error!: El usuario no existe.`);
            //error.code = 14001; // Asignar un código al error
            throw error;
        } */
        // Vemos cual role tiene actualmente
        let currentRoleId = user.role;
        console.log(currentRoleId.toString());
        // Se lo pasamos a premium
        // Debo verificar cómo cambiarle al usuario que venga el role a premium?
        const role = await rolesService.getRoleByName('premium');
        const roleIdToString = role._id.toString();
        console.log(roleIdToString);
        if (currentRoleId === roleIdToString) {
            console.log('El usuario ya tiene el role premium.');
        }else{
            let newRole = {"role" : role._id.toString()};
            Object.assign(user, newRole);
            await usersService.updateUser(uid, user);
            return res.send({ status: "success", message: "El usuario ha cambiado de role." });
        }
    } catch (error) {

        console.log(error);
        if (error.code === 14001) {
            req.logger.error('Error: El usuario no existe.');
            return res.status(400).json({ status: 'error', code: error.code, message: error.message });
        }
        req.logger.error('Otro tipo de error:', error.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});


module.exports = router;
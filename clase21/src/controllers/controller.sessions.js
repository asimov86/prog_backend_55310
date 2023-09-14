const { Router } = require ("express");
const UsersDao = require('../DAOs/dbManagers/UsersDao');

const router = Router();
const Users = new UsersDao();

router.post('/register', async (req, res) => {
    try {
        const {name, lastname, email, password} = req.body;
        let role = 'user';
        if (!name || !lastname || !email || !password) {
            return res.status(404).send({status: 'error', error: 'Valores incompletos.'});
        }
        const exists = await Users.find(email);
        if(exists) {return res.status( 400 ).send({status: 'error', error: 'El usuario ya existe.'});}
        // Agregado de rol al crear usuario
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            role = 'admin';
        }
        const newUserInfo = {
            name,
            lastname,
            email,
            password,
            role
        };

        const newUser = await Users.insertOne(newUserInfo);
        //res.status(201).json({status: 'success', payload: newUser});
        res.json({message: 'Usuario creado con ID ' + newUser._id});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }

});

router.post('/login', async (req, res) => {
    try {
        const { email, password} = req.body;

        if (!email || !password) {
            return res.status(404).send({status: 'error', error: 'Valores incompletos.'});
        }
        const user = await Users.find(email);
            if(!user) {
                return res.status( 400 ).send({status: 'error', error: 'El usuario o la contraseña son invalidos.'});
            }else{
                if(user.password === password) {
                    if (user.role === 'admin'){ 
                        req.session.admin=true;
                    }
                    req.session.user = {id: user._id, email: user.email, name: user.name, lastname:user.lastname, role: user.role};
                    res.send({status:'Success', message:'Usuario logueado.'});
                // res.status(201).json({status: 'success', payload: result});
                }else{
                    console.log('Contraseña o usuario invalido')
                    return res.status( 400 ).send({status: 'error', error: 'El usuario o la contraseña son invalidos.'});         
                }
            }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'error', error: 'Internal Server Error'})
    }
    
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

module.exports = router;
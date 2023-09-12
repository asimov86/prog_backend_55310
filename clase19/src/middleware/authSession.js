// authSession.js
module.exports.authSession = (req, res, next) => {
    // Tu lógica de autenticación aquí
    if (req.session.user) {
      // Usuario autenticado
    
      console.log('Autenticado')
      console.log(req.session)
      return next();
    } else {
      // Usuario no autenticado, puedes redirigirlo o tomar otra acción.
      console.log("Usuario no autenticado");
      return res.redirect('/api/views/login');
    }
  };

  
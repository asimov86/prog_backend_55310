// authSession.js
module.exports.authSession = (req, res, next) => {
    // Tu lógica de autenticación aquí
    if (req.session.user) {
      // Usuario autenticado
      return next();
    } else {
      // Usuario no autenticado, puedes redirigirlo o tomar otra acción.
      return res.redirect('/login');
    }
  };
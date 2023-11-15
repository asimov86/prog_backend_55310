module.exports.authSession = (req, res, next) => {
    if (req.session.user) {
      console.log('Autenticado')
      console.log(req.session)
      return next();
    } else {
      console.log("Usuario no autenticado");
      return res.redirect('/api/views/login');
    }
  };

  
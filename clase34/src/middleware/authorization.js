const isAdmin = (req, res, next) => {
    // Verifica si el usuario es un administrador
    if (req.user && req.user.role === 'admin') {
      return next(); // Permitir acceso al siguiente middleware o controlador
    }
    return res.status(403).json({ error: 'Acceso denegado' });
  };
  
const isUser = (req, res, next) => {
    // Verifica si el usuario es un usuario regular
    if (req.user && req.user.role === 'user') {
      return next();
    }
    return next();
    //return res.status(403).json({ error: 'Acceso denegado' });
  };

const isPremium = (req, res, next) => {
    // Verifica si el usuario es un usuario premium
    if (req.user && req.user.role === 'premium') {
      return next();
    }
    return res.status(403).json({ error: 'Acceso denegado' });
  };
  
module.exports = { isAdmin, isUser, isPremium };
const roles = require('../services/service.roles');
const user = require('../services/service.users');

const isAdmin = async (req, res, next) => {
    // Verifica si el usuario es un administrador
  try {
    const userId = req.user.user;
    const userDetails = await user.getUserByID(userId);
    const roleId = userDetails.role;
    console.log(`Verified token. (Admin)`);
    const userRole = await roles.getRoleByID(roleId);
    if (userRole.roleName === 'admin') {
      return next(); // Permitir acceso al siguiente middleware o controlador
    }
    return res.status(403).json({ error: 'Acceso denegado' });
  } catch (error) {
    throw error;
  }
    
  };
  
const isUser = async (req, res, next) => {
    // Verifica si el usuario es un usuario regular
    let cid = req.params.cid;
    const userInfo = await user.getUserByCartId(cid); //;
    const userId = userInfo._id.toString();
    const roleId = userInfo.role;
    console.log(`Verified token. (user)`);
    const userRole = await roles.getRoleByID(roleId);
    if (userRole.roleName === 'user') {
      return next();
    }
    return res.status(403).json({ error: 'Acceso denegado' });
  };

const isPremium = async (req, res, next) => {
    // Verifica si el usuario es un usuario premium
    const userId = req.user.user;
    const userDetails = await user.getUserByID(userId);
    const roleId = userDetails.role;
    const userRole = await roles.getRoleByID(roleId);
    if (userRole.roleName === 'premium') {
      return next();
    }
    return res.status(403).json({ error: 'Acceso denegado' });
  };
  
module.exports = { isAdmin, isUser, isPremium };
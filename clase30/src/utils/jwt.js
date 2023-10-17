const jwt = require('jsonwebtoken')
const { SECRET_KEY_JWT } = require('../public/js/config');

const secretKey = SECRET_KEY_JWT;

const generateToken = user => {
  return jwt.sign({ user }, secretKey, { expiresIn: '1h' })
}

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  //console.log(authHeader)
  if (!authHeader)
    return res.status(401).json({ status: 'error', error: 'Unauthorized' })
  //console.log(authHeader)
  const token = authHeader.split(' ')[1]
  console.log(token)
  jwt.verify(token, secretKey, (error, credentials) => {
    if (error){
      return res.status(403).json({ status: 'error', error: 'Forbidden' })
    }
    req.user = credentials.user
    next()
  })
}

/* const verifyJwt = (token, req, res, next) => {

  console.log(token);
  jwt.verify(token, secretKey, (error, credentials) => {
    if (error){
      return res.status(403).json({ status: 'error', error: 'Forbidden' })
    }
    const user = credentials.user
    console.log(user)
    return res.status(200).json({ status: 'user verified', user: user })
  })
}
 */

const verifyJwt = (req, res, next) => {
  const token = req.params.token;
  console.log(token);
  jwt.verify(token, secretKey, (error, credentials) => {
    if (error) {
      return res.status(403).json({ status: 'error', error: 'Forbidden' });
    }
    req.user = credentials.user;
    console.log(req.user);
    next();
  });
}

module.exports = {
  generateToken,
  authToken,
  verifyJwt
}
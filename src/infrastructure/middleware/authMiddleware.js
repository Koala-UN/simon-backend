const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const UnauthorizedError = require('../../domain/exception/UnauthorizedError');

const authMiddleware = (req, res, next) => {
  
  if (!req.cookies || !req.cookies.token) {
    return res.status(401).json({ authenticated: false, message: 'Token no proporcionado' , user: {}});
  }
  const token = req.cookies.token;
  jwt.verify(token, config.auth.jwtSecret, (err, decoded) => {
    if (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Token no proporcionado', req.cookies);
      }
      return next(new UnauthorizedError('Token no válido'));
    }
    req.user = decoded;
    if (process.env.NODE_ENV === 'development') {
      //console.log('auth! :', req.user);
    }
    next();
  });
};

module.exports = authMiddleware;
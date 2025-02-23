const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Función para crear un JWT
const createJWT = (data) => {
  return jwt.sign({ ...data }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration });
};

// Función para crear una cookie
const createCookie = (res, name, value) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: false, // Permitir cookies en HTTP y HTTPS
    sameSite: 'None', // Permitir cookies en solicitudes cross-site
    maxAge: config.auth.jwtExpiration
  });
};

// Función para crear una cookie con JWT
const createJWTCookie = (res, data) => {
  const token = createJWT(data);
  createCookie(res, 'token', token);
};

// Función para verificar un JWT
const verifyJWT = (token) => {
  return jwt.verify(token, config.auth.jwtSecret);
};

module.exports = {
  createJWT,
  createCookie,
  createJWTCookie,
  verifyJWT
};
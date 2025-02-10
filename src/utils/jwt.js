const jwt = require('jsonwebtoken');
const config = require('../config/config');


// ayudame a crear una funcion que crea jwt, es para reutilizarla en el controlador de google
const createJWT = (data) => {
  return jwt.sign({ ...data }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration });
};

// Función para crear una cookie
const createCookie = (res, name, value) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction, // Solo seguro en producción
    sameSite: isProduction ? 'None' : 'Lax', // 'None' para producción, 'Lax' para desarrollo
    maxAge: config.auth.jwtExpiration
  });
};
const createJWTCookie = (res, data) => {
  const token = createJWT(data);
  createCookie(res, 'token', token);
};

// creame una funcion que acepte este caso: jwt.verify(token, config.auth.jwtSecret);
// y que retorne el objeto decodificado
const verifyJWT = (token) => {
  return jwt.verify(token, config.auth.jwtSecret);
};

module.exports = {
  createJWT,
  createCookie,
  createJWTCookie,
  verifyJWT
};
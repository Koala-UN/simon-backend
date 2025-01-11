const jwt = require('jsonwebtoken');
const config = require('../config/config');


// ayudame a crear una funcion que crea jwt, es para reutilizarla en el controlador de google
const createJWT = (data) => {
  return jwt.sign({ ...data }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration });
};const createCookie = (res, name, value) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
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
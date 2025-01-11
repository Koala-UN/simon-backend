const express = require('express');
const passport = require('passport');
const router = express.Router();

const restaurantController = require('../controllers/RestaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const authConfig = require('../../config/authConfig');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { auth } = require('../../config/config');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(auth.googleClientID);


// Rutas de restaurantes
router.post('/', restaurantController.createRestaurant);


router.get('/protected',authMiddleware, (req, res) => {
    console.log('Usuario autenticado y request en /protected:', req.user);
    res.json({ message: 'Esta es una ruta protegida', data: req.user });
});
// Ruta para verificar el estado de autenticación
router.get('/auth-status', authMiddleware, (req, res) => res.status(200).json({ authenticated: true, user: req.user }));

router.post('/auth/google/login', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    // Generar un JWT cookie
    JWT.createJWTCookie(res, { id: userid, correo: payload.email });
    res.status(200).json({ message: 'Inicio de sesión con Google exitoso' });
  } catch (error) {
    res.status(401).json({ message: 'Error en el inicio de sesión con Google', error });
  }
});


// Rutas de autenticación con Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), restaurantController.googleCallback);

// Ruta para cambiar la contraseña
router.post('/chg-password', authMiddleware, restaurantController.changePassword);

// Ruta para verificar si el usuario tiene una contraseña
router.post('/has-password', restaurantController.hasPassword);

// Ruta para recuperar la contraseña
router.post('/rec-password', restaurantController.recoverPassword);

router.get('/verify-email', restaurantController.verifyEmail);

router.get('/:restaurantId', restaurantController.getRestaurantById);
router.get('/', restaurantController.getAllRestaurants);

router.delete('/:restaurantId', restaurantController.deleteRestaurant); // Ruta para eliminar restaurante
router.patch('/:restaurantId', restaurantController.updateRestaurant); // Ruta para actualizar restaurante

router.post('/register', restaurantController.registerRestaurant);
router.post('/login', restaurantController.loginRestaurant);
router.post('/logout', restaurantController.logoutRestaurant);



// // Aplicar middleware de autenticación a todas las rutas siguientes
// router.use(authMiddleware);


module.exports = router;
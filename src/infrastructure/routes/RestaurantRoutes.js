const express = require('express');
const passport = require('passport');
const router = express.Router();
const restaurantController = require('../controllers/RestaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../../utils/ImgCloudinary');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// Rutas de restaurantes
router.post('/', restaurantController.createRestaurant);

router.get('/protected', authMiddleware, (req, res) => {
  console.log('Usuario autenticado y request en /protected:', req.user);
  res.json({ message: 'Esta es una ruta protegida', data: req.user });
});

function verifyToken(token) {
  jwt.verify(token, config.auth.jwtSecret, (err, decoded) => {
    return !decoded ? false : true;
  });
}

// Ruta para verificar el estado de autenticación
router.get('/auth-status', (req, res) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(200).json({ authenticated: false, user: {} });
  }
  const token = req.cookies.token;
  jwt.verify(token, config.auth.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(200).json({ authenticated: false, user: {} });
    }
    req.user = decoded;
    console.log('Usuario autenticado y request en /auth-status:', req.user);
    res.status(200).json({ authenticated: true, user: req.user });
  });
});

// Rutas de autenticación con Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), restaurantController.googleCallback);

// Ruta para cambiar la contraseña
router.post('/chg-password', authMiddleware, restaurantController.changePassword);

// Ruta para verificar si el usuario tiene una contraseña
router.post('/has-password', restaurantController.hasPassword);

// Ruta para recuperar la contraseña
router.post('/verify-email-send', restaurantController.verifyEmailSend);
router.get('/verify-email', restaurantController.verifyEmail);
router.post('/rec-password/', restaurantController.recoverPassword);

// Rutas para Imágenes
router.get('/:restaurantId/img', authMiddleware, restaurantController.getImages);
router.patch('/:restaurantId/images/:type', authMiddleware, restaurantController.updateMultipleImages);
router.post('/:restaurantId/images/:type', authMiddleware, upload.array('images', 10), restaurantController.uploadMultipleImages);
router.post('/:restaurantId/img/:type', upload.single('image'), restaurantController.uploadImage);
router.put('/:restaurantId/img/:imgUrl', upload.single('image'), restaurantController.updateImage);
router.delete('/:restaurantId/img/:imgId', restaurantController.deleteImage);

// Rutas para Restaurantes
router.get('/:restaurantId', restaurantController.getRestaurantById);
router.patch('/:restaurantId', upload.single('imageUrl'), restaurantController.updateRestaurant);
router.delete('/:restaurantId', restaurantController.deleteRestaurant);
router.get('/', restaurantController.getAllRestaurants);
router.post('/register', upload.single('fotoPerfil'), restaurantController.registerRestaurant);
router.post('/login', restaurantController.loginRestaurant);
router.post('/logout', restaurantController.logoutRestaurant);

module.exports = router;
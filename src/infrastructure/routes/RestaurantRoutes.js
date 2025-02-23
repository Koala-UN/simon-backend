const express = require('express');
const passport = require('passport');
const router = express.Router();
const restaurantController = require('../controllers/RestaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const {upload} = require('../../utils/ImgCloudinary');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
// Rutas de restaurantes
router.post('/', restaurantController.createRestaurant);


router.get('/protected',authMiddleware, (req, res) => {
  console.log('Usuario autenticado y request en /protected:', req.user);
  res.json({ message: 'Esta es una ruta protegida', data: req.user });
});

function verifyToken(token) {
  jwt.verify(token, config.auth.jwtSecret, (err, decoded) => {
    return !decoded? false : true;
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
const images = [
  { id: 1, url: "http://res.cloudinary.com/dnljvvheg/image/upload/v1740232194/landing-page-plate-2.jpg" },
  { id: 2, url: "http://res.cloudinary.com/dnljvvheg/image/upload/v1740232194/landing-page-plate-3.jpg" },
  { id: 3, url: "http://res.cloudinary.com/dnljvvheg/image/upload/v1740232194/landing-page-plate-1.jpg" },
  { id: 4, url: "http://res.cloudinary.com/dnljvvheg/image/upload/v1740232194/landing-page-plate-4.jpg" },
  { id: 5, url: "http://res.cloudinary.com/dnljvvheg/image/upload/v1740232194/landing-page-plate-5.jpg" },
];
// conseguir todas las imagenes de un restaurante
router.get('/:restaurantId/img', authMiddleware, restaurantController.getImages);

// actualizar múltiples imágenes
router.patch('/:restaurantId/images/:type', authMiddleware, restaurantController.updateMultipleImages);
// Subir múltiples imágenes
router.post('/:restaurantId/images/:type', authMiddleware, upload.array('images', 10), restaurantController.uploadMultipleImages);

// Obtener todas las imágenes de un restaurante
router.post('/:restaurantId/img/:type', upload.single('image'), restaurantController.uploadImage); // Subir una imagen

router.put('/:restaurantId/img/:imgUrl', upload.single('image'), restaurantController.updateImage); // Actualizar una imagen

router.delete('/:restaurantId/img/:imgId', restaurantController.deleteImage); // Borrar una imagen


// Rutas para Restaurantes
router.get('/:restaurantId', restaurantController.getRestaurantById); // Obtener un restaurante por ID
router.patch('/:restaurantId', upload.single('imageUrl'), restaurantController.updateRestaurant);
 // Actualizar un restaurante
router.delete('/:restaurantId', restaurantController.deleteRestaurant); // Eliminar un restaurante
router.get('/', restaurantController.getAllRestaurants); // Obtener todos los restaurantes

router.post('/register', upload.single('fotoPerfil'), restaurantController.registerRestaurant);
router.post('/login', restaurantController.loginRestaurant);
router.post('/logout', restaurantController.logoutRestaurant);



// // Aplicar middleware de autenticación a todas las rutas siguientes
// router.use(authMiddleware);


module.exports = router;
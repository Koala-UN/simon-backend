const express = require('express');
const dishController = require('../controllers/DishController');
const { upload } = require('../../utils/ImgCloudinary');
const router = express.Router();
const  authMiddleware  = require('../middleware/authMiddleware');
// Rutas de platillos
router.post('/',authMiddleware, upload.single('imageUrl'), dishController.createDish);
router.delete('/:dishId',authMiddleware, dishController.deleteDish);
router.get('/restaurant/:restauranteId', dishController.getAllDishesByRestaurant);
router.get('/:dishId', dishController.getDishById);
router.patch('/:dishId', authMiddleware, upload.single('imageUrl'), dishController.updateDish);


module.exports = router;
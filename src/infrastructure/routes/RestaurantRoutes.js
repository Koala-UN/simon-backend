const express = require('express');
const restaurantController = require('../controllers/RestaurantController');

const router = express.Router();

// Rutas de restaurantes
router.post('/', restaurantController.createRestaurant);
router.get('/:restaurantId', restaurantController.getRestaurantById);
router.get('/', restaurantController.getAllRestaurants);

router.delete('/:restaurantId', restaurantController.deleteRestaurant); // Ruta para eliminar restaurante
router.patch('/:restaurantId', restaurantController.updateRestaurant); // Ruta para actualizar restaurante


module.exports = router;
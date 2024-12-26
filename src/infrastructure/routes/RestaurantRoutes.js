const express = require('express');
const restaurantController = require('../controllers/RestaurantController');

const router = express.Router();

// Rutas de restaurantes
router.post('/', restaurantController.createRestaurant);

module.exports = router;
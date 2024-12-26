const express = require('express');
const restaurantController = require('../controllers/RestaurantController');

const router = express.Router();

// Rutas de restaurantes
router.post('/', restaurantController.createRestaurant);
router.get('/:restaurantId', restaurantController.getRestaurantById);
router.get('/city/:cityId', restaurantController.getAllRestaurantsByCity);
router.get('/department/:departmentId', restaurantController.getAllRestaurantsByDepartment);
router.get('/country/:countryId', restaurantController.getAllRestaurantsByCountry);

module.exports = router;
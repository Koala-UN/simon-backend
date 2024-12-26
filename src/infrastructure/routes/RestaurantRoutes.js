const express = require('express');
const restaurantController = require('../controllers/RestaurantController');

const router = express.Router();

// Rutas de restaurantes
router.post('/', restaurantController.createRestaurant);
router.get('/:restaurantId', restaurantController.getRestaurantById);
router.get('/ciudad/:cityId', restaurantController.getAllRestaurantsByCity);
router.get('/departamento/:departmentId', restaurantController.getAllRestaurantsByDepartment);
router.get('/pais/:countryId', restaurantController.getAllRestaurantsByCountry);

module.exports = router;
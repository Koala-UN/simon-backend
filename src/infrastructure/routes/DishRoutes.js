const express = require('express');
const dishController = require('../controllers/DishController');

const router = express.Router();

// Rutas de platillos
router.post('/', dishController.createDish);
router.delete('/:dishId', dishController.deleteDish);
router.get('/restaurant/:restauranteId', dishController.getAllDishesByRestaurant);
router.get('/:dishId', dishController.getDishById);
router.patch('/:dishId', dishController.updateDish);


module.exports = router;
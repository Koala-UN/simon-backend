const express = require('express');
const dishController = require('../controllers/DishController');

const router = express.Router();

// Rutas de platillos
router.post('/', dishController.createDish);

module.exports = router;
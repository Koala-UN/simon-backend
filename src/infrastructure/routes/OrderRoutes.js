// src/infrastructure/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/OrderController');

router.get('/', PedidoController.getAll);

module.exports = router;
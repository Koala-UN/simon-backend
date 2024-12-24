/**
 * @fileoverview Rutas para la gestión de pedidos en la aplicación.
 * @module routes/OrderRoutes
 */

const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/OrderController');

/**
 * Ruta para obtener todos los pedidos.
 * @name get/
 * @function
 * @memberof module:routes/OrderRoutes
 * @inner
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
router.get('/', PedidoController.getAllOrders);

/**
 * Ruta para actualizar el estado de un pedido.
 * @name patch/:id
 * @function
 * @memberof module:routes/OrderRoutes
 * @inner
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {string} req.params.id - ID del pedido a actualizar.
 */
router.patch('/:id', PedidoController.updateOrderStatus);

module.exports = router;
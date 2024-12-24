/**
 * @fileoverview Rutas para la gestión de pedidos en la aplicación.
 * @module routes/OrderRoutes
 */

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

/**
 * Ruta para obtener todos los pedidos.
 * @name get/
 * @function
 * @memberof module:routes/OrderRoutes
 * @inner
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
router.get("/", OrderController.getAllOrders);

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
router.patch("/:id", OrderController.updateOrderStatus);

/**
 * Ruta para crear un nuevo pedido.
 * @name post/
 * @function
 * @memberof module:routes/OrderRoutes
 * @inner
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 */
router.post("/", OrderController.createOrder);

/**
* Ruta para actualizar el estado de un platillo en un pedido.
* @name put/:pedidoId/platillo/:platilloId
* @function
* @memberof module:routes/OrderRoutes
* @inner
* @param {Request} req - Objeto de solicitud de Express.
* @param {Response} res - Objeto de respuesta de Express.
* @param {string} req.params.pedidoId - ID del pedido.
* @param {string} req.params.platilloId - ID del platillo a actualizar.
*/
router.put(
  "/:pedidoId/platillo/:platilloId",
  OrderController.updatePlatilloStatus
);
 /**
 * Ruta para obtener todos los platillos asociados a un pedido específico.
 * @name get/:id
 * @function
 * @memberof module:routes/OrderRoutes
 * @inner
 * @param {Request} req - Objeto de solicitud de Express.
 * @param {Response} res - Objeto de respuesta de Express.
 * @param {string} req.params.id - ID del pedido.
 */
// Nueva ruta para obtener todos los platillos asociados a un pedido específico
router.get("/:id", OrderController.getOrder);
module.exports = router;

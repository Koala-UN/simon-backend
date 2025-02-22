/**
 * @fileoverview Rutas para la gestión de pedidos en la aplicación.
 * @module routes/OrderRoutes
 */

const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

/**
 * Ruta para obtener todos los pedidos.
 * GET /
 */
router.get("/", OrderController.getAllOrders);

/**
 * Ruta para obtener todos los platillos asociados a un pedido específico.
 * GET /:id
 */
router.get("/:id", OrderController.getOrder);

/**
 * Ruta para actualizar el estado de un pedido.
 * PATCH /:id
 */
router.patch("/:id", OrderController.updateOrderStatus);

/**
 * Ruta para crear un nuevo pedido.
 * POST /
 */
router.post("/", OrderController.createOrder);

/**
 * Ruta para actualizar el estado de un platillo en un pedido.
 * PUT /:pedidoId/platillo/:platilloId
 */
router.put(
  "/:pedidoId/platillo/:platilloId",
  OrderController.updatePlatilloStatus
);

module.exports = router;
const OrderService = require("../../domain/service/OrderService");
const AppError = require("../../domain/exception/AppError");
const state = require("../../utils/state");
const NotFoundError = require("../../domain/exception/NotFoundError");

class OrderController {
  async getAllOrders(req, res, next) {
    try {
      const { restaurantId } = req.query;
      const orders = await OrderService.getAll(restaurantId);
      res.json(orders);
    } catch (error) {
      next(new AppError(`Failed to retrieve orders: ${error.message}`, 500));
    }
  }

  async getOrder(req, res, next) {
    try {
      const { id } = req.params;
      const orderDetails = await OrderService.getOrder(id);
      res.json(orderDetails);
    } catch (error) {
      next(
        new AppError(
          `Failed to retrieve order with ID ${req.params.id}: ${error.message}`,
          500
        )
      );
    }
  }

  async updatePlatilloStatus(req, res, next) {
    try {
      const { pedidoId, platilloId } = req.params;
      const { estado } = req.body;

      if (!pedidoId || !platilloId) {
        throw new AppError(
          "Parámetros inválidos: pedidoId o platilloId faltantes.",
          400
        );
      }
      if (!estado) {
        throw new AppError("El estado es obligatorio.", 400);
      }

      const result = await OrderService.updatePlatilloStatus(
        pedidoId,
        platilloId,
        estado
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const validStates = Object.values(state.Pedido);
      if (!validStates.includes(estado)) {
        throw new AppError(
          `Estado inválido. Estados permitidos: ${validStates.join(", ")}.`,
          400
        );
      }

      const result = await OrderService.updateOrderStatus(id, estado);
      if (!result) {
        throw new NotFoundError(`Pedido con ID ${id} no encontrado.`);
      }
      return res.status(200).json({
        message: "Estado del pedido actualizado exitosamente.",
        data: result,
      });
    } catch (error) {
      next(
        new AppError(
          error.message || "Error al actualizar el estado del pedido.",
          error.statusCode || 500
        )
      );
    }
  }

  async createOrder(req, res, next) {
    try {
      const { nombre_cliente, platillos } = req.body;
      if (!nombre_cliente) {
        throw new AppError("El nombre del cliente es obligatorio.", 400);
      }
      if (!platillos || !Array.isArray(platillos) || platillos.length === 0) {
        throw new AppError("El pedido debe incluir al menos un platillo.", 400);
      }
      const newOrder = await OrderService.createOrder(
        { nombre_cliente },
        platillos
      );
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }
  /**
   * Cancela un pedido completo o un platillo específico de un pedido
   * @param {Request} req - Request de Express
   * @param {Response} res - Response de Express
   * @param {NextFunction} next - Next function de Express
   */
  async cancelOrder(req, res, next) {
    try {
      const { pedidoId, platilloId } = req.params;

      if (!pedidoId) {
        throw new AppError("El ID del pedido es obligatorio.", 400);
      }

      const result = await OrderService.cancelOrder(
        parseInt(pedidoId),
        platilloId ? parseInt(platilloId) : null
      );

      res.status(200).json(result);
    } catch (error) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  }
}

module.exports = new OrderController();

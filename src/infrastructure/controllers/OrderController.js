const OrderService = require("../../domain/service/OrderService");
const AppError = require("../../domain/exception/AppError");
const state = require("../../utils/state");
const NotFoundError = require("../../domain/exception/NotFoundError");
/**
 * Clase que maneja las solicitudes HTTP relacionadas con los pedidos.
 */
class OrderController {
  /**
   * Recupera todos los pedidos.
   *
   * @param {Object} req - El objeto de solicitud.
   * @param {Object} res - El objeto de respuesta.
   * @param {Function} next - La función de middleware siguiente.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando los pedidos son recuperados y enviados en la respuesta.
   * @throws {AppError} - Lanza un error si no se pueden recuperar los pedidos.
   */
  async getAllOrders(req, res, next) {
    try {
      const { restaurantId } = req.query;
      const orders = await OrderService.getAll(restaurantId);
      res.json(orders);
    } catch (error) {
      next(new AppError(`Failed to retrieve orders: ${error.message}`, 500));
    }
  }

  /**
   * Obtiene todos los platillos asociados a un pedido específico.
   * @param {Object} req - El objeto de solicitud.
   * @param {Object} res - El objeto de respuesta.
   * @param {Function} next - La función de middleware siguiente.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando los platillos son recuperados y enviados en la respuesta.
   * @throws {AppError} - Lanza un error si no se pueden recuperar los platillos.
   */
  async getOrder(req, res, next) {
    try {
      const { id } = req.params;
      const orderDetails = await OrderService.getOrder(id);
      res.json(orderDetails);
    } catch (error) {
      next(
        new AppError(
          `Failed to retrieve order with ID ${id}: ${error.message}`,
          500
        )
      );
    }
  }
  /**
   * Controlador para actualizar el estado de un platillo en un pedido.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  async updatePlatilloStatus(req, res, next) {
    try {
      const { pedidoId, platilloId } = req.params;
      const { estado } = req.body;

      // Validar parámetros
      if (!pedidoId || !platilloId) {
        throw new AppError(
          "Parámetros inválidos: pedidoId o platilloId faltantes.",
          400
        );
      }
      if (!estado) {
        throw new AppError("El estado es obligatorio.", 400);
      }

      // Llamar al servicio
      const result = await OrderService.updatePlatilloStatus(
        pedidoId,
        platilloId,
        estado
      );

      // Enviar respuesta
      res.status(200).json(result);
    } catch (error) {
      next(error); // Manejo de errores
    }
  }
  /**
   * Actualiza el estado de un pedido.
   *
   * @async
   * @function updateOrderStatus
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} req.params - Parámetros de la solicitud.
   * @param {string} req.params.id - ID del pedido a actualizar.
   * @param {Object} req.body - Cuerpo de la solicitud HTTP.
   * @param {string} req.body.estado - Nuevo estado del pedido.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @param {Function} next - Middleware para manejar errores.
   * @returns {Promise<void>} Respuesta HTTP con un mensaje de éxito y los datos del pedido actualizado, o un error.
   * @throws {AppError|NotFoundError} Si ocurre un error durante la actualización del estado del pedido.
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      // Validar el estado recibido
      const validStates = Object.values(state.Pedido);
      if (!validStates.includes(estado)) {
        throw new AppError(
          `Estado inválido. Estados permitidos: ${validStates.join(", ")}.`,
          400
        );
      }

      // Llamar al servicio para procesar la lógica
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
  /**
   * Controlador para crear un nuevo pedido.
   *
   * Este método recibe los datos de la solicitud HTTP, valida y delega la creación
   * del pedido al servicio correspondiente. La respuesta incluye los detalles del
   * pedido recién creado.
   *
   * @param {Object} req - Objeto de la solicitud HTTP.
   *   - body: Contiene:
   *       - mesaId: ID de la mesa asociada al pedido.
   *       - platillos: Array de objetos que representan los platillos, cada uno con:
   *           - platilloId: ID del platillo (requerido).
   *           - cantidad: Cantidad del platillo (requerido).
   * @param {Object} res - Objeto de la respuesta HTTP.
   *   - status: Código HTTP que refleja el resultado de la operación.
   *   - json: Devuelve los datos del pedido creado.
   * @param {Function} next - Función para manejar errores.
   *
   * @returns {Promise<void>} - No devuelve un valor directamente, pero envía la respuesta HTTP.
   *
   * @throws {AppError} - Si ocurre un error, se delega al middleware de manejo de errores.
   */
  async createOrder(req, res, next) {
    try {
      const { mesaId, platillos } = req.body;

      // Validaciones y lógica de creación
      const newOrder = await OrderService.createOrder({ mesaId }, platillos);

      res.status(201).json(newOrder);
    } catch (error) {
      next(error); // Pasa el error al middleware `errorHandler`
    }
  }
}

module.exports = new OrderController();


const OrderService = require('../../domain/service/OrderService');
const AppError = require('../../domain/exception/AppError');
const state = require('../../utils/state');
const NotFoundError = require('../../domain/exception/NotFoundError')
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
    async getAllOrders(req, res,next) {
        try {
            const order = await OrderService.getAll();
            res.json(order);
        } catch (error) {
            next(new AppError(`Failed to retrieve orders: ${error.message}`, 500));
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
                    `Estado inválido. Estados permitidos: ${validStates.join(', ')}.`,
                    400
                );
            }

            // Llamar al servicio para procesar la lógica
            const result = await OrderService.updateOrderStatus(id, estado);

            if (!result) {
                throw new NotFoundError(`Pedido con ID ${id} no encontrado.`);
            }

            return res.status(200).json({
                message: 'Estado del pedido actualizado exitosamente.',
                data: result,
            });
        } catch (error) {
            next(
                new AppError(
                    error.message || 'Error al actualizar el estado del pedido.',
                    error.statusCode || 500
                )
            );
        }
    }
    
}

module.exports = new OrderController();
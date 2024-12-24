const OrderServiceInterface = require('../interfaces/order/ServiceInterface');
const OrderRepository = require('../../infrastructure/repositories/OrderRepository');
const Order = require('../models/OrderModel');
const NotFoundError = require('../../domain/exception/NotFoundError');
const state = require('../../utils/state')
class OrderService extends OrderServiceInterface {
    /**
     * Recupera todos los pedidos del repositorio.
     * 
     * @returns {Promise<Array<Order>>} Una promesa que se resuelve en un array de objetos Order.
     * @throws {NotFoundError} Si no se encuentran pedidos en el repositorio.
     */
    async getAll() {
        const rows = await OrderRepository.findAll();
        if (!rows || rows.length === 0) {
            throw new NotFoundError('No se encontraron pedidos.');
        }
        return rows.map(row => Order.fromDB(row));
    }

    /**
     * Actualiza el estado de un pedido.
     *
     * @param {string} id - El ID del pedido a actualizar.
     * @param {string} estado - El nuevo estado del pedido.
     * @throws {Error} Si el estado proporcionado no es válido.
     * @returns {Promise<Object>} El pedido actualizado.
     */
    async updateOrderStatus(id, estado) {
        // Validar el estado recibido usando el enum
        const validStates = Object.values(state.Pedido);
        if (!validStates.includes(estado)) {
            throw new Error(`Estado inválido. Estados permitidos: ${validStates.join(', ')}.`);
        }

        // Verificar si el pedido existe y actualizar el estado
        const updatedOrder = await OrderRepository.updateStatusById(id, estado);
        return updatedOrder;
    }
}


module.exports = new OrderService();
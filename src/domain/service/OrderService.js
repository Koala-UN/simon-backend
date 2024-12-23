const OrderServiceInterface = require('../interfaces/order/ServiceInterface');
const OrderRepository = require('../../infrastructure/repositories/OrderRepository');
const Order = require('../models/OrderModel');
const NotFoundError = require('../../domain/exception/NotFoundError');
class OrderService extends OrderServiceInterface {
    async getAll() {
        const rows = await OrderRepository.findAll();
        if (!rows || rows.length === 0) {
            throw new NotFoundError('No se encontraron pedidos.');
        }
        return rows.map(row => Order.fromDB(row));
    }
}


module.exports = new OrderService();
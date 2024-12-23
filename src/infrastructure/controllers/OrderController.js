
const OrderService = require('../../domain/service/OrderService');
const AppError = require('../../domain/exception/AppError');
class OrderController {
    async getAll(req, res,next) {
        try {
            const order = await OrderService.getAll();
            res.json(order);
        } catch (error) {
            next(new AppError(`Failed to retrieve orders: ${error.message}`, 500));
        }
    }
}

module.exports = new OrderController();
const ServiceInterface = require("../ServiceInterface");

class OrderServiceInterface extends ServiceInterface{
    async getAll(){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
    async createOrder(order){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
    async updateOrderStatus(orderId, status){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED')
    }

    async updateOrder(order){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async deleteOrder(order){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async getOrderById(orderId){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async getOrder(id){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }


}
module.exports = OrderServiceInterface;
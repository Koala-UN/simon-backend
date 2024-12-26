const ServiceInterface = require('../ServiceInterface')
class DishServiceInterface extends ServiceInterface{
    async createDish(dishData){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED')
    }
}
module.exports = DishServiceInterface;
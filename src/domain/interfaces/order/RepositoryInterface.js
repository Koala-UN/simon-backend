const RepositoryInterface = require('../RepositoryInterface');
class OrderRepositoryInterface extends RepositoryInterface {
    async create(order) {
        throw new Error('Method not implemented');
    }
    async findAll() {
        throw new Error('Method not implemented');
    }
}
module.exports = OrderRepositoryInterface
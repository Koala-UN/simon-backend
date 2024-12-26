

class RepositoryInterface {
    async findAll() {
        throw new Error('Method not implemented');
    }
    async create(object){
        throw new Error('Method not implemented')
    }
    async findById(id){
        throw new Error('Method not implemented')
    }
    
}

module.exports = RepositoryInterface;

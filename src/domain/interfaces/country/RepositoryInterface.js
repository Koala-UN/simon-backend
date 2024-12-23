
const RepositoryInterface = require('../RepositoryInterface');  
class CountryRepoInterface extends RepositoryInterface {
    async create(country) {
        throw new Error('Method not implemented');
    }
    async findAll() {
        throw new Error('Method not implemented');
    }
}

module.exports = CountryRepoInterface;

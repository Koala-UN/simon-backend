const RepositoryInterface = require("../RepositoryInterface");

class ReservationRepositoryInterface extends RepositoryInterface{

    /**
     * Retrieves all reservations.
     * 
     * @throws {Error} Throws an error if the method is not implemented.
     */
    findAll(){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
    async assignTable(reservationId, tableId){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
}
module.exports = ReservationRepositoryInterface;
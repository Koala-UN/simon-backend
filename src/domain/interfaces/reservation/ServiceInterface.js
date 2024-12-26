const ServiceInterface = require("../ServiceInterface");

class ReservationServiceInterface extends ServiceInterface
{
    async getAll(){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
    async createReservation(reservation){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async updateReservationStatus(reservationId, status){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED')
    }

    async updateReservation(reservation){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async deleteReservation(reservation){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async getReservationById(reservationId){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async getReservation(id){
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }


}
module.exports = ReservationServiceInterface;
const reservationService = require('../../domain/service/ReservationService');
const asyncHandler = require('../middleware/asyncHandler');
class ReservationController {
    /**
     * Maneja la solicitud GET /reservas.
     * @param {Object} req - Objeto de solicitud.
     * @param {Object} res - Objeto de respuesta.
     */
    getAllReservations = asyncHandler(async (req, res) => {
        const reservations = await reservationService.getAll();
        res.status(200).json({
            status: 'success',
            data: reservations,
        });
    });
}

module.exports = new ReservationController();



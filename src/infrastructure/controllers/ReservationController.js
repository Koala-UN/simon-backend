const reservationService = require("../../domain/service/ReservationService");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../../domain/exception/AppError");
class ReservationController {
  /**
   * Maneja la solicitud GET /reservas.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllReservations = asyncHandler(async (req, res) => {
    const reservations = await reservationService.getAll();
    res.status(200).json({
      status: "success",
      data: reservations,
    });
  });
  /**
   * Maneja la solicitud POST /reservas.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  createReservation = asyncHandler(async (req, res) => {
    const newReservation = await reservationService.createReservation(req.body);
    res.status(201).json({
      status: "success",
      data: newReservation,
    });
  });

  /**
   * Maneja la solicitud POST /reservas/:reservationId/mesa/:tableId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  assignTable = asyncHandler(async (req, res) => {
    const { reservationId, tableId } = req.params;
    await reservationService.assignTable(reservationId, tableId);
    res.status(200).json({
      status: "success",
      message: "Mesa asignada correctamente",
    });
  });

  /**
   * Maneja la solicitud POST /reservas/:reservationId/cancelar.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  cancelReservation = asyncHandler(async (req, res) => {
    const { reservationId } = req.params;
    await reservationService.cancelReservation(reservationId);
    res.status(200).json({
      status: "success",
      message: "Reserva cancelada correctamente",
    });
  });

  /**
   * Maneja la solicitud GET /reservas/restaurante/:restauranteId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllReservationsByRestaurant = asyncHandler(async (req, res) => {
    const { restauranteId } = req.params;
    if (!restauranteId) {
      throw new AppError('El ID del restaurante es requerido', 400);
    }
    const reservations = await reservationService.getAllByRestaurant(restauranteId);
    res.status(200).json({
      status: "success",
      data: reservations,
    });
  });
}

module.exports = new ReservationController();

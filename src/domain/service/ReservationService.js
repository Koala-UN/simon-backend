const reservationRepository = require("../../infrastructure/repositories/ReservationRepository");
const NotFoundError = require("../exception/NotFoundError");
const ReservationServiceInterface = require("../interfaces/reservation/ServiceInterface");
const state = require("../../utils/state"); // Importar el enum de estados

class ReservationService extends ReservationServiceInterface {
  /**
   * Lista todas las reservas.
   * @returns {Promise<Array>} Lista de reservas.
   */
  async getAll() {
    const reservations = await reservationRepository.findAll();
    if (!reservations || reservations.length === 0) {
      throw new NotFoundError("No se encontraron reservas");
    }

    // Transformación opcional: Agregar descripciones de estado
    return reservations.map((reservation) => ({
      ...reservation.toJSON(),
      stateMessage: this._getStateDescription(reservation.estado),
    }));
  }

  /**
   * Devuelve una descripción basada en el estado de la reserva.
   * @param {string} estado - Estado de la reserva.
   * @returns {string} Descripción del estado.
   * @private
   */
  _getStateDescription(estado) {
    const stateDescription = {
      [state.Reservas.PENDIENTE]: "PENDIENTE",
      [state.Reservas.RESERVADO]: "RESERVADO",
      [state.Reservas.CANCELADO]: "CANCELADO",
    };
    return stateDescription[estado] || "Estado desconocido.";
  }
}

module.exports = new ReservationService();

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

  /**
   * Crea una nueva reserva.
   * @param {Object} reservationData - Datos de la reserva.
   * @returns {Promise<Reservation>} La reserva creada.
   */
  async createReservation(reservationData) {
    try {
      // Validar los datos de la reserva
      this._validateReservationData(reservationData);

      // Crear la reserva en el repositorio
      const newReservation = await reservationRepository.create(
        reservationData
      );
      return newReservation.toJSON();
    } catch (error) {
      throw new AppError(`Error al crear la reserva: ${error.message}`, 500);
    }
  }

  /**
   * Valida los datos de la reserva.
   * @param {Object} reservationData - Datos de la reserva.
   * @throws {AppError} - Si los datos de la reserva no son válidos.
   */
  _validateReservationData(reservationData) {
    const requiredFields = [
      "fecha",
      "hora",
      "cantidad",
      "restauranteId",
      "nombre",
      "correo",
    ];
    requiredFields.forEach((field) => {
      if (!reservationData[field]) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }
}

module.exports = new ReservationService();

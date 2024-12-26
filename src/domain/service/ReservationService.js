const reservationRepository = require("../../infrastructure/repositories/ReservationRepository");
const NotFoundError = require("../exception/NotFoundError");
const ReservationServiceInterface = require("../interfaces/reservation/ServiceInterface");
const state = require("../../utils/state"); // Importar el enum de estados
const AppError = require("../exception/AppError");
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
  /**
   * Asigna una mesa a una reserva.
   * @param {number} reservationId - ID de la reserva.
   * @param {number} tableId - ID de la mesa.
   * @returns {Promise<void>}
   */
  async assignTable(reservationId, tableId) {
    try {
      await reservationRepository.assignTable(reservationId, tableId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw new AppError(`Error al asignar la mesa: ${error.message}`, 500);
    }
  }

  /**
   * Cancela una reserva.
   * @param {number} reservationId - ID de la reserva.
   * @returns {Promise<void>}
   */
  async cancelReservation(reservationId) {
    try {
      const reservation = await reservationRepository.findById(reservationId);
      if (!reservation) {
        throw new NotFoundError(
          `Reserva con ID ${reservationId} no encontrada`
        );
      }

      if (reservation.estado === state.Reservas.CANCELADO) {
        throw new AppError(
          `La reserva con ID ${reservationId} ya está cancelada`,
          400
        );
      }

      await reservationRepository.cancelReservation(
        reservationId,
        reservation.cantidad,
        reservation.restauranteId
      );
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Error al cancelar la reserva: ${error.message}`, 500);
    }
  }

  /**
   * Lista todas las reservas por restaurante.
   * @param {number} restauranteId - ID del restaurante.
   * @returns {Promise<Array>} Lista de reservas.
   */
  async getAllByRestaurant(restauranteId) {
    return await reservationRepository.findAllByRestaurant(restauranteId);
  }
}

module.exports = new ReservationService();

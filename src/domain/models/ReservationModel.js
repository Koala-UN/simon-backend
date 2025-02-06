const state = require("../../utils/state");

class Reservation {
  /**
   * Constructor para crear una instancia de Reservation.
   * @param {Object} data - Objeto con datos para inicializar la reserva.
   * @param {number} [data.id] - ID de la reserva.
   * @param {string} [data.fecha] - Fecha de la reserva (YYYY-MM-DD).
   * @param {string} [data.hora] - Hora de la reserva (HH:mm:ss).
   * @param {number} [data.cantidad] - Cantidad de personas.
   * @param {string} [data.estado] - Estado de la reserva (PENDIENTE, RESERVADO, CANCELADO).
   * @param {string} [data.nombre] - Nombre del cliente.
   * @param {string} [data.telefono] - Teléfono del cliente.
   * @param {string} [data.correo] - Correo electrónico del cliente.
   * @param {string} [data.cedula] - Cédula del cliente.
   * @param {string} [data.mesaEtiqueta] - Etiqueta de la mesa asignada (opcional).
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.fecha = data.fecha || null;
    this.hora = data.hora || null;
    this.cantidad = data.cantidad || null;
    this.estado = data.estado || state.Reservas.RESERVADO; // Valor por defecto: RESERVADO
    this.nombre = data.nombre || null;
    this.telefono = data.telefono || null;
    this.correo = data.correo || null;
    this.cedula = data.cedula || null;
    this.restauranteId = data.restauranteId || null; // Valor opcional
    this.mesaEtiqueta = data.mesaEtiqueta || null; // Valor opcional

    // Validaciones
    this._validateState();
    this._validateEmail();
  }

  /**
   * Valida el estado de la reserva.
   * @private
   */
  _validateState() {
    const validStates = Object.values(state.Reservas);
    if (!validStates.includes(this.estado)) {
      throw new Error(`Estado inválido para Reservation: ${this.estado}`);
    }
  }

  /**
   * Valida el formato del correo electrónico (si aplica).
   * @private
   */
  _validateEmail() {
    if (this.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo)) {
      throw new Error("Correo electrónico inválido");
    }
  }

  /**
   * Crea una instancia de Reservation a partir de datos provenientes de la base de datos.
   * @param {Object} data - Datos de la base de datos.
   * @returns {Reservation} Instancia de Reservation.
   */
  static fromDB(data) {
    return new Reservation({
      id: data.reserva_id,
      fecha: data.fecha,
      hora: data.hora,
      cantidad: data.cantidad,
      estado: data.estado,
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo,
      cedula: data.cedula,
      restauranteId: data.restaurante_id, // Agregado opcionalmente
      mesaEtiqueta: data.mesa_etiqueta || null, // Agregado opcionalmente
    });
  }

  /**
   * Convierte la instancia de Reservation a un objeto JSON.
   * @returns {Object} Representación JSON de la reserva.
   */
  toJSON() {
    return {
      id: this.id,
      fecha: this.fecha,
      hora: this.hora,
      cantidad: this.cantidad,
      estado: this.estado,
      nombre: this.nombre,
      telefono: this.telefono,
      correo: this.correo,
      cedula: this.cedula,
      restauranteId: this.restauranteId, // Incluido en el JSON
      mesaEtiqueta: this.mesaEtiqueta, // Incluido en el JSON
    };
  }
}

module.exports = Reservation;

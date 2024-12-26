const state = require("../../utils/state");

class Order {
  /**
   * Constructor para crear una instancia de Order.
   * @param {Object} data - Objeto con datos para inicializar el pedido.
   * @param {number} [data.id] - ID del pedido.
   * @param {string} [data.fecha] - Fecha del pedido (YYYY-MM-DD).
   * @param {string} [data.hora] - Hora del pedido (HH:mm:ss).
   * @param {number} [data.mesa_id] - ID de la mesa asociada al pedido.
   * @param {string} [data.estado] - Estado del pedido (ENTREGADO, PENDIENTE).
   * @param {number} [data.total] - Total del pedido.
   *
   * @example
   * const order = new Order({
   *   id: 1,
   *   fecha: "2024-12-25",
   *   hora: "18:00:00",
   *   mesa_id: 3,
   *   estado: "PENDIENTE",
   *   total: 50000,
   * });
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.fecha = data.fecha || null;
    this.hora = data.hora || null;
    this.mesaId = data.mesa_id || null;
    this.estado = data.estado || state.Pedido.PENDIENTE; // Valor por defecto
    this.total = data.total || null;

    // Validaciones
    this._validateState();
  }

  /**
   * Valida el estado del pedido.
   * @private
   */
  _validateState() {
    const validStates = Object.values(state.Pedido);
    if (!validStates.includes(this.estado)) {
      throw new Error(`Estado inválido para Order: ${this.estado}`);
    }
  }

  /**
   * Valida el formato de la fecha.
   * @private
   */
  _validateDate() {
    if (this.fecha && !/^\d{4}-\d{2}-\d{2}$/.test(this.fecha)) {
      throw new Error("Formato de fecha inválido (debe ser YYYY-MM-DD)");
    }
  }

  /**
   * Valida el total del pedido.
   * @private
   */
  _validateTotal() {
    if (this.total !== null && (typeof this.total !== "number" || this.total < 0)) {
      throw new Error("El total debe ser un número positivo.");
    }
  }

  /**
   * Crea una instancia de Order a partir de datos provenientes de la base de datos.
   * @param {Object} data - Datos de la base de datos.
   * @returns {Order} Instancia de Order.
   *
   * @example
   * const dbRow = {
   *   id: 1,
   *   fecha: "2024-12-25",
   *   hora: "18:00:00",
   *   mesa_id: 3,
   *   estado: "PENDIENTE",
   *   total: 50000,
   * };
   * const order = Order.fromDB(dbRow);
   */
  static fromDB(data) {
    return new Order(data);
  }

  /**
   * Convierte la instancia de Order a un objeto JSON.
   * @returns {Object} Representación JSON del pedido.
   *
   * @example
   * const json = order.toJSON();
   * console.log(json);
   * // {
   * //   id: 1,
   * //   fecha: "2024-12-25",
   * //   hora: "18:00:00",
   * //   mesaId: 3,
   * //   estado: "PENDIENTE",
   * //   total: 50000
   * // }
   */
  toJSON() {
    return {
      id: this.id,
      fecha: this.fecha,
      hora: this.hora,
      mesaId: this.mesaId,
      estado: this.estado,
      total: this.total,
    };
  }
}

module.exports = Order;

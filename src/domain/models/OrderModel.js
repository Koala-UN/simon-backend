const state = require("../../utils/state");

class Order {

  constructor(data = {}) {
    this.id = data.id || null;
    this.fecha = data.fecha || null;
    this.hora = data.hora || null;
    this.nombre_cliente = data.nombre_cliente|| null;
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


  static fromDB(data) {
    return new Order(data);
  }


  toJSON() {
    return {
      id: this.id,
      fecha: this.fecha,
      hora: this.hora,
      nombre_cliente: this.nombre_cliente,
      estado: this.estado,
      total: this.total,
    };
  }
}

module.exports = Order;

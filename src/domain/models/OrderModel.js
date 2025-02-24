const state = require("../../utils/state");

class Order {
  constructor(data = {}) {
    this.id = data.id || null;
    this.fecha = data.fecha || null;
    this.hora = data.hora || null;
    this.nombre_cliente = data.nombre_cliente || null;
    this.estado = data.estado || state.Pedido.PENDIENTE;
    this.total = data.total || null;
    // Nueva propiedad para los platillos asociados
    this.platillos = data.platillos || [];
    
    this._validateState();
  }

  _validateState() {
    const validStates = Object.values(state.Pedido);
    if (!validStates.includes(this.estado)) {
      throw new Error(`Estado inválido para Order: ${this.estado}`);
    }
  }

  static fromDB(data) {
    // Se espera que el repositorio agregue la propiedad 'platillos' al objeto
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
      platillos: this.platillos // Se incluye la info de platillos
    };
  }
}

module.exports = Order;
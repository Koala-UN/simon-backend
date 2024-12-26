const state = require("../../utils/state");
const Address = require("./AddressModel");

class Restaurant {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre = data.nombre || null;
    this.correo = data.correo || null;
    this.telefono = data.telefono || null;
    this.estado = data.estado || state.Restaurante.INACTIVO;
    this.idAtenticacion = data.idAtenticacion || null;
    this.idTransaccional = data.idTransaccional || null;
    this.capacidadReservas = data.capacidadReservas || null;
    this.direccionId = data.direccionId || null;
    this.address = data.address ? new Address(data.address) : null;
  }

  /**
   * Crea una instancia de Restaurant a partir de una fila de la base de datos.
   * @param {Object} row - Fila de la base de datos.
   * @returns {Restaurant} Instancia de Restaurant.
   */
  static fromDB(row) {
    return new Restaurant({
      id: row.id,
      nombre: row.nombre,
      correo: row.correo,
      telefono: row.telefono,
      estado: row.estado,
      idAtenticacion: row.id_atenticacion,
      idTransaccional: row.id_transaccional,
      capacidadReservas: row.capacidad_reservas,
      direccionId: row.direccion_id,
      address: row.address ? Address.fromDB(row.address) : null,
    });
  }

  /**
   * Convierte la instancia de Restaurant a un objeto JSON.
   * @returns {Object} Objeto JSON.
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      correo: this.correo,
      telefono: this.telefono,
      estado: this.estado,
      idAtenticacion: this.idAtenticacion,
      idTransaccional: this.idTransaccional,
      capacidadReservas: this.capacidadReservas,
      direccionId: this.direccionId,
      address: this.address ? this.address.toJSON() : null,
    };
  }
}

module.exports = Restaurant;
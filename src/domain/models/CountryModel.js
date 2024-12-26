const BaseModel = require("./BaseModel"); // Asegúrate de que la ruta es correcta

// src/models/Country.js
class Country extends BaseModel {
  constructor(data = {}) {
    super();
    this._id = data.id || null;
    this._nombre = data.nombre || null; // Cambiado de '' a null

    if (data.nombre) {
      this.nombre = data.nombre; // Usa el setter
    }
  }

  // Getters y Setters
  get id() {
    return this._id;
  }
  get nombre() {
    return this._nombre;
  }

  set nombre(value) {
    if (!value || typeof value !== "string") {
      throw new Error("Nombre debe ser una cadena no vacía");
    }
    this._nombre = value;
  }

  // Método de validación
  validate() {
    if (!this._nombre) {
      throw new Error("Nombre es requerido");
    }
    return true;
  }

  /**
   * Crea una instancia de Pais a partir de una fila de la base de datos.
   * @param {Object} row - Fila de la base de datos.
   * @returns {Pais} Instancia de Pais.
   */
  static fromDB(data) {
    return new Country(data);
  }

  /**
   * Convierte la instancia de Pais a un objeto JSON.
   * @returns {Object} Objeto JSON.
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
    };
  }
}

module.exports = Country;

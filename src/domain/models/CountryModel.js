const BaseModel = require('./BaseModel'); // Asegúrate de que la ruta es correcta

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
  get id() { return this._id; }
  get nombre() { return this._nombre; }

  set nombre(value) {
      if (!value || typeof value !== 'string') {
          throw new Error('Nombre debe ser una cadena no vacía');
      }
      this._nombre = value;
  }

  // Método de validación
  validate() {
      if (!this._nombre) {
          throw new Error('Nombre es requerido');
      }
      return true;
  }

  // Factory method
  static fromDB(data) {
      return new Country(data);
  }
}

module.exports = Country;
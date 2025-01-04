const AppError = require("../exception/AppError");
const ValidationError = require("../exception/ValidationError");
class Table {
  constructor({ data }) {
    this.id = data.id || null;
    this.capacidad = data.capacidad || null;
    this.etiqueta = data.etiqueta || null;
    this.restaurante_id = data.restaurante_id || null;
  }
  _validateData() {
    if (!this.etiqueta) {
      throw new AppError("la etiqueta es requerida", 404);
    } else if (!this.capacidad) {
      throw new AppError("la capacidad es requerida", 404);
    } else if (!this.restaurante_id) {
      throw new AppError("el id del restaurante es requerido", 404);
    }
  }
  _validateOnUpdate() {
    const errors = [];
    if(this.etiqueta ===null && this.capacidad===null && this.restaurante_id===null){
      errors.push('Suministra por lo menos algun parámetro')
    }
    if (this.etiqueta !== null && typeof this.etiqueta !== "string") {
      errors.push("La etiqueta debe ser una cadena de texto");
    }
    if (
      this.capacidad !== null &&
      (typeof this.capacidad !== "number" || this.capacidad <= 0)
    ) {
      errors.push("La capacidad debe ser un número positivo");
    }
    if (
      this.restaurante_id !== null &&
      (typeof this.restaurante_id !== "number" || this.restaurante_id <= 0)
    ) {
      errors.push("El ID del restaurante debe ser un número positivo");
    }
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }
  /**
   * Crea una instancia de mesa a partir de una fila de la base de datos.
   * @param {Object} row - Fila de la base de datos.
   * @returns {Table} Instancia de Table.
   */
  static fromDB(row) {
    return new Table({
      id: row.id,
      capacidad: row.capacidad,
      etiqueta: row.etiqueta,
      restaurante_id: row.restaurante_id,
    });
  }
  /**
   * Convierte la instancia de Table a un objeto JSON.
   * @returns {Object} Objeto JSON.
   */
  toJSON() {
    return {
      id: this.id,
      capacidad: this.capacidad,
      etiqueta: this.etiqueta,
      restaurante_id: this.restaurante_id,
    };
  }
}

module.exports = Table;

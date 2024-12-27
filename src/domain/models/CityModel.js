class City {
  constructor(data = {}) {
    this.id = data.id || null;
    this.departamentoId = data.departamentoId || null;
    this.nombre = data.nombre || null;
  }

  /**
   * Crea una instancia de Ciudad a partir de una fila de la base de datos.
   * @param {Object} row - Fila de la base de datos.
   * @returns {City} Instancia de Ciudad.
   */
  static fromDB(row) {
    return new City({
      id: row.id,
      departamentoId: row.departamento_id,
      nombre: row.nombre,
    });
  }

  /**
   * Convierte la instancia de Ciudad a un objeto JSON.
   * @returns {Object} Objeto JSON.
   */
  toJSON() {
    return {
      id: this.id,
      departamentoId: this.departamentoId,
      nombre: this.nombre,
    };
  }
}

module.exports = City;

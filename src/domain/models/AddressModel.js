class Address {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ciudadId = data.ciudadId || null;
    this.direccion = data.direccion || null;
    this.ciudadNombre = data.ciudadNombre || null;
    this.departamentoNombre = data.departamentoNombre || null;
    this.paisNombre = data.paisNombre || null;
  }

  /**
   * Crea una instancia de Direccion a partir de una fila de la base de datos.
   * @param {Object} row - Fila de la base de datos.
   * @returns {Address} Instancia de Direccion.
   */
  static fromDB(row) {
    return new Address({
      id: row.direccion_id,
      ciudadId: row.ciudad_id,
      direccion: row.direccion,
      ciudadNombre: row.ciudad_nombre,
      departamentoNombre: row.departamento_nombre,
      paisNombre: row.pais_nombre,
    });
  }

  /**
   * Convierte la instancia de Direccion a un objeto JSON.
   * @returns {Object} Objeto JSON.
   */
  toJSON() {
    return {
      id: this.id,
      ciudadId: this.ciudadId,
      direccion: this.direccion,
      ciudadNombre: this.ciudadNombre,
      departamentoNombre: this.departamentoNombre,
      paisNombre: this.paisNombre,
    };
  }
}

module.exports = Address;

class Departament {
    constructor(data = {}) {
      this.id = data.id || null;
      this.paisId = data.paisId || null;
      this.nombre = data.nombre || null;
    }
  
    /**
     * Crea una instancia de Departamento a partir de una fila de la base de datos.
     * @param {Object} row - Fila de la base de datos.
     * @returns {Departament} Instancia de Departamento.
     */
    static fromDB(row) {
      return new Departament({
        id: row.id,
        paisId: row.pais_id,
        nombre: row.nombre,
      });
    }
  
    /**
     * Convierte la instancia de Departamento a un objeto JSON.
     * @returns {Object} Objeto JSON.
     */
    toJSON() {
      return {
        id: this.id,
        paisId: this.paisId,
        nombre: this.nombre,
      };
    }
  }
  
  module.exports = Departament;
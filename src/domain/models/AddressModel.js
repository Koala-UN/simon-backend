const City = require("./CityModel");
const Department = require("./DepartmentModel");
const Country = require("./CountryModel");

class Address {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ciudadId = data.ciudadId || null;
    this.direccion = data.direccion || null;
    this.ciudad = data.ciudad ? new City(data.ciudad) : null;
    this.departamento = data.departamento ? new Department(data.departamento) : null;
    this.pais = data.pais ? new Country(data.pais) : null;
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
      ciudad: {
        id: row.ciudad_id,
        departamentoId: row.departamento_id,
        nombre: row.ciudad_nombre,
      },
      departamento: {
        id: row.departamento_id,
        paisId: row.pais_id,
        nombre: row.departamento_nombre,
      },
      pais: {
        id: row.pais_id,
        nombre: row.pais_nombre,
      },
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
      ciudad: this.ciudad ? this.ciudad.toJSON() : null,
      departamento: this.departamento ? this.departamento.toJSON() : null,
      pais: this.pais ? this.pais.toJSON() : null,
    };
  }
}

module.exports = Address;
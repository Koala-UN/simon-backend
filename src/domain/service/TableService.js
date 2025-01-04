const TableServiceInterface = require("../interfaces/table/ServiceInterface");
const TableRepository = require("../../infrastructure/repositories/TableRepository");
const Table = require("../models/TableModel");
class TableService extends TableServiceInterface {
  constructor() {
    super();
    this.tableRepository = new TableRepository();
  }
  /**
   * Crea una nueva mesa asociada a un restaurante.
   *
   * @async
   * @function createTable
   * @param {Object} tableData - Datos de la mesa a crear. Debe incluir información como:
   *   - `restaurantId` (Number): ID del restaurante al que pertenece la mesa.
   *   - `label` (String): etiqueta que identifica la mesa dentro del restaurante.
   *   - `capacity` (Number): Capacidad máxima de asientos de la mesa.
   *
   *
   * @returns {Promise<Object>} - Una promesa que resuelve con el objeto de la mesa creada, incluyendo los detalles almacenados en la base de datos.
   *
   * @throws {ValidationError} - Si los datos de entrada no cumplen con los requisitos de validación definidos en `_validateData()`.
   * @throws {Error} - Si ocurre un error durante la creación de la mesa en el repositorio.
   *
   */
  async createTable(tableData) {
    const table = new Table({ data: tableData });
    table._validateData();
    return await this.tableRepository.create(table);
  }
  async updateTable(id, tableData) {
    const table = new Table({ data: tableData });
    table._validateOnUpdate();
    return await this.tableRepository.update(id, tableData);
  }
}
module.exports = TableService;

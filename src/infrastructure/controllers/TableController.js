const TableService = require("../../domain/service/TableService");
const asyncHandler = require("../middleware/asyncHandler");
const ValidationError = require("../../domain/exception/ValidationError");

class TableController {
  constructor() {
    this.tableService = new TableService();
  }

  createTable = asyncHandler(async (req, res) => {
    const tableData = req.body;
    const table = await this.tableService.createTable(tableData);
    res.status(201).json(table);
  });
  updateTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const tableData = req.body;
    const updatedTable = await this.tableService.updateTable(id, tableData);
    res.status(200).json(updatedTable);
  });

  getTableById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const table = await this.tableService.getTableById(id);
    res.status(200).json(table);
  });

  getAllTables = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query; // Obtener el restaurante_id de los query params
    if (!restaurantId) {
      throw new ValidationError("El ID del restaurante es requerido");
    }
    const tables = await this.tableService.getAllTables(restaurantId);
    res.status(200).json(tables);
  });

  deleteTable = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.tableService.deleteTable(id);
    res.status(204).send(); // 204 No Content: Indica que la operación fue exitosa pero no hay contenido para devolver
  });
}

module.exports = TableController;

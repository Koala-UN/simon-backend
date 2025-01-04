const TableService = require("../../domain/service/TableService");
const asyncHandler = require("../middleware/asyncHandler");
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
}

module.exports = TableController;

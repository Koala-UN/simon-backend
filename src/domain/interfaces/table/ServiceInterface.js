const ServiceInterface = require("../ServiceInterface");
const Table = require("../../models/TableModel");
class TableServiceInterface extends ServiceInterface {
  createTable(table = new Table()) {
    throw new Error("Method not implemented");
  }
  updateTable() {
    throw new Error("Method not implemented");
  }
  async getTableById(id) {
    throw new Error("Method not implemented");
  }
  async getAllTables(restaurante_id) {
    throw new Error("Method not implemented");
  }
  async deleteTable(id) {
    throw new Error("Method not implemented");
  }
}
module.exports = TableServiceInterface;

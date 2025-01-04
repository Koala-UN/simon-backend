const ServiceInterface = require("../ServiceInterface");
const Table = require("../../models/TableModel");
class TableServiceInterface extends ServiceInterface {
  createTable(table = new Table) {
    throw new Error("Method not implemented");
  }
  updateTable() {
    throw new Error("Method not implemented");
  }
}
module.exports = TableServiceInterface;
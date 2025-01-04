const TableRepositoryInterface = require("../../domain/interfaces/RepositoryInterface");
const db = require("../../database/connection");

class TableRepository extends TableRepositoryInterface {
  async create(table) {
    const query =
      "INSERT INTO mesa (etiqueta, capacidad, restaurante_id) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [
      table.etiqueta,
      table.capacidad,
      table.restaurante_id,
    ]);
    return { ...table, id: result.insertId };
  }

  async update(id, tableData) {
    const setClauses = Object.keys(tableData)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(tableData);
    values.push(id);

    const query = `UPDATE mesa SET ${setClauses} WHERE id = ?`;
    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      throw new Error("Mesa no encontrada");
    }

    return { id, ...tableData };
  }
}
module.exports = TableRepository;

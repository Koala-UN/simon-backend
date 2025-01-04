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
  async findById(id) {
    const query = "SELECT * FROM mesa WHERE id = ?";
    const [rows] = await db.execute(query, [id]);
    if (rows.length === 0) {
      throw new Error("Mesa no encontrada");
    }
    return rows[0];
  }

  async findAll(restaurante_id) {
    const query = "SELECT * FROM mesa WHERE restaurante_id = ?";
    const [rows] = await db.execute(query, [restaurante_id]);
    return rows;
  }
  async delete(id) {
    const query = "DELETE FROM mesa WHERE id = ?";
    const [result] = await db.execute(query, [id]);
    if (result.affectedRows === 0) {
      throw new NotFoundError("Mesa no encontrada");
    }
    return true; // Indica que la mesa fue eliminada correctamente
  }
}
module.exports = TableRepository;

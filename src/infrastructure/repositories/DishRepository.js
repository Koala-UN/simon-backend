const db = require("../../database/connection");
const DishRepositoryInterface = require("../../domain/interfaces/dish/RepositoryInterface");
const Dish = require("../../domain/models/DishModel");

class DishRepository extends DishRepositoryInterface {
  /**
   * Crea un nuevo platillo.
   * @param {Object} dishData - Datos del platillo.
   * @returns {Promise<Dish>} El platillo creado.
   */
  async create(dishData) {
    const query = `
      INSERT INTO platillo (nombre, descripcion, precio, existencias, restaurante_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      dishData.nombre,
      dishData.descripcion,
      dishData.precio,
      dishData.existencias,
      dishData.restauranteId,
    ]);

    const newDish = new Dish({
      id: result.insertId,
      ...dishData,
    });

    return newDish;
  }

  /**
   * Elimina un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @returns {Promise<void>}
   */
  async delete(dishId) {
    const query = `DELETE FROM platillo WHERE id = ?`;
    await db.execute(query, [dishId]);
  }

  /**
   * Encuentra todos los platillos por restaurante.
   * @param {number} restauranteId - ID del restaurante.
   * @returns {Promise<Array<Dish>>} Lista de platillos.
   */
  async findAllByRestaurant(restauranteId) {
    const query = `
      SELECT id, nombre, descripcion, precio, existencias, restaurante_id
      FROM platillo
      WHERE restaurante_id = ?
    `;
    const [rows] = await db.execute(query, [restauranteId]);
    return rows.map((row) => Dish.fromDB(row));
  }

  /**
   * Encuentra un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @returns {Promise<Dish>} El platillo encontrado.
   */
  async findById(dishId) {
    const query = `SELECT id, nombre, descripcion, precio, existencias, restaurante_id FROM platillo WHERE id = ?`;
    const [rows] = await db.execute(query, [dishId]);
    if (rows.length === 0) {
      throw new AppError(`Platillo con ID ${dishId} no encontrado`, 404);
    }
    return Dish.fromDB(rows[0]);
  }

  /**
   * Actualiza un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @param {Object} dishData - Datos del platillo.
   * @returns {Promise<void>}
   */
  async update(dishId, dishData) {
    const fields = [];
    const values = [];

    if (dishData.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(dishData.nombre);
    }
    if (dishData.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(dishData.descripcion);
    }
    if (dishData.precio !== undefined) {
      fields.push("precio = ?");
      values.push(dishData.precio);
    }
    if (dishData.existencias !== undefined) {
      fields.push("existencias = ?");
      values.push(dishData.existencias);
    }
    if (dishData.restauranteId !== undefined) {
      fields.push("restaurante_id = ?");
      values.push(dishData.restauranteId);
    }

    if (fields.length === 0) {
      throw new AppError("No hay campos para actualizar", 400);
    }

    const query = `
    UPDATE platillo
    SET ${fields.join(", ")}
    WHERE id = ?
  `;
    await db.execute(query, [...values, dishId]);
  }
}

module.exports = new DishRepository();
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
}

module.exports = new DishRepository();
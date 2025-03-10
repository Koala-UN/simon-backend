const db = require("../../database/connection");
const DishRepositoryInterface = require("../../domain/interfaces/dish/RepositoryInterface");
const Dish = require("../../domain/models/DishModel");
const {getImgUrl} = require("../../utils/ImgCloudinary");
// AppError
const AppError = require("../../domain/exception/AppError");
class DishRepository extends DishRepositoryInterface {
  /**
   * Crea un nuevo platillo.
   * @param {Object} dishData - Datos del platillo.
   * @returns {Promise<Dish>} El platillo creado.
   */
  async create(dishData) {
    try {
      const query = `
        INSERT INTO platillo (nombre, descripcion, precio, existencias,categoria, restaurante_id, imageUrl)
        VALUES (?, ?, ?, ?, ?,?, ?)
      `;
      const finalData = [
        dishData.nombre,
        dishData.descripcion,
        dishData.precio,
        dishData.existencias,
        dishData.categoria,
        dishData.restauranteId,
        dishData.imageUrl || getImgUrl(dishData.categoria, "dish"),
      ];
      const [result] = await db.execute(query, finalData);

      const newDish = new Dish({
        id: result.insertId,
        ...dishData,
      });

      return newDish;
    } catch (error) {
      throw new AppError("Error al crear el platillo", 500, error);
    }
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
   * @param {string} category - Categoria del platillo.
   * @returns {Promise<Array<Dish>>} Lista de platillos.
   */
  async findAllByRestaurant(restauranteId, category) {
    let query = `
      SELECT id, nombre, descripcion, precio, existencias, categoria, restaurante_id, imageUrl 
      FROM platillo
      WHERE restaurante_id = ?
    `;
    const params = [restauranteId];

    if (category) {
      query += " AND categoria = ?";
      params.push(category);
    }

    const [rows] = await db.execute(query, params);
    // console.log("ROWS DE DISHES", rows);

    return rows.map(
      (row) =>
        new Dish({
          id: row.id,
          nombre: row.nombre,
          descripcion: row.descripcion,
          precio: row.precio,
          existencias: row.existencias,
          restauranteId: row.restaurante_id,
          categoria: row.categoria,
          imageUrl: row.imageUrl || getImgUrl(row.categoria, "dish"),
        })
    );
  }

  /**
   * Encuentra un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @returns {Promise<Dish>} El platillo encontrado.
   */
  async findById(dishId) {
    const query = `SELECT id, nombre, descripcion, precio, existencias,categoria, restaurante_id, imageUrl FROM platillo WHERE id = ?`;
    const [rows] = await db.execute(query, [dishId]);
    if (rows.length === 0) {
      throw new AppError(`Platillo con ID ${dishId} no encontrado`, 404);
    }

    const row = rows[0];

    return new Dish({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: row.precio,
      existencias: row.existencias,
      restauranteId: row.restaurante_id,
      categoria: row.categoria,
      imageUrl:  row.imageUrl || getImgUrl(row.categoria, "dish"),
    });
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
    if (dishData.categoria !== undefined) {
      fields.push("categoria = ?");
      values.push(dishData.categoria);
    }
    if (dishData.imageUrl !== undefined) {
      fields.push("imageUrl = ?");
      values.push(dishData.imageUrl);
    }
    if (fields.length === 0) {
      throw new AppError("No hay campos para actualizar", 400);
    }

    const query = `
    UPDATE platillo
    SET ${fields.join(", ")}
    WHERE id = ?
  `;
    const [rows] = await db.execute(query, [...values, dishId]);
    if (rows.affectedRows === 0) {
      throw new AppError(`Platillo con ID ${dishId} no encontrado`, 404);
    }

  }
}

module.exports = new DishRepository();

const dishRepository = require("../../infrastructure/repositories/DishRepository");
const AppError = require("../exception/AppError");
const DishServiceInterface = require("../interfaces/dish/ServiceInterface");

class DishService extends DishServiceInterface {
  /**
   * Crea un nuevo platillo.
   * @param {Object} dishData - Datos del platillo.
   * @returns {Promise<Dish>} El platillo creado.
   */
  async createDish(dishData) {
    // Validar los datos del platillo
    this._validateDishData(dishData);

    // Crear el platillo en el repositorio
    return await dishRepository.create(dishData);
  }

  /**
   * Valida los datos del platillo.
   * @param {Object} dishData - Datos del platillo.
   * @throws {AppError} - Si los datos del platillo no son válidos.
   */
  _validateDishData(dishData) {
    const requiredFields = [
      "nombre",
      "descripcion",
      "precio",
      "existencias",
      "restauranteId",
    ];
    requiredFields.forEach((field) => {
      if (!dishData[field]) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }

  /**
   * Elimina un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @returns {Promise<void>}
   */
  async deleteDish(dishId) {
    // Validar el ID del platillo
    if (!dishId) {
      throw new AppError("El ID del platillo es requerido", 400);
    }

    // Eliminar el platillo en el repositorio
    await dishRepository.delete(dishId);
  }

  /**
   * Lista todos los platillos por restaurante.
   * @param {number} restauranteId - ID del restaurante.
   * @returns {Promise<Array<Dish>>} Lista de platillos.
   */
  async getAllByRestaurant(restauranteId) {
    if (!restauranteId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }
    return await dishRepository.findAllByRestaurant(restauranteId);
  }

  /**
   * Encuentra un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @returns {Promise<Dish>} El platillo encontrado.
   */
  async getDishById(dishId) {
    if (!dishId) {
      throw new AppError("El ID del platillo es requerido", 400);
    }
    return await dishRepository.findById(dishId);
  }

  /**
   * Actualiza un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @param {Object} dishData - Datos del platillo.
   * @returns {Promise<void>}
   */
  async updateDish(dishId, dishData) {
    if (!dishId) {
      throw new AppError("El ID del platillo es requerido", 400);
    }

    // Validar los datos del platillo
    this._validateDishData(dishData);

    await dishRepository.update(dishId, dishData);
  }

  /**
   * Valida los datos del platillo.
   * @param {Object} dishData - Datos del platillo.
   * @throws {AppError} - Si los datos del platillo no son válidos.
   */
  _validateDishData(dishData) {
    const allowedFields = [
      "nombre",
      "descripcion",
      "precio",
      "existencias",
      "restauranteId",
    ];
    Object.keys(dishData).forEach((field) => {
      if (!allowedFields.includes(field)) {
        throw new AppError(`El campo ${field} no es permitido`, 400);
      }
    });
  }
}

module.exports = new DishService();

const dishRepository = require("../../infrastructure/repositories/DishRepository");
const AppError = require("../exception/AppError");
const DishServiceInterface = require("../interfaces/dish/ServiceInterface");

class DishService extends DishServiceInterface{
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
    const requiredFields = ["nombre", "descripcion", "precio", "existencias", "restauranteId"];
    requiredFields.forEach((field) => {
      if (!dishData[field]) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }
}

module.exports = new DishService();
const restaurantRepository = require("../../infrastructure/repositories/RestaurantRepository");
const AppError = require("../exception/AppError");
const RestaurantServiceInterface = require("../interfaces/restaurant/ServiceInterface");

class RestaurantService extends RestaurantServiceInterface {
  /**
   * Crea un nuevo restaurante con su dirección asociada.
   * @param {Object} restaurantData - Datos del restaurante.
   * @param {Object} addressData - Datos de la dirección.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Restaurant>} El restaurante creado.
   */
  async createRestaurant(restaurantData, addressData, cityId) {
    // Validar los datos del restaurante y la dirección
    this._validateRestaurantData(restaurantData);
    this._validateAddressData(addressData);

    return await restaurantRepository.create(
      restaurantData,
      addressData,
      cityId
    );
  }

  /**
   * Valida los datos del restaurante.
   * @param {Object} restaurantData - Datos del restaurante.
   * @throws {AppError} - Si los datos del restaurante no son válidos.
   */
  _validateRestaurantData(restaurantData) {
    const requiredFields = [
      "nombre",
      "correo",
      "telefono",
      "estado",
      "idAtenticacion",
      "idTransaccional",
      "capacidadReservas",
    ];
    requiredFields.forEach((field) => {
      if (!restaurantData[field]) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }

  /**
   * Valida los datos de la dirección.
   * @param {Object} addressData - Datos de la dirección.
   * @throws {AppError} - Si los datos de la dirección no son válidos.
   */
  _validateAddressData(addressData) {
    const requiredFields = ["direccion"];
    requiredFields.forEach((field) => {
      if (!addressData[field]) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }

  /**
   * Encuentra un restaurante por su ID.
   * @param {number} restaurantId - ID del restaurante.
   * @returns {Promise<Restaurant>} El restaurante encontrado.
   */
  async getRestaurantById(restaurantId) {
    if (!restaurantId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }
    return await restaurantRepository.findById(restaurantId);
  }

  /**
   * Encuentra todos los restaurantes por ciudad.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async getAllRestaurantsByCity(cityId) {
    if (!cityId) {
      throw new AppError("El ID de la ciudad es requerido", 400);
    }
    return await restaurantRepository.findAllByCity(cityId);
  }

  /**
   * Encuentra todos los restaurantes por departamento.
   * @param {number} departmentId - ID del departamento.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async getAllRestaurantsByDepartment(departmentId) {
    if (!departmentId) {
      throw new AppError("El ID del departamento es requerido", 400);
    }
    return await restaurantRepository.findAllByDepartment(departmentId);
  }

  /**
   * Encuentra todos los restaurantes por país.
   * @param {number} countryId - ID del país.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async getAllRestaurantsByCountry(countryId) {
    if (!countryId) {
      throw new AppError("El ID del país es requerido", 400);
    }
    return await restaurantRepository.findAllByCountry(countryId);
  }

  /**
   * Encuentra un restaurante por su ID.
   * @param {number} restaurantId - ID del restaurante.
   * @returns {Promise<Restaurant>} El restaurante encontrado.
   */
  async getRestaurantById(restaurantId) {
    if (!restaurantId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }
    return await restaurantRepository.findById(restaurantId);
  }

  /**
   * Encuentra todos los restaurantes por ciudad.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async getAllRestaurantsByCity(cityId) {
    if (!cityId) {
      throw new AppError("El ID de la ciudad es requerido", 400);
    }
    return await restaurantRepository.findAllByCity(cityId);
  }

  /**
   * Encuentra todos los restaurantes por departamento.
   * @param {number} departmentId - ID del departamento.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async getAllRestaurantsByDepartment(departmentId) {
    if (!departmentId) {
      throw new AppError("El ID del departamento es requerido", 400);
    }
    return await restaurantRepository.findAllByDepartment(departmentId);
  }

  /**
   * Encuentra todos los restaurantes por país.
   * @param {number} countryId - ID del país.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async getAllRestaurantsByCountry(countryId) {
    if (!countryId) {
      throw new AppError("El ID del país es requerido", 400);
    }
    return await restaurantRepository.findAllByCountry(countryId);
  }
}

module.exports = new RestaurantService();

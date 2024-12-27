const ServiceInterface = require("../ServiceInterface");

class RestaurantServiceInterface extends ServiceInterface {
  /**
   * Crea un nuevo restaurante.
   * @param {Object} restaurantData - Datos del restaurante.
   * @returns {Promise<Restaurant>} El restaurante creado.
   */
  async createRestaurant(restaurantData) {
    throw new Error("Method not implemented");
  }
  async getRestaurantById(restaurantId) {
    throw new Error("Method not implemented");
  }
  async getAllRestaurantsByCountry(countryId) {
    throw new Error("Method not implemented");
  }
  async getRestaurantById(restaurantId) {
    throw new Error("Method not implemented");
  }
  async getAllRestaurantsByCity(cityId) {
    throw new Error("Method not implemented");
  }
  async getAllRestaurantsByDepartment(departmentId) {
    throw new Error("Method not implemented");
  }

  async getAllRestaurantsByCountry(countryId) {
    throw new Error("Method not implemented");
  }

  async deleteRestaurant(restaurantId) {
    throw new Error("Method not implemented");
  }
  async updateRestaurant(restaurantId, updates) {
    throw new Error("Method not implemented");
  }
}
module.exports = RestaurantServiceInterface;

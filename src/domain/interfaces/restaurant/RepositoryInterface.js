const RepositoryInterface = require("../RepositoryInterface");

class RestaurantRepositoryInterface extends RepositoryInterface {
  async findAllByCity(cityId) {
    throw new Error("Method not implemented");
  }
  async findAllByDepartment(departmentId) {
    throw new Error("Method not implemented");
  }
  async findAllByCountry(countryId) {
    throw new Error("Method not implemented");
  }
  async deleteRestaurant(restaurantId) {
    throw new Error("Method not implemented");
  }
  async updateRestaurant(restaurantId, updates) {
    throw new Error("Method not implemented");
  }
}
module.exports = RestaurantRepositoryInterface;

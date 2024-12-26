const ServiceInterface = require("../ServiceInterface");

class RestaurantServiceInterface extends ServiceInterface{
    /**
     * Crea un nuevo restaurante.
     * @param {Object} restaurantData - Datos del restaurante.
     * @returns {Promise<Restaurant>} El restaurante creado.
     */
    async createRestaurant(restaurantData) {
        throw new Error("Method not implemented");
    }
}
module.exports = RestaurantServiceInterface;
const restaurantService = require("../../domain/service/RestaurantService");
const asyncHandler = require("../middleware/asyncHandler");

class RestaurantController {
  /**
   * Maneja la solicitud POST /restaurantes.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  createRestaurant = asyncHandler(async (req, res) => {
    const { restaurantData, addressData, cityId } = req.body;
    const newRestaurant = await restaurantService.createRestaurant(
      restaurantData,
      addressData,
      cityId
    );
    res.status(201).json({
      status: "success",
      data: newRestaurant.toJSON(),
    });
  });
}

module.exports = new RestaurantController();
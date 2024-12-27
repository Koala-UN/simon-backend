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
  /**
   * Maneja la solicitud GET /restaurantes/:restaurantId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getRestaurantById = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const restaurant = await restaurantService.getRestaurantById(restaurantId);
    res.status(200).json({
      status: "success",
      data: restaurant.toJSON(),
    });
  });

  /**
   * Maneja la solicitud GET /restaurantes/ciudad/:cityId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllRestaurantsByCity = asyncHandler(async (req, res) => {
    const { cityId } = req.params;
    const restaurants = await restaurantService.getAllRestaurantsByCity(cityId);
    res.status(200).json({
      status: "success",
      data: restaurants.map((restaurant) => restaurant.toJSON()),
    });
  });

  /**
   * Maneja la solicitud GET /restaurantes/departamento/:departmentId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllRestaurantsByDepartment = asyncHandler(async (req, res) => {
    const { departmentId } = req.params;
    const restaurants = await restaurantService.getAllRestaurantsByDepartment(
      departmentId
    );
    res.status(200).json({
      status: "success",
      data: restaurants.map((restaurant) => restaurant.toJSON()),
    });
  });

  /**
   * Maneja la solicitud GET /restaurantes/pais/:countryId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllRestaurantsByCountry = asyncHandler(async (req, res) => {
    const { countryId } = req.params;
    const restaurants = await restaurantService.getAllRestaurantsByCountry(
      countryId
    );
    res.status(200).json({
      status: "success",
      data: restaurants.map((restaurant) => restaurant.toJSON()),
    });
  });

  /**
   * Maneja la solicitud DELETE /restaurantes/:restaurantId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  deleteRestaurant = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    await restaurantService.deleteRestaurant(restaurantId);
    res.status(200).json({
      status: "success",
      message: "Restaurante eliminado correctamente",
    });
  });

  /**
   * Maneja la solicitud PATCH /restaurantes/:restaurantId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  updateRestaurant = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const updates = req.body;
    const updatedRestaurant = await restaurantService.updateRestaurant(
      restaurantId,
      updates
    );
    res.status(200).json({
      status: "success",
      data: updatedRestaurant.toJSON(),
    });
  });
}

module.exports = new RestaurantController();

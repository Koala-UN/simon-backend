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
   * Obtiene todos los restaurantes según los filtros proporcionados.
   *
   * @async
   * @function getAllRestaurants
   * @param {Object} req - Objeto de solicitud de Express.
   * @param {Object} req.query - Parámetros de consulta de la solicitud.
   * @param {string} req.query.countryId - ID del país para filtrar los restaurantes.
   * @param {string} req.query.departmentId - ID del departamento para filtrar los restaurantes.
   * @param {string} req.query.cityId - ID de la ciudad para filtrar los restaurantes.
   * @param {string} req.query.category - Categoría para filtrar los restaurantes.
   * @param {Object} res - Objeto de respuesta de Express.
   * @returns {Promise<void>} - Devuelve una promesa que resuelve en una respuesta JSON con el estado y los datos de los restaurantes.
   *
   * @description Este endpoint permite obtener una lista de todos los restaurantes que coinciden con los filtros especificados en los parámetros de consulta. Los filtros disponibles son countryId, departmentId, cityId y category.
   */
  getAllRestaurants = asyncHandler(async (req, res) => {
    const { countryId, departmentId, cityId, category } = req.query;
    const filters = {
      countryId,
      departmentId,
      cityId,
      category,
    };
    const restaurants = await restaurantService.getAll(filters);
    res.status(200).json({
      status: "success",
      data: restaurants.map((r) => r.toJSON()),
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

const dishService = require("../../domain/service/DishService");
const asyncHandler = require("../middleware/asyncHandler");

class DishController {
  /**
   * Maneja la solicitud POST /platillos.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  createDish = asyncHandler(async (req, res) => {
    const newDish = await dishService.createDish(req.body);
    res.status(201).json({
      status: "success",
      data: newDish.toJSON(),
    });
  });

  /**
   * Maneja la solicitud DELETE /platillos/:dishId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  deleteDish = asyncHandler(async (req, res) => {
    const { dishId } = req.params;
    await dishService.deleteDish(dishId);
    res.status(200).json({
      status: "success",
      message: "Platillo eliminado correctamente",
    });
  });

  /**
   * Maneja la solicitud GET /dish/restaurant/:restauranteId.
   * 
   * Maneja la solicitud GET /dish/restaurant/:restaurantId?category=postre.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getAllDishesByRestaurant = asyncHandler(async (req, res) => {
    const { restauranteId } = req.params;
    const { category } = req.query; // categoría opcional

    const dishes = await dishService.getAllByRestaurant(
      restauranteId,
      category
    );
    res.status(200).json({
      status: "success",
      data: dishes.map((dish) => dish.toJSON()),
    });
  });

  /**
   * Maneja la solicitud GET /platillos/:dishId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getDishById = asyncHandler(async (req, res) => {
    const { dishId } = req.params;
    const dish = await dishService.getDishById(dishId);
    res.status(200).json({
      status: "success",
      data: dish.toJSON(),
    });
  });

  /**
   * Maneja la solicitud PATCH /platillos/:dishId.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  updateDish = asyncHandler(async (req, res) => {
    const { dishId } = req.params;
    await dishService.updateDish(dishId, req.body);
    res.status(200).json({
      status: "success",
      message: "Platillo actualizado correctamente",
    });
  });
}

module.exports = new DishController();

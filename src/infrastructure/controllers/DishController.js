const dishService = require("../../domain/service/DishService");
const asyncHandler = require("../middleware/asyncHandler");

class DishController {
  /**
   * Maneja la solicitud POST /platillos.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  createDish = asyncHandler(async (req, res) => {
      console.log(req.body);
      const data = req.body;
      const img = req.file ? req.file : null; // La ruta del archivo subido o null si no hay archivo

      if (req.file) {
        data.imageUrl = img;
      }
      const newDish = await dishService.createDish(req.body);
      console.log(" NUEVO PLATILLO", newDish);
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
    const data = req.body;
    const img = req.file ? req.file : null; // La ruta del archivo subido o null si no hay archivo

    if (req.file) {
        data.imageUrl = img;
    }

    const updatedDish = await dishService.updateDish(dishId, data, req.user);
    res.status(200).json({
        status: "success",
        data: updatedDish.toJSON(),
    });
});
}

module.exports = new DishController();

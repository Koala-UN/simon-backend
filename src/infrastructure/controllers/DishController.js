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
}

module.exports = new DishController();
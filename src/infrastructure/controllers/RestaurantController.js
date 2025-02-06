const restaurantService = require("../../domain/service/RestaurantService");
const asyncHandler = require("../middleware/asyncHandler");
const JWT = require("../../utils/jwt");
class RestaurantController {
  /**
   * Maneja la solicitud POST /restaurantes.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  createRestaurant = asyncHandler(async (req, res) => {
    const { restaurantData, addressData, cityId,suscriptionData } = req.body;
    const newRestaurant = await restaurantService.createRestaurant(
      restaurantData,
      addressData,
      cityId,
      suscriptionData,
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


  /**
   * Maneja la solicitud POST /restaurantes/register.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  registerRestaurant = asyncHandler(async (req, res) => {
    const { restaurantData, addressData, cityId,suscriptionData } = req.body;
    restaurantData.addressData = addressData;
    restaurantData.cityId = cityId;
    restaurantData.suscriptionData = suscriptionData;
    const newRestaurant = await restaurantService.register(restaurantData, addressData, cityId,suscriptionData);
    res.status(201).json({
      status: "success",
      data: newRestaurant.toJSON(),
    });
  });

  /**
   * Maneja la solicitud POST /restaurantes/login.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  loginRestaurant = asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    if (!req.body.correo || !req.body.contrasena) {
      res.status(400).json({
        status: "error",
        message: "El correo electrónico y la contraseña son requeridos",
        data: req.body,
      });
    }
    const result = await restaurantService.login(req.body);
    JWT.createCookie(res,"token", result.token);
    res.status(200).json({
      status: "success",
    });
  });

  /**
   * Maneja la solicitud POST /restaurantes/logout.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  logoutRestaurant = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
      status: "success",
    }); 
  }
  );

  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;
    console.log('token=============: ', token);
    console.log("query", req.query);
  
    try {
      const decoded = JWT.verifyJWT(token);
      console.log('decoded=============: ', decoded);
      await restaurantService.verifyEmail(decoded.id);
      res.status(200).json({ status: 'success', message: 'Correo verificado exitosamente' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: 'Token de verificación no válido o expirado' });
    }
  });

  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { correo } = req.user;
    await restaurantService.changePassword(correo, oldPassword, newPassword);
    res.status(200).json({ status: 'success', message: 'Contraseña actualizada exitosamente' });
  });

  recoverPassword = asyncHandler(async (req, res) => {
    const { correo } = req.body;
    await restaurantService.recoverPassword(correo);
    res.status(200).json({ status: 'success', message: 'Correo de recuperación de contraseña enviado exitosamente' });
  });


// crear un nuevo método para verificar si el usuario tiene una contraseña: hasPassword

  hasPassword = asyncHandler(async (req, res) => {
    const { correo } = req.body;
    const hasPassword = await restaurantService.hasPassword(correo);
    res.status(200).json({ status: 'success', data: { hasPassword } });
  });

  googleCallback = asyncHandler(async (req, res) => {
    const { id, correo } = req.user;
    JWT.createJWTCookie(res, { id, correo });
    res.redirect(`${process.env.FRONTEND_URL}/`); // Redirigir al frontend usando la variable de entorno
  });
  
}

module.exports = new RestaurantController();

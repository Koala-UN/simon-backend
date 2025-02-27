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
    const { restaurantData, addressData, cityId, suscriptionData } = req.body;
    const newRestaurant = await restaurantService.createRestaurant(
      restaurantData,
      addressData,
      cityId,
      suscriptionData
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
    //console.log("restaurantId", restaurantId);
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
    try {
      await restaurantService.deleteRestaurant(restaurantId);
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "No se pudo eliminar el restaurante",
      });
    }

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
    const data = req.body;
    const img = req.file ? req.file : null; // La ruta del archivo subido o null si no hay archivo

    if (req.file) {
      data.imageUrl = img;
    }

    const updatedRestaurant = await restaurantService.updateRestaurant(
      restaurantId,
      data
    );

    // si se cambio el correo, nombre, o imagenUrl, se debe actualizar el token
    if (data.correo || data.nombre || data.imageUrl) {
      const userData = {
        id: updatedRestaurant.id,
        nombre: updatedRestaurant.nombre,
        correo: updatedRestaurant.correo,
        imageUrl: updatedRestaurant.imageUrl || null,
        sub: updatedRestaurant.suscripcion_id? true : false,
        ver: updatedRestaurant.estado !== 'NO_VERIFICADO' ? true : false,
      }
        JWT.createJWTCookie(res, userData);
    }

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
    // Parsear los datos JSON
    const restaurantData = JSON.parse(req.body.restaurantData);
    const addressData = JSON.parse(req.body.addressData);
    const cityId = req.body.cityId;
    const suscriptionData = JSON.parse(req.body.suscriptionData);

    // Añadir la ruta de la imagen al objeto restaurantData
    if (req.file) {
      restaurantData.fotoPerfil = req.file;
    }

    const {newRestaurant, token, user } = await restaurantService.register(restaurantData, addressData, cityId, suscriptionData);

    JWT.createCookie(res, "token", token);
    res.status(201).json({
      status: "success",
      data: { user: user, isAuthenticated: true },
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
    JWT.createCookie(res, "token", result.token);
    res.status(200).json({
      status: "success",
      data: { user: result.user, isAuthenticated: true },
    });
  });

  /**
   * Maneja la solicitud POST /restaurantes/logout.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  logoutRestaurant = asyncHandler(async (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, // Solo seguro en producción
      sameSite: 'None', // Permitir cookies en solicitudes cross-site
    });
    res.status(200).json({
      status: "success",
    });
  });
    });
  });

  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;
    console.log("token=============: ", token);
    console.log("query", req.query);

    try {
      const decoded = JWT.verifyJWT(token);
      console.log("decoded=============: ", decoded);
      await restaurantService.verifyEmail(decoded.id);
      res
        .status(200)
        .json({ status: "success", message: "Correo verificado exitosamente" });
    } catch (error) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Token de verificación no válido o expirado",
        });
    }
  });

  verifyEmailSend = asyncHandler(async (req, res) => {
    const { correo } = req.body;

    await restaurantService.verifyEmailSend(correo);
    res
      .status(200)
      .json({
        status: "success",
        message: "Correo de verificación enviado exitosamente",
      });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const { correo } = req.user;
    await restaurantService.changePassword(
      correo,
      currentPassword,
      newPassword
    );
    res
      .status(200)
      .json({
        status: "success",
        message: "Contraseña actualizada exitosamente",
      });
  });

  recoverPassword = asyncHandler(async (req, res) => {
    const { correo } = req.body;
    console.log(
      "por aquiiiiiiis--iii ** __--> req.body: ",
      req.body,
      "    correo: ",
      correo
    );
    await restaurantService.recoverPassword(correo);
    res
      .status(200)
      .json({
        status: "success",
        message: "Correo de recuperación de contraseña enviado exitosamente",
      });
  });

  // crear un nuevo método para verificar si el usuario tiene una contraseña: hasPassword

  hasPassword = asyncHandler(async (req, res) => {
    const { correo } = req.body;
    const hasPassword = await restaurantService.hasPassword(correo);
    res.status(200).json({ status: "success", data: { hasPassword } });
  });

  googleCallback = asyncHandler(async (req, res) => {
    if (!req.user) {
      res.redirect(`${process.env.FRONTEND_URL}/login`);
      return; // Este return es necesario para detener la ejecución del código
    }
  
    const { correo } = req.user;
    console.log('CALLBACK DE GOOGLE :   ', req.user);
    const restaurant = await restaurantService.findByEmail(correo);
  
    if (restaurant) {
      const { id,  nombre, correo, imageUrl } = restaurant;
      const tokenData = { id, nombre, correo, imageUrl, sub: restaurant.suscripcion_id ? true : false, ver: restaurant.estado !== 'NO_VERIFICADO' ? true : false };
      JWT.createJWTCookie(res, tokenData);
      res.redirect(`${process.env.FRONTEND_URL}/`);
    } else {
      // Redirige al usuario a la página de login si no se encuentra el restaurante
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  });

  uploadImage = asyncHandler(async (req, res) => {
    const { restaurantId, type } = req.params;
    const file = req.file;
    const imageUrl = await restaurantService.uploadImage(
      restaurantId,
      type,
      file
    );
    res.status(200).json({ status: "success", data: { imageUrl: imageUrl } });
  });

  // updateImage
  updateImage = asyncHandler(async (req, res) => {
    const { restaurantId, imgUrl } = req.params;
    const file = req.file;
    const imageUrl = await restaurantService.updateImage(
      restaurantId,
      imgUrl,
      file
    );
    res.status(200).json({ status: "success", data: { imageUrl } });
  });

  // deleteImage
  deleteImage = asyncHandler(async (req, res) => {
    const { restaurantId, imgId } = req.params;
    await restaurantService.deleteImageById(restaurantId, imgId);
    res
      .status(200)
      .json({ status: "success", message: "Imagen eliminada exitosamente" });
  });

  uploadMultipleImages = asyncHandler(async (req, res) => {
    const { restaurantId, type } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se han subido imágenes." });
    }

    console.log("YA LLEGAMOS files: ", files);
    console.log(
      "imprimendo de todo un poco",
      req.user,
      type,
      files,
      restaurantId
    );

    try {
      console.log("subiendo imagenes");
      const imageUrls = await restaurantService.uploadMultipleImages(
        restaurantId,
        type,
        files
      );
      console.log("se subieron --> imageUrls: ", imageUrls);
      res.status(200).json(imageUrls);
    } catch (error) {
      console.error("Error al subir las imágenes:", error);
      res.status(500).json({ message: "Error al subir las imágenes.", error });
    }
  });
  updateMultipleImages = asyncHandler(async (req, res) => {
    console.log("updateMultipleImages YA LLEGAMOS");
    const { restaurantId, type } = req.params;
    const files = req.body.images; // Extraer las URLs de las imágenes del cuerpo de la solicitud
    console.log(
      "2 -- updateMultipleImages YA LLEGAMOS : ",
      req.body,
      files,
      restaurantId,
      type
    );

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se han subido imágenes." });
    }

    console.log("updateMultipleImages YA LLEGAMOS files: ", files);
    console.log(
      "updateMultipleImages --imprimendo de todo un poco",
      req.user,
      type,
      files,
      restaurantId
    );

    try {
      console.log("subiendo imagenes");
      const imageUrls = await restaurantService.updateMultipleImages(
        restaurantId,
        type,
        files
      );
      console.log("se subieron --> imageUrls: ", imageUrls);
      res.status(200).json(imageUrls);
    } catch (error) {
      console.error("Error al subir las imágenes:", error);
      res.status(500).json({ message: "Error al subir las imágenes.", error });
    }
  });

  // getImages
  getImages = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const images = await restaurantService.getImages(restaurantId);

    const formattedImages = images.map((img, index) => {
      return { id: index + 1, url: img };
    });

    res.status(200).json(formattedImages);
  });

  getUserStatus = asyncHandler(async (req, res) => {
    const user = await restaurantService.getAuthUser(user.id);
    return user;
  });
  // ...existing code...

  /**
   * Actualiza la suscripción de un restaurante.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  updateSuscription = asyncHandler(async (req, res) => {
    const { restaurantId } = req.params;
    const { tipo } = req.body;

    if (!tipo || (tipo !== "MENSUAL" && tipo !== "ANUAL")) {
      return res.status(400).json({
        status: "error",
        message: "El tipo de suscripción debe ser 'MENSUAL' o 'ANUAL'",
      });
    }

    const updatedRestaurant = await restaurantService.updateSuscription(
      restaurantId,
      tipo
    );

    res.status(200).json({
      status: "success",
      data: updatedRestaurant.toJSON(),
    });
  });
}

module.exports = new RestaurantController();

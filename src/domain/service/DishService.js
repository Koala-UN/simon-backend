const dishRepository = require("../../infrastructure/repositories/DishRepository");
const AppError = require("../exception/AppError");
const DishServiceInterface = require("../interfaces/dish/ServiceInterface");
const { uploadImg, deleteImgsByEmailAndType, deleteImgByUrl } = require("../../utils/ImgCloudinary");
const Dish = require("../models/DishModel");
class DishService extends DishServiceInterface {
  /**
   * Crea un nuevo platillo.
   * @param {Object} dishData - Datos del platillo.
   * @returns {Promise<Dish>} El platillo creado.
   */
  async createDish(dishData) {
    // Validar los datos del platillo
    console.log("este es el dishDATA:  ", dishData);
    this._validateDishData(dishData);
    console.log("datos validados");

    let imageUrlUploaded = false;
    let imgUrl = null;
    try {
      // Subir imagen si existe
      if (dishData.imageUrl) {
        imgUrl = await uploadImg(dishData.nombre, "dish", dishData.imageUrl);
        dishData.imageUrl = imgUrl;
        console.log("imagen subida: ", imgUrl);
        imageUrlUploaded = true;
      } else {
        dishData.imageUrl = null;
      }

      // Crear el platillo en el repositorio
      console.log("creando platillo");
      return await dishRepository.create(dishData);
    } catch (error) {
      console.log("error al crear platillo: ", error);
      if (imageUrlUploaded) {
        await deleteImgByUrl(imgUrl);
      }
      throw error;
    }
  }

  // /**
  //  * Valida los datos del platillo.
  //  * @param {Object} dishData - Datos del platillo.
  //  * @throws {AppError} - Si los datos del platillo no son válidos.
  //  */
  // _validateDishData(dishData) {
  //   const requiredFields = [
  //     "nombre",
  //     "descripcion",
  //     "precio",
  //     "existencias",
  //     "restauranteId",
  //   ];
  
  //   requiredFields.forEach((field) => {
  //     if (!dishData[field]) {
  //       console.log("campo requerido: ", field);  
  //       throw new AppError(`El campo ${field} es obligatorio`, 400);
  //     }
  //   });
  //   // Allow imageUrl to be empty or non-existent
  //   if (dishData.imageUrl === undefined || dishData.imageUrl === "") {
  //     console.log("campo imageUrl es opcional");
  //     dishData.imageUrl = null;
  //   }
  // }

  /**
   * Elimina un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @returns {Promise<void>}
   */
  async deleteDish(dishId) {
    // Validar el ID del platillo
    if (!dishId) {
      throw new AppError("El ID del platillo es requerido", 400);
    }

    // Eliminar el platillo en el repositorio
    console.log("eliminando platillo: ", dishId);
    await dishRepository.delete(dishId);
  }

  /**
   * Lista todos los platillos por restaurante.
   * @param {number} restauranteId - ID del restaurante.
   * @param {string} category - Categoria del platillo.
   * @returns {Promise<Array<Dish>>} Lista de platillos.
   */
  async getAllByRestaurant(restauranteId,category) {
    if (!restauranteId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }
    return await dishRepository.findAllByRestaurant(restauranteId,category);
  }

  /**
   * Encuentra un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @returns {Promise<Dish>} El platillo encontrado.
   */
  async getDishById(dishId) {
    if (!dishId) {
      throw new AppError("El ID del platillo es requerido", 400);
    }
    return await dishRepository.findById(dishId);
  }

  /**
   * Actualiza un platillo por su ID.
   * @param {number} dishId - ID del platillo.
   * @param {Object} dishData - Datos del platillo.
   * @returns {Promise<void>}
   */
  async updateDish(dishId, dishData, user) {
    if (!dishId) {
      throw new AppError("El ID del platillo es requerido", 400);
    }

    // Validar los datos del platillo
    this._validateDishData(dishData);

    let imageUrlUploaded = false;
    let imgUrl = null;
    let oldImgUrl = null;

    try {
      // Obtener la URL de la imagen antigua
      const existingDish = await dishRepository.findById(dishId);
      oldImgUrl = existingDish.imageUrl;

      // Subir nueva imagen si existe
      if (dishData.imageUrl) {
        imgUrl = await uploadImg(user.correo, "dish", dishData.imageUrl);
        dishData.imageUrl = imgUrl;
        imageUrlUploaded = true;
      }

      // Actualizar el platillo en el repositorio
      await dishRepository.update(dishId, dishData);
      // Eliminar la imagen antigua si se subió una nueva
      if (imageUrlUploaded && oldImgUrl) {
        await deleteImgByUrl(oldImgUrl);
      }
      return new Dish({ id: dishId, ...dishData });
    } catch (error) {
      if (imageUrlUploaded) {
        await deleteImgByUrl(imgUrl);
      }
      throw error;
    }
  }

  /**
   * Valida los datos del platillo.
   * @param {Object} dishData - Datos del platillo.
   * @throws {AppError} - Si los datos del platillo no son válidos.
   */
  _validateDishData(dishData) {
    const allowedFields = [
      "nombre",
      "descripcion",
      "precio",
      "existencias",
      "categoria",
      "restauranteId",
      "imageUrl",
    ];
    Object.keys(dishData).forEach((field) => {
      if (!allowedFields.includes(field)) {
        throw new AppError(`El campo ${field} no es permitido`, 400);
      }
    });
    
  }
}

module.exports = new DishService();

const RestaurantRepository = require("../../infrastructure/repositories/RestaurantRepository");
const category = require("../../utils/cagetory");
const AppError = require("../exception/AppError");
const RestaurantServiceInterface = require("../interfaces/restaurant/ServiceInterface");
const bcrypt = require("bcrypt");
const config = require("../../config/config");
const authConfig = require("../../config/authConfig");
const JWT = require("../../utils/jwt");
const { sendVerificationEmail, sendEmail } = require("../../utils/email");
const { uploadImg, getImgUrl, deleteImgsByEmailAndType, updateImg, uploadMultipleImgs } = require("../../utils/ImgCloudinary");

class RestaurantService extends RestaurantServiceInterface {
  /**
   * Crea un nuevo restaurante con su dirección asociada.
   * sin necesidad de autenticarse, solo para propositos de prueba
   * @param {Object} restaurantData - Datos del restaurante.
   * @param {Object} addressData - Datos de la dirección.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Restaurant>} El restaurante creado.
   */
  async createRestaurant(restaurantData, addressData, cityId, suscriptionData) {
    // Validar los datos del restaurante y la dirección
    this._validateRestaurantData(restaurantData);
    this._validateAddressData(addressData);
    this._validateSuscriptionData(suscriptionData);

    return await RestaurantRepository._create(
      restaurantData,
      addressData,
      cityId,
      suscriptionData
    );
  }

  async register(restaurantData, addressData, cityId, suscriptionData) {
    // Validar los datos del restaurante y la dirección
    //this._validateRestaurantData(restaurantData);
    this._validateAddressData(addressData);
    //this._validateSuscriptionData(suscriptionData);
    // validar que el correo no exista
    const existingRestaurant = await this.findByEmail(restaurantData.correo);
    if (existingRestaurant) {
      throw new AppError("El correo ya está en uso");
    }

    // Manejar la subida de la imagen de perfil
    if (restaurantData.fotoPerfil) {
      const imageUrl = await this.uploadImage( restaurantData.correo, "profile", restaurantData.fotoPerfil);
      restaurantData.imageUrl = imageUrl;
      console.log("imagen subida: ", imageUrl);
    }

    const hashedPassword = await bcrypt.hash(
      restaurantData.contrasena,
      config.auth.bcryptSaltRounds
    );
    restaurantData.contrasena = hashedPassword;
    restaurantData.estado = "NO_VERIFICADO"; // Estado inicial
    const newRestaurant = await RestaurantRepository._create(
      restaurantData,
      addressData,
      cityId,
      suscriptionData
    );

    const userData = {
      id: newRestaurant.id,
      nombre: newRestaurant.nombre,
      correo: newRestaurant.correo,
      imageUrl: newRestaurant.imageUrl || null,
    }

    const verificationToken = JWT.createJWT(userData);
    console.log(
      "vamos a enviar el correo: ",
      newRestaurant.correo,
      verificationToken
    );
    await sendVerificationEmail(newRestaurant.correo, verificationToken);
    return {newRestaurant, token: verificationToken, user: userData};
  }

  async login(data) {
    const user = await this.findByEmail(data.correo);
    if (!user) {
      throw new Error("Correo o contraseña incorrectos");
    }

    const isPasswordValid = await bcrypt.compare(
      data.contrasena,
      user.contrasena
    );
    if (!isPasswordValid) {
      throw new Error("Correo o contraseña incorrectos");
    }
    
    const userData = { id: user.id, nombre: user.nombre, correo: user.correo, imageUrl: user.imageUrl || null }

    const token = JWT.createJWT(userData);
    return { token, user: userData };
  }


  verifyEmail = async (id) => {
    await RestaurantRepository.updateRestaurant(id, { estado: "ACTIVO" });
  };

  /**
   * Valida los datos del restaurante.
   * @param {Object} restaurantData - Datos del restaurante.
   * @throws {AppError} - Si los datos del restaurante no son válidos.
   */
  _validateRestaurantData(restaurantData) {
    const requiredFields = [
      "nombre",
      "correo",
      "telefono",
      "estado",
      "idAutenticacion",
      "capacidadReservas",
    ];
    requiredFields.forEach((field) => {
      if (!restaurantData[field]) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }
  _validateSuscriptionData(suscriptionData) {
    // Validar que se haya enviado un objeto de datos de suscripción
    if (!suscriptionData || typeof suscriptionData !== "object") {
      throw new AppError("Los datos de suscripción son obligatorios", 400);
    }

    const requiredFields = ["tipo"];
    requiredFields.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(suscriptionData, field)) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }
  /**
   * Valida los datos de la dirección.
   * @param {Object} addressData - Datos de la dirección.
   * @throws {AppError} - Si los datos de la dirección no son válidos.
   */
  _validateAddressData(addressData) {
    const requiredFields = ["direccion"];
    requiredFields.forEach((field) => {
      if (!addressData[field]) {
        throw new AppError(`El campo ${field} es obligatorio`, 400);
      }
    });
  }

  /**
   * Encuentra un restaurante por su ID.
   * @param {number} restaurantId - ID del restaurante.
   * @returns {Promise<Restaurant>} El restaurante encontrado.
   */
  async getRestaurantById(restaurantId) {
    if (!restaurantId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }
    return await RestaurantRepository.findById(restaurantId);
  }

  /**
   * Encuentra un restaurante por su ID.
   * @param {number} restaurantId - ID del restaurante.
   * @returns {Promise<Restaurant>} El restaurante encontrado.
   */
  async getRestaurantById(restaurantId) {
    if (!restaurantId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }
    return await RestaurantRepository.findById(restaurantId);
  }

  /**
   * Obtiene todos los restaurantes que coinciden con los filtros proporcionados.
   *
   * @param {Object} filters - Filtros para aplicar a la búsqueda de restaurantes.
   * @returns {Promise<Array>} - Una promesa que resuelve con un arreglo de restaurantes.
   */
  async getAll(filters) {
    try {
      if (
        !Object.values(category.Restaurante).includes(filters.category) &&
        filters.category != undefined
      ) {
        throw new AppError("La categoria no es valida", 400);
      }
      return await RestaurantRepository.findAll(filters);
    } catch (error) {
      throw new AppError("Error al obtener los restaurantes", 500);
    }
  }

  /**
   * Elimina un restaurante por su ID.
   * @param {number} restaurantId - ID del restaurante.
   * @returns {Promise<void>}
   */
  async deleteRestaurant(restaurantId) {
    if (!restaurantId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }
    
    try {

      // debo obtener el correo del restaurante para eliminar las imagenes
      const restaurant = await RestaurantRepository.findById(restaurantId);
      if (!restaurant) {
        throw new AppError("Restaurante no encontrado", 404);
      }

      // primero eliminar el restaurante de la base de datos
      await RestaurantRepository.deleteRestaurant(restaurant.id);

      // luego eliminar las imagenes de cloudinary
      await deleteImgsByEmailAndType(restaurant.correo, 'all');

      

    } catch (error) {
      throw new AppError("No se pudo eliminar el restaurante", 400);
    }
  }

  /**
   * Actualiza los detalles de un restaurante y su dirección.
   * @param {number} restaurantId - ID del restaurante.
   * @param {Object} updates - Objeto con los campos a actualizar.
   * @returns {Promise<Restaurant>} El restaurante actualizado.
   */
  static async updateRestaurant(restaurantId, updates) {
    if (!restaurantId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }

    const restaurant = await RestaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }

    if (updates.address) {
      await RestaurantRepository.updateAddress(
        restaurant.direccionId,
        updates.address
      );
    }

    const restaurantUpdates = { ...updates };
    delete restaurantUpdates.address;

    await RestaurantRepository.updateRestaurant(
      restaurantId,
      restaurantUpdates
    );
    return await RestaurantRepository.findById(restaurantId);
  }

  /**
   * Cambia la contraseña de un restaurante.
   * @param {number} id - ID del restaurante.
   * @param {string} oldPassword - Contraseña antigua.
   * @param {string} newPassword - Contraseña nueva.
   * @returns {Promise<void>}
   */
  async changePassword(correo, oldPassword, newPassword) {
    if (!correo || !oldPassword || !newPassword) {
      throw new AppError("Todos los campos son obligatorios", 400);
    }

    const restaurant = await this.findByEmail(correo);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }
    console.log(
      "***contraseña antigua: ",
      oldPassword,
      " contraseña nueva: ",
      newPassword,
      " restaurante: ",
      restaurant.contrasena
    );

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      restaurant.contrasena
    );
    if (!isPasswordValid) {
      throw new AppError("La contraseña antigua es incorrecta", 400);
    }

    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      config.auth.bcryptSaltRounds
    );
    await RestaurantService.updateRestaurant(restaurant.id, {
      contrasena: hashedNewPassword,
    });
  }

  /**
   * Recupera la contraseña de un restaurante, de hecho cambia la contraseña por una provisional y se la envía al correo.
   * @param {string} email - Correo electrónico del restaurante.
   * @returns {Promise<void>}
   */
  async recoverPassword(email) {
    if (!email) {
      throw new AppError("El correo electrónico es requerido", 400);
    }

    const restaurant = await this.findByEmail(email);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }

    const newPassword = this._generateSecurePassword();
    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      config.auth.bcryptSaltRounds
    );
    await RestaurantService.updateRestaurant(restaurant.id, {
      contrasena: hashedNewPassword,
    });

    const mailData = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      html: `<p>Se le ha cambiado su contraseña a una provisional para que pueda acceder, su nueva contraseña es: ${newPassword}</p>`,
    };

    await sendEmail(mailData.to, mailData.subject, mailData.html);
  }

  /**
   * Genera una contraseña segura.
   * @returns {string} La contraseña generada.
   */
  _generateSecurePassword(length = 12) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }

  async hasPassword(correo) {
    return this.findByEmail(correo).then((restaurant) => {
      if (!restaurant) {
        return false;
      }
      return restaurant.contrasena ? true : false;
    });
  }

  async createWithGoogle(profile) {
    const restaurantData = {
      nombre: profile.displayName,
      correo: profile.emails[0].value,
      idAutenticacion: profile.id,
      estado: "NO_VERIFICADO",
      //poner los demas campos en null, no pueden ser undefined
      telefono: null,
      idTransaccional: null,
      capacidadReservas: null,
      categoria: null,
      descripcion: null,
      contrasena: null,
      imageUrl: profile.photos[0].value,
    };

    const addressData = {
      direccion: "Establecer dirección de " + profile.displayName,
    };

    const cityId = 1; // ID de la ciudad por defecto

    //ahora se usa el repository y se envie correo de verificacion
    const newRestaurant = await RestaurantRepository._create(
      restaurantData,
      addressData,
      cityId
    );
    const verificationToken = JWT.createJWT({
      id: newRestaurant.id,
      nombre: newRestaurant.nombre,
      correo: newRestaurant.correo,
      imageUrl: newRestaurant.imageUrl || getImgUrl("profile", "restaurant"),
    });
    await sendVerificationEmail(newRestaurant.correo, verificationToken);
    return newRestaurant;
  }

  async findByGoogleId(id) {
    return await RestaurantRepository.findByGoogleId(id);
  }

  async findByEmail(email) {
    return await RestaurantRepository.findByEmail(email);
  }

  /**
   * Sube una imagen y devuelve la URL de la imagen subida.
   * @param {string} email - Correo electrónico del restaurante.
   * @param {string} type - Tipo de imagen (e.g., 'profile').
   * @param {string} image - Imagen a subir.
   * @returns {Promise<string>} URL de la imagen subida.
   */
  async uploadImage(email, type, image) {   
    console.log(email)
    console.log(type)
    console.log(image)
    if (!email || !type || !image) {
      throw new AppError("Todos los campos son obligatorios para subir la imagen", 400);
    }
    const imageUrl = await uploadImg(email, type, image);
    return imageUrl;
  }
  // updateImage(restaurantId, imgUrl, file);
  async updateImage(restaurantId, imgUrl, file) {
    if (!restaurantId || !imgUrl || !file) {
      throw new AppError("Todos los campos son obligatorios para actualizar la imagen", 400);
    }
    const restaurant = await RestaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }
    const imageUrl = await updateImg(restaurant.correo, imgUrl, file);
    
    return imageUrl;
  }

  // deleteImage
  async deleteImage(restaurantId, imgUrl) {
    if (!restaurantId || !imgUrl) {
      throw new AppError("Todos los campos son obligatorios para eliminar la imagen", 400);
    }
    const restaurant = await RestaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }
    await deleteImgsByEmailAndType(restaurant.correo, imgUrl);
  }


  // uploadMultipleImages(restaurantId, type, files);
  async uploadMultipleImages(restaurantId, type, files) {
    if (!restaurantId || !type || !files) {
      throw new AppError("Todos los campos son obligatorios para subir las imagenes", 400);
    }
    const restaurant = await RestaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }
    // logica para subir multiples imagenes, usar uploadMultipleImgs
    const imageUrls = await uploadMultipleImgs(restaurant.correo, type, files);
    urls.forEach(url => {
      imageUrls.push(url);
    });

    return imageUrls;

  }

}

module.exports = new RestaurantService();

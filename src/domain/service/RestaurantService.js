const restaurantRepository = require("../../infrastructure/repositories/RestaurantRepository");
const category = require("../../utils/cagetory");
const AppError = require("../exception/AppError");
const RestaurantServiceInterface = require("../interfaces/restaurant/ServiceInterface");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../../config/config");
const { sendVerificationEmail, sendEmail } = require('../../utils/email');

class RestaurantService extends RestaurantServiceInterface {
  /**
   * Crea un nuevo restaurante con su dirección asociada.
   * @param {Object} restaurantData - Datos del restaurante.
   * @param {Object} addressData - Datos de la dirección.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Restaurant>} El restaurante creado.
   */
  async createRestaurant(restaurantData, addressData, cityId) {
    // Validar los datos del restaurante y la dirección
    this._validateRestaurantData(restaurantData);
    this._validateAddressData(addressData);

    return await restaurantRepository.create(
      restaurantData,
      addressData,
      cityId
    );
  }

  async register(restaurantData, addressData, cityId) {

    // Validar los datos del restaurante y la dirección
    //this._validateRestaurantData(restaurantData);
    this._validateAddressData(addressData);

    // validar que el correo no exista
    const existingRestaurant = await restaurantRepository.findByEmail(restaurantData.correo);
    if (existingRestaurant) {
      throw new AppError('El correo ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(restaurantData.contrasena, config.auth.bcryptSaltRounds);
    restaurantData.contrasena = hashedPassword;
    restaurantData.estado = 'NO_VERIFICADO'; // Estado inicial
    const newRestaurant = await restaurantRepository._create(restaurantData, addressData, cityId);
    const verificationToken = jwt.sign({ id: newRestaurant.id, correo: newRestaurant.correo }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration });
    console.log("vamos a enviar el correo: ", newRestaurant.correo, verificationToken);
    await sendVerificationEmail(newRestaurant.correo, verificationToken);
    return newRestaurant;
  }

  async login(data) {
    const user = await restaurantRepository.findByEmail(data.correo);
    if (!user) {
      throw new Error('Correo o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(data.contrasena, user.contrasena);
    if (!isPasswordValid) {
      throw new Error('Correo o contraseña incorrectos');
    }

    const token = jwt.sign({ id: user.id, correo: user.correo }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration });
    return { token };
  }
  verifyEmail = async (id) => {
    await restaurantRepository.updateRestaurant(id, { estado: 'ACTIVO' });
  }



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
      "idTransaccional",
      "capacidadReservas",
    ];
    requiredFields.forEach((field) => {
      if (!restaurantData[field]) {
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
    return await restaurantRepository.findById(restaurantId);
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
    return await restaurantRepository.findById(restaurantId);
  }

  /**
   * Obtiene todos los restaurantes que coinciden con los filtros proporcionados.
   *
   * @param {Object} filters - Filtros para aplicar a la búsqueda de restaurantes.
   * @returns {Promise<Array>} - Una promesa que resuelve con un arreglo de restaurantes.
   */
  async getAll(filters) {
    try {
      if (!Object.values(category.Restaurante).includes(filters.category) && filters.category != undefined) {
        throw new AppError("La categoria no es valida", 400);
      }
      return await restaurantRepository.findAll(filters);
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
    await restaurantRepository.deleteRestaurant(restaurantId);
  }

  /**
   * Actualiza los detalles de un restaurante y su dirección.
   * @param {number} restaurantId - ID del restaurante.
   * @param {Object} updates - Objeto con los campos a actualizar.
   * @returns {Promise<Restaurant>} El restaurante actualizado.
   */
  async updateRestaurant(restaurantId, updates) {
    if (!restaurantId) {
      throw new AppError("El ID del restaurante es requerido", 400);
    }

    const restaurant = await restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }

    if (updates.address) {
      await restaurantRepository.updateAddress(
        restaurant.direccionId,
        updates.address
      );
    }

    const restaurantUpdates = { ...updates };
    delete restaurantUpdates.address;

    await restaurantRepository.updateRestaurant(
      restaurantId,
      restaurantUpdates
    );
    return await restaurantRepository.findById(restaurantId);
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

    const restaurant = await restaurantRepository.findByEmail(correo);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }
    console.log("***contraseña antigua: ", oldPassword, " contraseña nueva: ", newPassword, " restaurante: ", restaurant.contrasena);

    const isPasswordValid = await bcrypt.compare(oldPassword, restaurant.contrasena);
    if (!isPasswordValid) {
      throw new AppError("La contraseña antigua es incorrecta", 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, config.auth.bcryptSaltRounds);
    await this.updateRestaurant(restaurant.id, { contrasena: hashedNewPassword });
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

    const restaurant = await restaurantRepository.findByEmail(email);
    if (!restaurant) {
      throw new AppError("Restaurante no encontrado", 404);
    }

    const newPassword = this._generateSecurePassword();
    const hashedNewPassword = await bcrypt.hash(newPassword, config.auth.bcryptSaltRounds);
    await this.updateRestaurant(restaurant.id, { contrasena: hashedNewPassword });

    const mailData = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `<p>Se le ha cambiado su contraseña a una provisional para que pueda acceder, su nueva contraseña es: ${newPassword}</p>`
    };

    await sendEmail(mailData.to, mailData.subject, mailData.html);
  }

  /**
   * Genera una contraseña segura.
   * @returns {string} La contraseña generada.
   */
  _generateSecurePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
}

module.exports = new RestaurantService();

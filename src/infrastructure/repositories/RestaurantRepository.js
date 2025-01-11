const db = require("../../database/connection");
const RestaurantRepositoryInterface = require("../../domain/interfaces/restaurant/RepositoryInterface");
const Restaurant = require("../../domain/models/RestaurantModel");
const Address = require("../../domain/models/AddressModel");
const category = require("../../utils/cagetory");
const getImgUrl = require("../../utils/getImgUrl");

const AppError = require("../../domain/exception/AppError");

class RestaurantRepository extends RestaurantRepositoryInterface {
  /**
   * Crea un nuevo restaurante con su dirección asociada.
   * @param {Object} restaurantData - Datos del restaurante.
   * @param {Object} addressData - Datos de la dirección.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Restaurant>} El restaurante creado.
   */
  async create(restaurantData, addressData, cityId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar dirección
      const [addressResult] = await connection.execute(
        `INSERT INTO direccion (ciudad_id, direccion) VALUES (?, ?)`,
        [cityId, addressData.direccion]
      );
      const addressId = addressResult.insertId;
      /*TODO:
       Tener presente si para los ids de mercadopago y ath0 toca colocar ids por default 
       para evitar problemas, por el tema de que estamos en desarrollo
       */
      restaurantData.categoria =
        restaurantData.categoria ?? category.Restaurante.CASUAL_DINING;
      // Insertar restaurante
      const [restaurantResult] = await connection.execute(
        `INSERT INTO restaurante (nombre, correo, telefono, estado, id_autenticacion, id_transaccional, capacidad_reservas,categoria,descripcion, direccion_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?)`,
        [
          restaurantData.nombre,
          restaurantData.correo,
          restaurantData.telefono,
          restaurantData.estado,
          restaurantData.idAutenticacion,
          restaurantData.idTransaccional,
          restaurantData.capacidadReservas,
          restaurantData.categoria,
          restaurantData.descripcion,
          addressId,
        ]
      );

      await connection.commit();

      const address = new Address({
        id: addressId,
        ciudadId: cityId,
        direccion: addressData.direccion,
      });

      return new Restaurant({
        id: restaurantResult.insertId,
        ...restaurantData,
        direccionId: addressId,
        address: address,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Encuentra un restaurante por su correo.
   * @param {string} correo - correo del restaurante.
   * @returns {Promise<rows[0]>} El restaurante encontrado.
   */
  async findByEmail(correo) {
    const query = `SELECT * FROM restaurante WHERE correo = ?`;
    const [rows] = await db.execute(query, [correo]);
    return rows[0];
  }

  async _create(restaurantData, addressData, cityId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar dirección
      const [addressResult] = await connection.execute(
        `INSERT INTO direccion (ciudad_id, direccion) VALUES (?, ?)`,
        [cityId, addressData.direccion]
      );
      const addressId = addressResult.insertId;
      /*TODO:
       Tener presente si para los ids de mercadopago y ath0 toca colocar ids por default 
       para evitar problemas, por el tema de que estamos en desarrollo
       */
      restaurantData.categoria =
        restaurantData.categoria ?? category.Restaurante.CASUAL_DINING;
      // Insertar restaurante
      const [restaurantResult] = await connection.execute(
        `INSERT INTO restaurante (nombre, correo, contrasena, telefono, estado, id_autenticacion, id_transaccional, capacidad_reservas,categoria,descripcion, direccion_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          restaurantData.nombre,
          restaurantData.correo,
          restaurantData.contrasena || null,
          restaurantData.telefono,
          restaurantData.estado,
          restaurantData.idAutenticacion || null,
          restaurantData.idTransaccional,
          restaurantData.capacidadReservas,
          restaurantData.categoria,
          restaurantData.descripcion,
          addressId,
        ]
      );

      await connection.commit();

      const address = new Address({
        id: addressId,
        ciudadId: cityId,
        direccion: addressData.direccion,
      });

      return new Restaurant({
        id: restaurantResult.insertId,
        ...restaurantData,
        direccionId: addressId,
        address: address,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }


  /**
   * Encuentra un restaurante por su ID.
   * @param {number} restaurantId - ID del restaurante.
   * @returns {Promise<Restaurant>} El restaurante encontrado.
   */
  async findById(restaurantId) {
    const query = `
          SELECT r.*, d.*, c.id AS ciudad_id, c.nombre AS ciudad_nombre, dp.id AS departamento_id, dp.nombre AS departamento_nombre, p.id AS pais_id, p.nombre AS pais_nombre
          FROM restaurante r
          JOIN direccion d ON r.direccion_id = d.id
          JOIN ciudad c ON d.ciudad_id = c.id
          JOIN departamento dp ON c.departamento_id = dp.id
          JOIN pais p ON dp.pais_id = p.id
          WHERE r.id = ?
        `;
    const [rows] = await db.execute(query, [restaurantId]);
    if (rows.length === 0) {
      throw new AppError(
        `Restaurante con ID ${restaurantId} no encontrado`,
        404
      );
    }
    const row = rows[0];
    const address = Address.fromDB(row);
    return new Restaurant({
      id: row.id,
      nombre: row.nombre,
      correo: row.correo,
      telefono: row.telefono,
      estado: row.estado,
      idAutenticacion: row.id_autenticacion,
      idTransaccional: row.id_transaccional,
      capacidadReservas: row.capacidad_reservas,
      direccionId: row.direccion_id,
      categoria: row.categoria,
      descripcion: row.descripcion,
      address: address,
      imageUrl: getImgUrl(row.categoria, "restaurant"),
    });
  }

  /**
   * Encuentra todos los restaurantes por ciudad.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */

  /**
   * Finds all restaurants based on the provided filters.
   *
   * @param {Object} filters - The filters to apply to the query.
   * @param {number} [filters.countryId] - The ID of the country to filter by.
   * @param {number} [filters.departmentId] - The ID of the department to filter by.
   * @param {number} [filters.cityId] - The ID of the city to filter by.
   * @param {string} [filters.category] - The category of the restaurant to filter by.
   * @returns {Promise<Restaurant[]>} A promise that resolves to an array of Restaurant objects.
   */

  async findAll({ countryId, departmentId, cityId, category }) {
    let query = `
    SELECT 
      r.*, 
      d.*, 
      c.id AS ciudad_id, 
      c.nombre AS ciudad_nombre,
      dp.id AS departamento_id, 
      dp.nombre AS departamento_nombre,
      p.id AS pais_id, 
      p.nombre AS pais_nombre
    FROM restaurante r
    JOIN direccion d ON r.direccion_id = d.id
    JOIN ciudad c ON d.ciudad_id = c.id
    JOIN departamento dp ON c.departamento_id = dp.id
    JOIN pais p ON dp.pais_id = p.id
    WHERE 1 = 1
  `;
    const params = [];

    if (countryId) {
      query += " AND p.id = ?";
      params.push(countryId);
    }
    if (departmentId) {
      query += " AND dp.id = ?";
      params.push(departmentId);
    }
    if (cityId) {
      query += " AND c.id = ?";
      params.push(cityId);
    }
    if (category) {
      query += " AND r.categoria = ?";
      params.push(category);
    }

    const [rows] = await db.execute(query, params);
    return rows.map((row) => {
      const address = Address.fromDB(row);
      return new Restaurant({
        id: row.id,
        nombre: row.nombre,
        correo: row.correo,
        telefono: row.telefono,
        estado: row.estado,
        idAutenticacion: row.id_autenticacion,
        idTransaccional: row.id_transaccional,
        capacidadReservas: row.capacidad_reservas,
        direccionId: row.direccion_id,
        categoria: row.categoria,
        descripcion: row.descripcion,
        address,
        imageUrl: getImgUrl(row.categoria, "restaurant"),
      });
    });
  }
  /**
   * Elimina un restaurante por su ID y la dirección asociada.
   * @param {number} restaurantId - ID del restaurante.
   * @returns {Promise<void>}
   */
  async deleteRestaurant(restaurantId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Obtener el ID de la dirección asociada
      const [rows] = await connection.execute(
        `SELECT direccion_id FROM restaurante WHERE id = ?`,
        [restaurantId]
      );
      if (rows.length === 0) {
        throw new Error(`Restaurante con ID ${restaurantId} no encontrado`);
      }
      const direccionId = rows[0].direccion_id;

      // Eliminar el restaurante
      const deleteRestaurantQuery = `DELETE FROM restaurante WHERE id = ?`;
      await connection.execute(deleteRestaurantQuery, [restaurantId]);

      // Eliminar la dirección
      const deleteAddressQuery = `DELETE FROM direccion WHERE id = ?`;
      await connection.execute(deleteAddressQuery, [direccionId]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  /**
   * Actualiza los detalles de un restaurante.
   * @param {number} restaurantId - ID del restaurante.
   * @param {Object} updates - Objeto con los campos a actualizar.
   * @returns {Promise<void>}
   */
  async updateRestaurant(restaurantId, updates) {
    const fields = [];
    const values = [];

    if (updates.nombre) {
      fields.push("nombre = ?");
      values.push(updates.nombre);
    }
    if (updates.correo) {
      fields.push("correo = ?");
      values.push(updates.correo);
    }
    if(updates.contrasena){
      fields.push("contrasena = ?");
      values.push(updates.contrasena);
    }

    if (updates.telefono) {
      fields.push("telefono = ?");
      values.push(updates.telefono);
    }
    if (updates.direccionId) {
      fields.push("direccion_id = ?");
      values.push(updates.direccionId);
    }
    if (updates.capacidadReservas) {
      fields.push("capacidad_reservas = ?");
      values.push(updates.capacidadReservas);
    }
    if (updates.estado) {
      fields.push("estado = ?");
      values.push(updates.estado);
    }
    if (updates.categoria) {
      fields.push("categoria = ?");
      values.push(updates.categoria);
    }
    if (updates.descripcion) {
      fields.push("descripcion = ?");
      values.push(updates.descripcion);
    }

    if(updates.idAutenticacion){
      fields.push("id_autenticacion = ?");
      values.push(updates.idAutenticacion);
    }

    if (fields.length === 0) {
      throw new Error("No hay campos para actualizar");
    }

    const query = `UPDATE restaurante SET ${fields.join(", ")} WHERE id = ?`;
    values.push(restaurantId);

    await db.execute(query, values);
  }

  /**
   * Actualiza los detalles de una dirección.
   * @param {number} direccionId - ID de la dirección.
   * @param {Object} updates - Objeto con los campos a actualizar.
   * @returns {Promise<void>}
   */
  async updateAddress(direccionId, updates) {
    const fields = [];
    const values = [];

    if (updates.direccion) {
      fields.push("direccion = ?");
      values.push(updates.direccion);
    }
    // Agrega otros campos de dirección que quieras actualizar aquí

    if (fields.length === 0) {
      throw new Error("No hay campos para actualizar en la dirección");
    }

    const query = `UPDATE direccion SET ${fields.join(", ")} WHERE id = ?`;
    values.push(direccionId);

    await db.execute(query, values);
  }

  // implementar findByGoogleId, teniendo en cuenta que el id de google se almacena en la tabla restaurante en el campo id_autenticacion

  async findByGoogleId(googleId) {
    const query = `SELECT * FROM restaurante WHERE id_autenticacion = ?`;
    const [rows] = await db.execute(query, [googleId]);
    return rows[0];
  }












}

module.exports = new RestaurantRepository();

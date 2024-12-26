const db = require("../../database/connection");
const RestaurantRepositoryInterface = require("../../domain/interfaces/restaurant/RepositoryInterface");
const Restaurant = require("../../domain/models/RestaurantModel");
const Address = require("../../domain/models/AddressModel");

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

      // Insertar restaurante
      const [restaurantResult] = await connection.execute(
        `INSERT INTO restaurante (nombre, correo, telefono, estado, id_atenticacion, id_transaccional, capacidad_reservas, direccion_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          restaurantData.nombre,
          restaurantData.correo,
          restaurantData.telefono,
          restaurantData.estado,
          restaurantData.idAtenticacion,
          restaurantData.idTransaccional,
          restaurantData.capacidadReservas,
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
      SELECT r.*, d.*, c.nombre AS ciudad_nombre, dp.nombre AS departamento_nombre, p.nombre AS pais_nombre
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
      idAtenticacion: row.id_atenticacion,
      idTransaccional: row.id_transaccional,
      capacidadReservas: row.capacidad_reservas,
      direccionId: row.direccion_id,
      address: address,
    });
  }

  /**
   * Encuentra todos los restaurantes por ciudad.
   * @param {number} cityId - ID de la ciudad.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async findAllByCity(cityId) {
    const query = `
      SELECT r.*, d.*, c.nombre AS ciudad_nombre, dp.nombre AS departamento_nombre, p.nombre AS pais_nombre
      FROM restaurante r
      JOIN direccion d ON r.direccion_id = d.id
      JOIN ciudad c ON d.ciudad_id = c.id
      JOIN departamento dp ON c.departamento_id = dp.id
      JOIN pais p ON dp.pais_id = p.id
      WHERE c.id = ?
    `;
    const [rows] = await db.execute(query, [cityId]);
    return rows.map((row) => {
      const address = Address.fromDB(row);
      return new Restaurant({
        id: row.id,
        nombre: row.nombre,
        correo: row.correo,
        telefono: row.telefono,
        estado: row.estado,
        idAtenticacion: row.id_atenticacion,
        idTransaccional: row.id_transaccional,
        capacidadReservas: row.capacidad_reservas,
        direccionId: row.direccion_id,
        address: address,
      });
    });
  }

  /**
   * Encuentra todos los restaurantes por departamento.
   * @param {number} departmentId - ID del departamento.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async findAllByDepartment(departmentId) {
    const query = `
      SELECT r.*, d.*, c.nombre AS ciudad_nombre, dp.nombre AS departamento_nombre, p.nombre AS pais_nombre
      FROM restaurante r
      JOIN direccion d ON r.direccion_id = d.id
      JOIN ciudad c ON d.ciudad_id = c.id
      JOIN departamento dp ON c.departamento_id = dp.id
      JOIN pais p ON dp.pais_id = p.id
      WHERE dp.id = ?
    `;
    const [rows] = await db.execute(query, [departmentId]);
    return rows.map((row) => {
      const address = Address.fromDB(row);
      return new Restaurant({
        id: row.id,
        nombre: row.nombre,
        correo: row.correo,
        telefono: row.telefono,
        estado: row.estado,
        idAtenticacion: row.id_atenticacion,
        idTransaccional: row.id_transaccional,
        capacidadReservas: row.capacidad_reservas,
        direccionId: row.direccion_id,
        address: address,
      });
    });
  }

  /**
   * Encuentra todos los restaurantes por país.
   * @param {number} countryId - ID del país.
   * @returns {Promise<Array<Restaurant>>} Lista de restaurantes.
   */
  async findAllByCountry(countryId) {
    const query = `
      SELECT r.*, d.*, c.nombre AS ciudad_nombre, dp.nombre AS departamento_nombre, p.nombre AS pais_nombre
      FROM restaurante r
      JOIN direccion d ON r.direccion_id = d.id
      JOIN ciudad c ON d.ciudad_id = c.id
      JOIN departamento dp ON c.departamento_id = dp.id
      JOIN pais p ON dp.pais_id = p.id
      WHERE p.id = ?
    `;
    const [rows] = await db.execute(query, [countryId]);
    return rows.map((row) => {
      const address = Address.fromDB(row);
      return new Restaurant({
        id: row.id,
        nombre: row.nombre,
        correo: row.correo,
        telefono: row.telefono,
        estado: row.estado,
        idAtenticacion: row.id_atenticacion,
        idTransaccional: row.id_transaccional,
        capacidadReservas: row.capacidad_reservas,
        direccionId: row.direccion_id,
        address: address,
      });
    });
  }
}

module.exports = new RestaurantRepository();

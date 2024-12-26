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
}

module.exports = new RestaurantRepository();
const db = require("../../database/connection"); // Tu conexión a la base de datos
const ReservationRepositoryInterface = require("../../domain/interfaces/RepositoryInterface");
const Reservation = require("../../domain/models/ReservationModel");
const state = require("../../utils/state");
class ReservationRepository extends ReservationRepositoryInterface {
  /**
   * Obtiene todas las reservas con sus detalles asociados.
   * @returns {Promise<Array>} Lista de reservas.
   */
  async findAll() {
    const query = `
            SELECT 
                r.id AS reserva_id,
                r.fecha,
                r.hora,
                r.cantidad,
                r.estado,
                r.nombre,
                r.telefono,
                r.correo,
                r.cedula,
                r.restaurante_id,
                m.etiqueta AS mesa_etiqueta
            FROM reservas r
            LEFT JOIN mesa_has_reservas mhr ON r.id = mhr.reservas_id
            LEFT JOIN mesa m ON mhr.mesa_id = m.id
            ORDER BY r.fecha DESC, r.hora DESC;
        `;
    const [rows] = await db.execute(query);
    // Transforma los resultados en instancias del modelo
    return rows.map((row) => Reservation.fromDB(row));
  }
  /**
   * Crea una nueva reserva en la base de datos.
   * @param {Object} reservationData - Datos de la reserva.
   * @returns {Promise<Reservation>} La reserva creada.
   */
  async create(reservationData) {
    const query = `
        INSERT INTO reservas (fecha, hora, cantidad, estado, restaurante_id, nombre, telefono, correo, cedula)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
    const [result] = await db.execute(query, [
      reservationData.fecha,
      reservationData.hora,
      reservationData.cantidad,
      reservationData.estado || state.Reservas.PENDIENTE,
      reservationData.restauranteId,
      reservationData.nombre,
      reservationData.telefono,
      reservationData.correo,
      reservationData.cedula,
    ]);

    const newReservation = new Reservation({
      id: result.insertId,
      ...reservationData,
    });

    return newReservation;
  }

  /**
   * Asocia una mesa a una reserva.
   * @param {number} reservationId - ID de la reserva.
   * @param {number} tableId - ID de la mesa.
   * @returns {Promise<void>}
   */
  async assignTable(reservationId, tableId) {
    // Verificar la capacidad de reservas del restaurante
    const [reservation] = await db.execute(
      `SELECT restaurante_id, cantidad FROM reservas WHERE id = ?`,
      [reservationId]
    );

    if (reservation.length === 0) {
      throw new AppError(`Reserva con ID ${reservationId} no encontrada`, 404);
    }

    const restauranteId = reservation[0].restaurante_id;
    const cantidadReserva = reservation[0].cantidad;

    const [restaurant] = await db.execute(
      `SELECT capacidad_reservas FROM restaurante WHERE id = ?`,
      [restauranteId]
    );

    if (restaurant.length === 0) {
      throw new AppError(
        `Restaurante con ID ${restauranteId} no encontrado`,
        404
      );
    }

    const capacidadReservas = restaurant[0].capacidad_reservas;

    if (capacidadReservas < cantidadReserva) {
      throw new AppError(
        `No hay capacidad disponible para reservas en el restaurante con ID ${restauranteId}`,
        400
      );
    }

    // Verificar que la mesa pertenece al mismo restaurante
    const [table] = await db.execute(
      `SELECT restaurante_id FROM mesa WHERE id = ?`,
      [tableId]
    );

    if (table.length === 0) {
      throw new AppError(`Mesa con ID ${tableId} no encontrada`, 404);
    }

    if (table[0].restaurante_id !== restauranteId) {
      throw new AppError(
        `La mesa con ID ${tableId} no pertenece al restaurante con ID ${restauranteId}`,
        400
      );
    }

    // Asignar la mesa a la reserva
    const query = `
      INSERT INTO mesa_has_reservas (mesa_id, reservas_id)
      VALUES (?, ?);
    `;
    await db.execute(query, [tableId, reservationId]);

    // Restar la capacidad de reservas del restaurante en función de la cantidad de la reserva
    await db.execute(
      `UPDATE restaurante SET capacidad_reservas = capacidad_reservas - ? WHERE id = ?`,
      [cantidadReserva, restauranteId]
    );

    // Actualizar el estado de la reserva a RESERVADO
    await db.execute(`UPDATE reservas SET estado = ? WHERE id = ?`, [
      state.Reservas.RESERVADO,
      reservationId,
    ]);
  }

  /**
   * Actualiza el estado de una reserva.
   * @param {number} reservationId - ID de la reserva.
   * @param {string} newState - Nuevo estado de la reserva.
   * @returns {Promise<void>}
   */
  async updateState(reservationId, newState) {
    const query = `UPDATE reservas SET estado = ? WHERE id = ?`;
    await db.execute(query, [newState, reservationId]);
  }

  /**
   * Cancela una reserva.
   * @param {number} reservationId - ID de la reserva.
   * @param {number} cantidadReserva - Cantidad de personas en la reserva.
   * @param {number} restauranteId - ID del restaurante.
   * @returns {Promise<void>}
   */
  async cancelReservation(reservationId, cantidadReserva, restauranteId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Eliminar la asignación de mesa
      await connection.execute(
        `DELETE FROM mesa_has_reservas WHERE reservas_id = ?`,
        [reservationId]
      );

      // Restaurar la capacidad de reservas del restaurante
      await connection.execute(
        `UPDATE restaurante SET capacidad_reservas = capacidad_reservas + ? WHERE id = ?`,
        [cantidadReserva, restauranteId]
      );

      // Actualizar el estado de la reserva a CANCELADO
      await connection.execute(`UPDATE reservas SET estado = ? WHERE id = ?`, [
        state.Reservas.CANCELADO,
        reservationId,
      ]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  /**
   * Encuentra una reserva por su ID.
   * @param {number} reservationId - ID de la reserva.
   * @returns {Promise<Reservation|null>} La reserva encontrada o null si no existe.
   */
  async findById(reservationId) {
    const query = `SELECT * FROM reservas WHERE id = ?`;
    const [rows] = await db.execute(query, [reservationId]);
    if (rows.length === 0) {
      return null;
    }
    return Reservation.fromDB(rows[0]);
  }

  /**
   * Encuentra todas las reservas por restaurante.
   * @param {number} restauranteId - ID del restaurante.
   * @returns {Promise<Array>} Lista de reservas.
   */
  async findAllByRestaurant(restauranteId) {
    if (typeof restauranteId === "undefined") {
      throw new AppError("El ID del restaurante no puede ser undefined", 400);
    }

    const query = `
      SELECT 
        r.id AS reserva_id,
        r.fecha,
        r.hora,
        r.cantidad,
        r.estado,
        r.nombre,
        r.telefono,
        r.correo,
        r.cedula,
        r.restaurante_id,
        m.etiqueta AS mesa_etiqueta
      FROM reservas r
      LEFT JOIN mesa_has_reservas mhr ON r.id = mhr.reservas_id
      LEFT JOIN mesa m ON mhr.mesa_id = m.id
      WHERE r.restaurante_id = ?
      ORDER BY r.fecha DESC, r.hora DESC;
    `;
    const [rows] = await db.execute(query, [restauranteId]);
    // Transforma los resultados en instancias del modelo
    return rows.map((row) => Reservation.fromDB(row));
  }
}

module.exports = new ReservationRepository();

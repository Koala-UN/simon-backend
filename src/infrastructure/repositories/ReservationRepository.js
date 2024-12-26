const db = require("../../database/connection"); // Tu conexión a la base de datos
const ReservationRepositoryInterface = require("../../domain/interfaces/RepositoryInterface");
const Reservation = require('../../domain/models/ReservationModel')
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
}

module.exports = new ReservationRepository();

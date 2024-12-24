const pool = require("../../database/database");
const OrderRepositoryInterface = require("../../domain/interfaces/order/RepositoryInterface");
/**
 * Clase que interactúa con la base de datos para las operaciones de pedidos.
 */
class OrderRepository extends OrderRepositoryInterface {
  /**
   * Recupera todos los pedidos de la base de datos, incluyendo su estado y total.
   *
   * @returns {Promise<Array>} Una promesa que resuelve a un array de objetos que representan los pedidos.
   * Cada objeto contiene las siguientes propiedades:
   * - id: El identificador del pedido.
   * - fecha: La fecha del pedido.
   * - hora: La hora del pedido.
   * - mesa_id: El identificador de la mesa asociada al pedido.
   * - estado: El estado del pedido, que puede ser 'PENDIENTE' o 'ENTREGADO'.
   * - total: El total del pedido, que es la suma de los totales de los platillos asociados al pedido.
   */
  async findAll() {
    const [rows] = await pool.query(`
            SELECT 
                p.id, 
                p.fecha, 
                p.hora, 
                p.mesa_id, 
                CASE 
                    WHEN COUNT(pp.pedido_id) = 0 THEN 'PENDIENTE'
                    WHEN SUM(pp.estado = 'PENDIENTE') > 0 THEN 'PENDIENTE'
                    ELSE 'ENTREGADO'
                END AS estado,
                IFNULL(SUM(pp.total), 0) AS total
            FROM pedido p
            LEFT JOIN platillo_has_pedido pp ON p.id = pp.pedido_id
            GROUP BY p.id, p.fecha, p.hora, p.mesa_id
        `);
    return rows;
  }
  /**
   * Busca todos los platillos asociados a un pedido específico.
   * @param {number} pedidoId - ID del pedido.
   * @returns {Promise<Object[]>} - Lista de platillos asociados al pedido.
   */
  async findOrderById(pedidoId) {
    const [rows] = await pool.query(
      `SELECT pp.platillo_id, p.nombre, pp.cantidad, pp.estado, pp.total
     FROM platillo_has_pedido pp
     JOIN platillo p ON pp.platillo_id = p.id
     WHERE pp.pedido_id = ?`,
      [pedidoId]
    );
    return rows || []; // Siempre devuelve un array
  }
  /**
   * Busca un platillo en un pedido específico.
   * @param {number} pedidoId - ID del pedido.
   * @param {number} platilloId - ID del platillo.
   * @returns {Promise<Object[]>} - Platillo encontrado.
   */
  async findPlatilloById(pedidoId, platilloId) {
    const [rows] = await pool.query(
      `SELECT * FROM platillo_has_pedido WHERE pedido_id = ? AND platillo_id = ?`,
      [pedidoId, platilloId]
    );
    return rows || []; // Siempre devuelve un array
  }

  /**
   * Actualiza el estado de un platillo en un pedido.
   * @param {number} pedidoId - ID del pedido.
   * @param {number} platilloId - ID del platillo.
   * @param {string} estado - Nuevo estado del platillo.
   * @returns {Promise<Object>} - Resultado de la actualización.
   */
  async updatePlatilloStatus(pedidoId, platilloId, estado) {
    const [result] = await pool.query(
      `UPDATE platillo_has_pedido SET estado = ? WHERE pedido_id = ? AND platillo_id = ?`,
      [estado, pedidoId, platilloId]
    );
    return result;
  }

  /**
   * Actualiza el estado de todos los registros asociados a un pedido en la tabla muchos a muchos.
   *
   * @param {number} id - El ID del pedido.
   * @param {string} newStatus - El nuevo estado para los registros relacionados.
   * @returns {Promise<Object>} - Detalles del pedido actualizado.
   * @throws {Error} - Si no se encuentra el pedido.
   */
  async updateStatusById(id, newStatus) {
    // Verificar si el pedido existe
    const [order] = await pool.query(`SELECT id FROM pedido WHERE id = ?`, [
      id,
    ]);
    if (order.length === 0) {
      throw new Error(`Pedido con ID ${id} no encontrado.`);
    }

    // Actualizar el estado en la tabla muchos a muchos
    const [updateResult] = await pool.query(
      `UPDATE platillo_has_pedido SET estado = ? WHERE pedido_id = ?`,
      [newStatus, id]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error(
        `No se encontraron registros relacionados para el pedido con ID ${id}.`
      );
    }

    return { id, estado: newStatus };
  }

  /**
   * Crea un nuevo pedido y asocia platillos.
   * @param {Object} orderData - Datos del pedido.
   * @param {Array} platillos - Lista de platillos.
   * @returns {Promise<Object>} - Detalles del pedido creado.
   */
  async create(orderData, platillos) {
    const { mesaId } = orderData;

    if (!platillos || platillos.length === 0) {
      throw new AppError("El pedido debe contener al menos un platillo.", 400);
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Crear pedido
      const [pedidoResult] = await connection.query(
        `INSERT INTO pedido (fecha, hora, mesa_id) VALUES (CURRENT_DATE(), CURRENT_TIME(), ?)`,
        [mesaId]
      );
      const pedidoId = pedidoResult.insertId;

      // Obtener los precios de los platillos
      const platilloIds = platillos.map((p) => p.platilloId);
      const [precioRows] = await connection.query(
        `SELECT id AS platilloId, precio FROM platillo WHERE id IN (?)`,
        [platilloIds]
      );

      if (precioRows.length !== platilloIds.length) {
        throw new AppError(
          "Uno o más platillos no existen en la base de datos.",
          404
        );
      }

      // Crear los registros en platillo_has_pedido
      const platilloValues = platillos.map(({ platilloId, cantidad }) => {
        const precioRow = precioRows.find(
          (row) => row.platilloId === platilloId
        );
        const precioUnitario = precioRow.precio;
        const total = cantidad * precioUnitario;

        return [platilloId, pedidoId, cantidad, "PENDIENTE", total];
      });

      await connection.query(
        `INSERT INTO platillo_has_pedido (platillo_id, pedido_id, cantidad, estado, total) VALUES ?`,
        [platilloValues]
      );

      await connection.commit();

      return { id: pedidoId, mesaId, estado: "PENDIENTE" };
    } catch (error) {
      await connection.rollback();
      throw new AppError(`Error al crear el pedido: ${error.message}`, 500);
    } finally {
      connection.release();
    }
  }
}

module.exports = new OrderRepository();

const pool = require("../../database/connection");
const OrderRepositoryInterface = require("../../domain/interfaces/order/RepositoryInterface");
const state = require("../../utils/state");
const AppError = require("../../domain/exception/AppError");
/**
 * Clase que interactúa con la base de datos para las operaciones de pedidos.
 */
class OrderRepository extends OrderRepositoryInterface {
  /**
   * Recupera todos los pedidos de la base de datos, incluyendo su estado y total.
   *
   * @param {number} restaurantId - El identificador del restaurante.
   * @returns {Promise<Array>} Una promesa que resuelve a un array de objetos que representan los pedidos.
   * Cada objeto contiene las siguientes propiedades:
   * - id: El identificador del pedido.
   * - fecha: La fecha del pedido.
   * - hora: La hora del pedido.
   * - nombre_cliente: El nombre del cliente asociado al pedido.
   * - estado: El estado del pedido, que puede ser 'PENDIENTE' o 'ENTREGADO'.
   * - total: El total del pedido, que es la suma de los totales de los platillos asociados al pedido.
   */
  async findAll(restaurantId) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id, 
        p.fecha, 
        p.hora, 
        p.nombre_cliente,
        CASE 
          WHEN COUNT(pp.pedido_id) = 0 THEN 'PENDIENTE'
          WHEN SUM(pp.estado = 'PENDIENTE') > 0 THEN 'PENDIENTE'
          WHEN SUM(pp.estado = 'CANCELADO') = COUNT(pp.pedido_id) THEN 'CANCELADO'
          ELSE 'ENTREGADO'
        END AS estado,
        IFNULL(SUM(pp.total), 0) AS total,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'platillo_id', pp.platillo_id,
              'nombre', pl.nombre,
              'cantidad', pp.cantidad,
              'estado', pp.estado,
              'total', CONCAT('$', FORMAT(pp.total, 0))
            )
          ),
          '[]'
        ) AS platillos
      FROM pedido p
      LEFT JOIN platillo_has_pedido pp ON p.id = pp.pedido_id
      LEFT JOIN platillo pl ON pp.platillo_id = pl.id
      WHERE pl.restaurante_id = ?
      GROUP BY p.id, p.fecha, p.hora, p.nombre_cliente
      `,
      [restaurantId]
    );

    // Procesamos los resultados para asegurar un JSON válido
    return rows.map((row) => ({
      id: row.id,
      fecha: row.fecha,
      hora: row.hora,
      nombre_cliente: row.nombre_cliente,
      estado: row.estado,
      total: `$${row.total.toLocaleString()}`,
      platillos: JSON.parse(row.platillos).filter(
        (item) => item !== null && item.platillo_id !== null
      ),
    }));
  }

  async findOrderById(pedidoId) {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.fecha,
        p.hora,
        p.nombre_cliente,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'platillo_id', pp.platillo_id,
              'nombre', pl.nombre,
              'cantidad', pp.cantidad,
              'estado', pp.estado,
              'total', CONCAT('$', FORMAT(pp.total, 0))
            )
          ),
          '[]'
        ) AS platillos,
        IFNULL(SUM(pp.total), 0) AS total
      FROM pedido p
      LEFT JOIN platillo_has_pedido pp ON p.id = pp.pedido_id
      LEFT JOIN platillo pl ON pp.platillo_id = pl.id
      WHERE p.id = ?
      GROUP BY p.id, p.fecha, p.hora, p.nombre_cliente
      `,
      [pedidoId]
    );

    if (!rows.length) {
      throw new Error(`Pedido con ID ${pedidoId} no encontrado.`);
    }

    const row = rows[0];
    return {
      id: row.id,
      fecha: row.fecha,
      hora: row.hora,
      nombre_cliente: row.nombre_cliente,
      total: `$${row.total.toLocaleString()}`,
      platillos: JSON.parse(row.platillos).filter(
        (item) => item !== null && item.platillo_id !== null
      ),
    };
  }
  /**
   * Busca todos los platillos asociados a un pedido específico.
   * @param {number} pedidoId - ID del pedido.
   * @returns {Promise<Object[]>} - Lista de platillos asociados al pedido.
   */
  async findOrderById(pedidoId) {
    // Primero obtenemos la información básica del pedido
    const [orderInfo] = await pool.query(
      `SELECT id, fecha, hora, nombre_cliente
       FROM pedido 
       WHERE id = ?`,
      [pedidoId]
    );

    if (!orderInfo || orderInfo.length === 0) {
      throw new Error(`Pedido con ID ${pedidoId} no encontrado.`);
    }

    // Luego obtenemos los platillos del pedido
    const [platillos] = await pool.query(
      `SELECT 
        pl.nombre,
        pp.cantidad,
        pp.estado,
        pp.total,
        CONCAT('$', FORMAT(pp.total, 0)) as precio_formateado
       FROM platillo_has_pedido pp
       JOIN platillo pl ON pp.platillo_id = pl.id
       WHERE pp.pedido_id = ?
       ORDER BY pl.nombre`,
      [pedidoId]
    );

    // Formateamos la lista de platillos de manera más legible
    const platillosFormateados = platillos.map((item) => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      estado: item.estado,
      precio: item.precio_formateado,
    }));

    return {
      pedido: {
        id: orderInfo[0].id,
        fecha: orderInfo[0].fecha,
        hora: orderInfo[0].hora,
        cliente: orderInfo[0].nombre_cliente,
        total: `$${platillos
          .reduce((sum, item) => sum + parseFloat(item.total), 0)
          .toLocaleString()}`,
        items: platillosFormateados,
      },
    };
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
   * @param {Object} orderData - Datos del pedido (se espera que contenga 'nombre_cliente').
   * @param {Array} platillos - Lista de platillos.
   * @returns {Promise<Object>} - Detalles del pedido creado.
   */
  async create(orderData, platillos) {
    const { nombre_cliente } = orderData;

    if (!platillos || platillos.length === 0) {
      throw new AppError("El pedido debe contener al menos un platillo.", 400);
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Crear pedido usando nombre_cliente en lugar de mesa_id
      const [pedidoResult] = await connection.query(
        `INSERT INTO pedido (fecha, hora, nombre_cliente) VALUES (CURRENT_DATE(), CURRENT_TIME(), ?)`,
        [nombre_cliente]
      );
      const pedidoId = pedidoResult.insertId;

      // Obtener los precios y existencias de los platillos
      const platilloIds = platillos.map((p) => p.platilloId);
      const [precioRows] = await connection.query(
        `SELECT id AS platilloId, precio, existencias FROM platillo WHERE id IN (?)`,
        [platilloIds]
      );

      if (precioRows.length !== platilloIds.length) {
        throw new AppError(
          "Uno o más platillos no existen en la base de datos.",
          404
        );
      }

      // Verificar existencias y preparar los valores para la inserción
      const platilloValues = platillos.map(({ platilloId, cantidad }) => {
        const precioRow = precioRows.find(
          (row) => row.platilloId === platilloId
        );
        const precioUnitario = precioRow.precio;
        const existencias = precioRow.existencias;

        if (cantidad > existencias) {
          throw new AppError(
            `La cantidad solicitada para el platillo con ID ${platilloId} excede las existencias disponibles.`,
            400
          );
        }

        const total = cantidad * precioUnitario;

        return [platilloId, pedidoId, cantidad, state.Pedido.PENDIENTE, total];
      });

      // Descontar las existencias de los platillos
      for (const { platilloId, cantidad } of platillos) {
        await connection.query(
          `UPDATE platillo SET existencias = existencias - ? WHERE id = ?`,
          [cantidad, platilloId]
        );
      }

      // Crear los registros en platillo_has_pedido
      await connection.query(
        `INSERT INTO platillo_has_pedido (platillo_id, pedido_id, cantidad, estado, total) VALUES ?`,
        [platilloValues]
      );

      await connection.commit();

      return { id: pedidoId, nombre_cliente, estado: state.Pedido.PENDIENTE };
    } catch (error) {
      await connection.rollback();
      throw new AppError(`Error al crear el pedido: ${error.message}`, 500);
    } finally {
      connection.release();
    }
  }
  async cancelOrder(pedidoId, platilloId = null) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verificar si el pedido existe
      const [orderExists] = await connection.query(
        "SELECT id FROM pedido WHERE id = ?",
        [pedidoId]
      );

      if (!orderExists.length) {
        throw new AppError(`Pedido con ID ${pedidoId} no encontrado.`, 404);
      }

      // Si se proporciona platilloId, cancelar solo ese platillo
      if (platilloId) {
        // Obtener información del platillo antes de cancelarlo
        const [platilloInfo] = await connection.query(
          `SELECT cantidad, platillo_id, estado 
           FROM platillo_has_pedido 
           WHERE pedido_id = ? AND platillo_id = ?`,
          [pedidoId, platilloId]
        );

        if (!platilloInfo.length) {
          throw new AppError(
            `Platillo ${platilloId} no encontrado en el pedido ${pedidoId}`,
            404
          );
        }

        if (platilloInfo[0].estado === "CANCELADO") {
          throw new AppError("Este platillo ya está cancelado", 400);
        }

        // Actualizar el estado del platillo a CANCELADO
        await connection.query(
          `UPDATE platillo_has_pedido 
           SET estado = 'CANCELADO' 
           WHERE pedido_id = ? AND platillo_id = ?`,
          [pedidoId, platilloId]
        );

        // Devolver las existencias al inventario
        await connection.query(
          `UPDATE platillo 
           SET existencias = existencias + ? 
           WHERE id = ?`,
          [platilloInfo[0].cantidad, platilloId]
        );
      } else {
        // Cancelar todo el pedido
        // Primero obtener todos los platillos del pedido que no estén cancelados
        const [platillos] = await connection.query(
          `SELECT cantidad, platillo_id, estado 
           FROM platillo_has_pedido 
           WHERE pedido_id = ? AND estado != 'CANCELADO'`,
          [pedidoId]
        );

        // Actualizar todos los platillos a CANCELADO
        await connection.query(
          `UPDATE platillo_has_pedido 
           SET estado = 'CANCELADO' 
           WHERE pedido_id = ?`,
          [pedidoId]
        );

        // Devolver las existencias al inventario para cada platillo
        for (const platillo of platillos) {
          await connection.query(
            `UPDATE platillo 
             SET existencias = existencias + ? 
             WHERE id = ?`,
            [platillo.cantidad, platillo.platillo_id]
          );
        }
      }

      await connection.commit();
      return {
        message: platilloId
          ? `Platillo ${platilloId} cancelado exitosamente del pedido ${pedidoId}`
          : `Pedido ${pedidoId} cancelado exitosamente`,
      };
    } catch (error) {
      await connection.rollback();
      throw new AppError(error.message, error.statusCode || 500);
    } finally {
      connection.release();
    }
  }
}

module.exports = new OrderRepository();

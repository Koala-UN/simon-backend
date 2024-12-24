
const pool = require('../../database/database');
const OrderRepositoryInterface = require('../../domain/interfaces/order/RepositoryInterface');



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
     * Actualiza el estado de todos los registros asociados a un pedido en la tabla muchos a muchos.
     *
     * @param {number} id - El ID del pedido.
     * @param {string} newStatus - El nuevo estado para los registros relacionados.
     * @returns {Promise<Object>} - Detalles del pedido actualizado.
     * @throws {Error} - Si no se encuentra el pedido.
     */
    async updateStatusById(id, newStatus) {
        // Verificar si el pedido existe
        const [order] = await pool.query(`SELECT id FROM pedido WHERE id = ?`, [id]);
        if (order.length === 0) {
            throw new Error(`Pedido con ID ${id} no encontrado.`);
        }

        // Actualizar el estado en la tabla muchos a muchos
        const [updateResult] = await pool.query(
            `UPDATE platillo_has_pedido SET estado = ? WHERE pedido_id = ?`,
            [newStatus, id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error(`No se encontraron registros relacionados para el pedido con ID ${id}.`);
        }

        return { id, estado: newStatus };
    }
    
}

module.exports = new OrderRepository();

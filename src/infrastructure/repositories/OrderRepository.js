
const pool = require('../../database/database');
const OrderRepositoryInterface = require('../../domain/interfaces/order/RepositoryInterface');



class OrderRepository extends OrderRepositoryInterface {
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
}

module.exports = new OrderRepository();

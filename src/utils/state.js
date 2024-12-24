/**
 * @typedef {Object} State
 * @property {Object} Restaurante - Estados posibles para un restaurante
 * @property {string} Restaurante.ACTIVO - Inscripción activa
 * @property {string} Restaurante.INACTIVO - Inscripción inactiva
 * @property {Object} Reservas - Estados posibles para reservas
 * @property {string} Reservas.PENDIENTE - Reserva en proceso de confirmación
 * @property {string} Reservas.RESERVADO - Reserva confirmada
 * @property {string} Reservas.CANCELADO - Reserva cancelada
 * @property {Object} Pedido - Estados posibles para pedidos
 * @property {string} Pedido.ENTREGADO - Pedido completado
 * @property {string} Pedido.PENDIENTE - Pedido en proceso
 */
const state = {
    // Estados posibles para un restaurante
    Restaurante: {
        ACTIVO: "ACTIVO", // Inscripción activa
        INACTIVO: "INACTIVO", // Inscripción inactiva
    },
    // Estados posibles para reservas
    Reservas: {
        PENDIENTE: "PENDIENTE", // Reserva en proceso de confirmación
        RESERVADO: "RESERVADO", // Reserva confirmada
        CANCELADO: "CANCELADO", // Reserva cancelada
    },
    // Estados posibles para pedidos
    Pedido: {
        ENTREGADO: "ENTREGADO", // Pedido completado
        PENDIENTE: "PENDIENTE", // Pedido en proceso
    },
};

Object.freeze(state);

module.exports = state;

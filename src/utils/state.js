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

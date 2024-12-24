const state = require('../../utils/state');
class Order {
    constructor(data = {}) {
        this.id = data.id || null;
        this.fecha = data.fecha || null;
        this.hora = data.hora || null;
        this.mesaId = data.mesa_id || null;
        this.estado = data.estado || state.Pedido.PENDIENTE; // Valor por defecto
        this.total = data.total || null;

        // Validar el estado al asignarlo
        // Validar el estado recibido usando el enum
        const validStates = Object.values(state.Pedido);
        if (!validStates.includes(this.estado)) {
            throw new Error(`Estado inválido para Order: ${this.estado}`);
        }
    }

    static fromDB(data) {
        return new Order(data);
    }
}

module.exports = Order;

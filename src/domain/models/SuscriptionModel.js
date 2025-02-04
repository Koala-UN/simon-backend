class Suscription {
  constructor({ id, tipo, fecha_suscripcion, fecha_vencimiento }) {
    this.id = id || null;
    this.tipo = tipo || "MENSUAL";
    this.fecha_suscripcion = fecha_suscripcion || null;
    this.fecha_vencimiento = fecha_vencimiento || null;
  }
  toJSON() {
    return {
      id: this.id,
      tipo: this.tipo,
      fecha_suscripcion: this.fecha_suscripcion,
      fecha_vencimiento: this.fecha_vencimiento,
    };
  }
  static fromDB(row) {
    return new Suscription({
      id: row.suscripcion_id,
      tipo: row.suscripcion_tipo,
      fecha_suscripcion: row.suscripcion_fecha_suscripcion,
      fecha_vencimiento: row.suscripcion_fecha_vencimiento,
    });
  }
}

module.exports = Suscription;

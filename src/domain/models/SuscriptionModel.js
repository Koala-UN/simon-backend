
class Suscription {
    constructor({id,tipo,fechaSuscripcion, fechaVencimiento,
        }){
        this.id = id || null;
        this.tipo = tipo || "MENSUAL";
        this.fechaSuscripcion = fechaSuscripcion || null;
        this.fechaVencimiento = fechaVencimiento || null;
        }
        toJSON(){
            return {
                id: this.id,
                tipo: this.tipo,
                fechaSuscripcion: this.fechaSuscripcion,
                fechaVencimiento: this.fechaVencimiento,
            }
        }
    fromDB(row){
        return new Suscription({
            id: row.id,
            tipo: row.tipo,
            fechaSuscripcion: row.fechaSuscripcion,
            fechaVencimiento: row.fechaVencimiento,
        });
    }

    
}
module.exports = Suscription;
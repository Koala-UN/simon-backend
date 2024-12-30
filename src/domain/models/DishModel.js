const category = require("../../utils/cagetory");
class Dish {
  /**
   * Crea una instancia de DishModel.
   *
   * @constructor
   * @param {Object} data - Los datos para inicializar el modelo de plato.
   * @param {number} [data.id=null] - El identificador único del plato.
   * @param {string} [data.nombre=null] - El nombre del plato.
   * @param {string} [data.descripcion=null] - La descripción del plato.
   * @param {number} [data.precio=null] - El precio del plato.
   * @param {number} [data.existencias=null] - La cantidad en stock del plato.
   * @param {number} [data.restauranteId=null] - El identificador único del restaurante.
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.nombre = data.nombre || null;
    this.descripcion = data.descripcion || null;
    this.precio = data.precio || null;
    this.existencias = data.existencias || null;
    this.restauranteId = data.restauranteId || null;
    this.categoria = data.categoria || null;

    this.validateCategory();
  }
  validateCategory() {
    // Verificar si la categoría existe en category.Platillo
    const validCategories = Object.values(category.Platillo);
    if (this.categoria && !validCategories.includes(this.categoria)) {
      throw new Error(
        `La categoría '${
          this.categoria
        }' no es válida. Opciones: ${validCategories.join(", ")}`
      );
    }
  }
  /**
   * Crea una instancia de Dish a partir de una fila de la base de datos.
   * @param {Object} row - Fila de la base de datos.
   * @returns {Dish} Instancia de Dish.
   */
  static fromDB(row) {
    return new Dish({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: row.precio,
      existencias: row.existencias,
      restauranteId: row.restaurante_id,
      categoria: row.categoria,
    });
  }

  /**
   * Convierte la instancia de Dish a un objeto JSON.
   * @returns {Object} Objeto JSON.
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      existencias: this.existencias,
      restauranteId: this.restauranteId,
      categoria: this.categoria,
    };
  }
}

module.exports = Dish;

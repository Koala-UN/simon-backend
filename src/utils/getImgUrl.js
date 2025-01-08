const restaurant = require("../../assets/json/restaurantMap.json");
const dish = require("../../assets/json/dishMap.json");

/**   ✅ Función getUrl(url) que retorna una URL basada en la categoría**/
function getImgUrl(categoryKey, type = "restaurant") {
  const categoryUrlMap =
    type === "restaurant"
      ? restaurant[categoryKey] ?? restaurant.Cafetería
      : type === "dish"
      ? dish[categoryKey]
      : dish.Entradas;
  return categoryUrlMap[categoryKey] ?? restaurant.Cafetería;
}

module.exports = { getImgUrl };

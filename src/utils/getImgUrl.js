const restaurant = require("../../assets/json/restaurantMap.json");
const dish = require("../../assets/json/dishMap.json");

/**   ✅ Función getUrl(url) que retorna una URL basada en la categoría**/
function getImgUrl(categoryKey, type ) {
  const categoryUrlMap =
    type === "restaurant"
      ? restaurant[categoryKey]
      : type === "dish"
      ? dish[categoryKey]
      : null;
  return categoryUrlMap;
}

module.exports = getImgUrl;

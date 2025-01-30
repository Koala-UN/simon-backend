const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const restaurant = require("../../assets/json/restaurantMap.json");
const dish = require("../../assets/json/dishMap.json");

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


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


// Función para subir una imagen
/**
 * 
 * @param {string} email - Correo del restaurante
 * @param {string} type - Tipo de imagen, ya sea pp (profile photo) o dish o drink o restaurant (fotos del restaurante) según el caso
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de la imagen subida
 */
async function UploadImg(email, type, file) {
  const user = email.split("@")[0]; // Obtenemos el nombre del usuario
  const tags = [user, type]; // Creamos un array con los dos tags

  const result = await cloudinary.uploader.upload(file, {
    tags: tags // Asignamos los tags a la imagen
  });

  return result.url; // Retornamos la URL de la imagen subida
}

// Función para buscar imágenes
/**
 * 
 * @param {string} email - Correo del restaurante
 * @param {string} type - Tipo de imagen, ya sea pp (profile photo) o dish o drink o restaurant (fotos del restaurante) según el caso
 * @returns {Promise<string>} - URL de la imagen subida
 */
async function searchImg(email, type) {
  const user = email.split("@")[0]; // Obtenemos el nombre del usuario
  const resultados = await cloudinary.search
    .expression(`tags:${user} AND tags:${type}`) // Buscamos por ambos tags
    .execute();

  return resultados.resources;
}

module.exports = {getImgUrl,
  UploadImg,
  searchImg,
  upload,
};

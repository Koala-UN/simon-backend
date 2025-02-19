const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dish = require( '../../assets/json/dishMap.json');
const restaurant =  require('../../assets/json/restaurantMap.json');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limite de tamaño de archivo de 5MB


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
 * @param {string} type - Tipo de imagen, ya sea 'profile' (profile photo) o dish o drink o restaurant (fotos del restaurante) según el caso
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL de la imagen subida
 */
async function uploadImg(email, type, file) {
  const user = email.split("@")[0]; // Obtenemos el nombre del usuario
  const tags = [user, type]; // Creamos un array con los dos tags

  return new Promise((resolve, reject) => {
    const options = { tags: tags };

    // Si el tipo es "profile", añadimos las transformaciones para optimizar y recortar la imagen
    if (type === 'profile') {
      options.transformation = [
        { width: 512, height: 512, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'png' }
      ];
    }

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(new Error('Error al subir la imagen a Cloudinary'));
      } else {
        resolve(result.url); // Resolvemos la promesa con la URL de la imagen subida
      }
    });

    // Pasar el buffer del archivo al stream de Cloudinary
    stream.end(file.buffer);
  });
}

module.exports = {
  uploadImg,
  getImgUrl,
  upload,
};
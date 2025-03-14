const cloudinary = require('cloudinary').v2;
const multer = require('multer');
// usar p-limit
// const pLimit = require('p-limit');
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
const upload = multer({ storage: storage, limits: { fileSize: 1048576 * ( 5 ) } }); // Limite de tamaño de archivo de 5MB


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

    getOptimizedOptions(type, options);

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(new Error('Error al subir la imagen a Cloudinary' + error));
      } else {
        const httpsUrl = convertToHttps(result.url);
        console.log('Subiendo imagen a Cloudinary exito: ', httpsUrl);
        resolve(httpsUrl); // Resolvemos la promesa con la URL de la imagen subida
      }
    });

    // Pasar el buffer del archivo al stream de Cloudinary
    stream.end(file.buffer);
  });
}


// // Función para subir múltiples imágenes utilizando p-limit
// /**
//  * 
//  * @param {string} email - Correo del restaurante
//  * @param {string} type - Tipo de imagen, ya sea 'profile' (profile photo) o dish o drink o restaurant (fotos del restaurante) según el caso
//  * @param {Array<File>} files - Array de archivos de imagen
//  * @returns {Promise<Array<string>>} - Array de URLs de las imágenes subidas
//  */
// async function uploadMultipleImgs(email, type, files) {
  
//   const limit = pLimit(5); // Limitar a 5 peticiones concurrentes
//   const uploadPromises = files.map(file => {
//     return limit(async () => {
//       const imageUrl = await uploadImg(email, type, file);
//       return imageUrl;
//     });
//   });

//   return Promise.all(uploadPromises);
// }

/**
 * Función para subir múltiples imágenes sin usar p-limit
 * @param {string} email - Correo del restaurante
 * @param {string} type - Tipo de imagen, ya sea 'profile' (profile photo) o dish o drink o restaurant (fotos del restaurante) según el caso
 * @param {Array<File>} files - Array de archivos de imagen
 * @returns {Promise<Array<string>>} - Array de URLs de las imágenes subidas
 */
async function uploadMultipleImgs(email, type, files) {
  const uploadPromises = files.map(async (file) => {
    const imageUrl = await uploadImg(email, type, file);
    return imageUrl;
  });

  return Promise.all(uploadPromises);
}

// hagamos la funcion para mutliples imagenes usando

// updateMultipleImages
async function updateMultipleImgs(email, type, files) {
  const user = email.split('@')[0]; // Obtenemos el nombre del usuario
  console.log('Actualizando múltiples imágenes en Cloudinary: ', files, email, type);
  const updatePromises = files.map(async (file, index) => {
    const publicId = file.split('/').pop().split('.')[0]; // Extraer el publicId de la URL
    const newTags = [user, type, `index_${index + 1}`]; // Crear los nuevos tags
    console.log(" aqui los tags", newTags);

    return new Promise((resolve, reject) => {
      // Primero, eliminamos todos los tags existentes
      cloudinary.uploader.remove_all_tags(publicId, (error, result) => {
        if (error) {
          console.error('Error al eliminar los tags de la imagen en Cloudinary:', error);
          reject(new Error('Error al eliminar los tags de la imagen en Cloudinary: ' + error.message));
        } else {
          // Luego, agregamos los nuevos tags
          cloudinary.uploader.add_tag(newTags.join(','), publicId, (error, result) => {
            if (error) {
              console.error('Error al actualizar los tags de la imagen en Cloudinary:', error);
              reject(new Error('Error al actualizar los tags de la imagen en Cloudinary: ' + error.message));
            } else {
              console.log('Tags actualizados con éxito:', result);
              resolve(result);
            }
          });
        }
      });
    });
  });

  return Promise.all(updatePromises);
}
/**
 * Función para eliminar una imagen de Cloudinary
 * @param {string} publicId - ID público de la imagen en Cloudinary
 * @returns {Promise<void>}
 */
async function deleteImg(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(new Error('Error al eliminar la imagen de Cloudinary'));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Función para eliminar imágenes de Cloudinary basadas en el correo y el tipo
 * @param {string} email - Correo del restaurante
 * @param {string} type - Tipo de imagen, ya sea 'profile', 'dish', 'drink', 'restaurant' o '*' para eliminar todas
 * @returns {Promise<void>}
 */
async function deleteImgsByEmailAndType(email, type) {
  const user = email.split("@")[0]; // Obtenemos el nombre del usuario
  const tag = user;

  return new Promise((resolve, reject) => {
    cloudinary.api.resources_by_tag(tag, (error, result) => {
      if (error) {
        reject(new Error('Error al obtener las imágenes de Cloudinary'));
      } else {
        const resources = result.resources;
        const publicIdsToDelete = resources
          .filter(resource => type === '*' || type === 'all' || resource.tags.includes(type))
          .map(resource => resource.public_id);

        if (publicIdsToDelete.length === 0) {
          resolve();
          return;
        }

        cloudinary.api.delete_resources(publicIdsToDelete, (deleteError, deleteResult) => {
          if (deleteError) {
            reject(new Error('Error al eliminar las imágenes de Cloudinary'));
          } else {
            resolve();
          }
        });
      }
    });
  });
}

/**
 * Función para eliminar una imagen de Cloudinary usando la URL
 * @param {string} url - URL de la imagen en Cloudinary
 * @returns {Promise<void>}
 */
async function deleteImgByUrl(url) {
  if (!isCloudinaryUrl(url)) return url; // Verificar si la URL es de Cloudinary

  const publicId = url.split('/').pop().split('.')[0]; // Extraer el publicId de la URL
  return deleteImg(publicId);
}

/**
 * Función para actualizar una imagen en Cloudinary
 * @param {string} url - URL de la imagen actual en Cloudinary
 * @param {string} email - Correo del restaurante
 * @param {string} type - Tipo de imagen, ya sea 'profile', 'dish', 'drink', 'restaurant'
 * @param {File} file - Archivo de imagen nuevo
 * @returns {Promise<string>} - URL de la nueva imagen subida
 */
async function updateImg(url, email, type, file) {
  const publicId = url.split('/').pop().split('.')[0]; // Extraer el publicId de la URL

  return new Promise((resolve, reject) => {
    const options = {
      public_id: publicId,
      invalidate: true,
      tags: [email.split("@")[0], type]
    };

    // Si el tipo es "profile", añadimos las transformaciones para optimizar y recortar la imagen
    options = getOptimizedOptions(type, options);

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(new Error('Error al actualizar la imagen en Cloudinary'));
      } else {
        const httpsUrl = convertToHttps(result.url);
        resolve(httpsUrl); // Resolvemos la promesa con la URL de la imagen actualizada
      }
    });

    // Pasar el buffer del archivo al stream de Cloudinary
    stream.end(file.buffer);
  });
}

// Función para obtener imágenes de Cloudinary basadas en el correo, el tipo y la etiqueta de indexación
async function getImagesByEmailTypeAndIndex(email, type) {
  const user = email.split('@')[0]; // Obtenemos el nombre del usuario
  const tags = [user, type]; // Creamos un array con los tags

  return new Promise((resolve, reject) => {
    const expression = tags.map(tag => `tags:${tag}`).join(' AND ');
    cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute()
      .then(result => {
        const resources = result.resources;
        const indexedResources = resources.map(resource => {
          if (resource.tags) {
            const indexTag = resource.tags.find(tag => tag.startsWith('index_'));
            const index = indexTag ? parseInt(indexTag.split('_')[1], 10) : null;
            return { ...resource, index };
          } else {
            return { ...resource, index: null };
          }
        });

        indexedResources.sort((a, b) => a.index - b.index);

        const urls = indexedResources.map(resource => convertToHttps(resource.url));

        resolve(urls);
      })
      .catch(error => {
        console.error('Error al obtener las imágenes de Cloudinary:', error);
        reject(new Error('Error al obtener las imágenes de Cloudinary: ' + error.message));
      });
  });
}

// Función para obtener imágenes de Cloudinary basadas en el correo y el tipo
async function getImagesByEmailAndType(email, type) {
  const user = email.split('@')[0]; // Obtenemos el nombre del usuario
  const tags = [user, type]; // Creamos un array con los tags

  return new Promise((resolve, reject) => {
    const expression = tags.map(tag => `tags:${tag}`).join(' AND ');
    cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute()
      .then(result => {
        const resources = result.resources;

        if (type === 'restaurant') {
          // Ordenar por el tag de índice
          const indexedResources = resources.map(resource => {
            if (resource.tags) {
              const indexTag = resource.tags.find(tag => tag.startsWith('index_'));
              const index = indexTag ? parseInt(indexTag.split('_')[1], 10) : null;
              return { ...resource, index };
            } else {
              return { ...resource, index: null };
            }
          });

          indexedResources.sort((a, b) => a.index - b.index);

          const urls = indexedResources.map(resource => convertToHttps(resource.url));
          resolve(urls);
        } else {
          // Si no es "restaurant", devolver las URLs sin ordenar
          const urls = resources.map(resource => convertToHttps(resource.url));
          resolve(urls);
        }
      })
      .catch(error => {
        console.error('Error al obtener las imágenes de Cloudinary:', error);
        reject(new Error('Error al obtener las imágenes de Cloudinary: ' + error.message));
      });
  });
}

// Función para obtener opciones de optimización y recorte
function getOptimizedOptions(type, options) {
  if (type === 'profile') {
    options.transformation = [
      { width: 512, height: 512, crop: 'fill', gravity: 'face', quality: 'auto' }
    ];
  } else if (type === 'restaurant') {
    options.transformation = [
      // no recortar, solo optimizar lo necesario
      { quality: 'auto' }
    ];
  }
  return options;
}

// funcion para convertir http en https a un string de un link
function convertToHttps(url) {
  return url ? url.replace('http://', 'https://'): url;
}

function isCloudinaryUrl(url) {
  // Verificar si la URL es de Cloudinary, ser muy preciso, quisaz usar regex
  return (url && url.includes('res.cloudinary.com') && url.includes('/image/upload/'));
}


module.exports = {
  getImgUrl,
  uploadImg,
  uploadMultipleImgs,
  upload,
  deleteImg,
  deleteImgsByEmailAndType,
  deleteImgByUrl,
  updateImg,
  updateMultipleImgs,
  getImagesByEmailAndType,
  getImagesByEmailTypeAndIndex,
  convertToHttps,
};
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const pLimit = require('p-limit');
const dish = require('../../assets/json/dishMap.json');
const restaurant = require('../../assets/json/restaurantMap.json');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Multer para manejar la subida de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1048576 * 5 } }); // Limite de tamaño de archivo de 5MB

/**   ✅ Función getUrl(url) que retorna una URL basada en la categoría **/
function getImgUrl(categoryKey, type) {
  const categoryUrlMap =
    type === 'restaurant'
      ? restaurant[categoryKey]
      : type === 'dish'
      ? dish[categoryKey]
      : null;
  return categoryUrlMap;
}

// Función para subir una imagen
async function uploadImg(email, type, file, index) {
  const user = email.split('@')[0]; // Obtenemos el nombre del usuario
  console.log('uploadImg - Subiendo imagen a Cloudinary: ', file, email, type);

  // Si el índice no está definido, no incluir el tag de indexación
  const tags = [user, type];
  if (index !== undefined && index !== null) {
    tags.push(`index_${index}`);
  }
  console.log("OJOOOO TAGS EN uploadImg", tags);

  return new Promise((resolve, reject) => {
    const options = { tags: tags };

    getOptimizedOptions(type, options);
    console.log('Subiendo imagen a Cloudinary un segundo antes: ', file, email, type);

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.log('Error al subir la imagen a Cloudinary: ', error);
        reject(new Error('Error al subir la imagen a Cloudinary'));
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

// Función para obtener el último índice de las imágenes existentes
async function getLastIndex(email, type) {
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
        const indices = resources.map(resource => {
          if (resource.tags) {
            const indexTag = resource.tags.find(tag => tag.startsWith('index_'));
            console.log("OJOOOO indextag en getLast index: ", tags);
            return indexTag ? parseInt(indexTag.split('_')[1], 10) : 0;
          } else {
            return 0;
          }
        });
        const lastIndex = Math.max(...indices, 0);
        resolve(lastIndex);
      })
      .catch(error => {
        console.error('Error al obtener las imágenes de Cloudinary:', error);
        reject(new Error('Error al obtener las imágenes de Cloudinary: ' + error.message));
      });
  });
}

// Función para subir múltiples imágenes utilizando p-limit
async function uploadMultipleImgs(email, type, files) {
  console.log('Subiendo múltiples imágenes a Cloudinary: ', files, email, type);

  try {
    const lastIndex = await getLastIndex(email, type);
    console.log('Último índice encontrado: ', lastIndex);

    const uploadPromises = files.map(async (file, index) => {
      console.log('uploadMultipleImgs - Subiendo imagen a Cloudinary: ', file, email, type);
      const imageUrl = await uploadImg(email, type, file, lastIndex + index + 1); // Pasar el índice como parámetro
      return imageUrl;
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error al subir las imágenes:', error);
    throw new Error('Error al subir las imágenes: ' + error.message);
  }
}

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

// Función para eliminar una imagen de Cloudinary
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

// Función para eliminar imágenes de Cloudinary basadas en el correo y el tipo
async function deleteImgsByEmailAndType(email, type) {
  const user = email.split('@')[0]; // Obtenemos el nombre del usuario
  const tag = user;

  return new Promise((resolve, reject) => {
    cloudinary.api.resources_by_tag(tag, (error, result) => {
      if (error) {
        reject(new Error('Error al obtener las imágenes de Cloudinary'));
      } else {
        const resources = result.resources;
        const publicIdsToDelete = resources
          .filter(resource => type === '*' || type === 'all' || (resource.tags && resource.tags.includes(type)))
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

// Función para eliminar una imagen de Cloudinary usando la URL
async function deleteImgByUrl(url) {
  const publicId = url.split('/').pop().split('.')[0]; // Extraer el publicId de la URL
  return deleteImg(publicId);
}

// Función para actualizar una imagen en Cloudinary
async function updateImg(url, email, type, file) {
  const publicId = url.split('/').pop().split('.')[0]; // Extraer el publicId de la URL

  return new Promise((resolve, reject) => {
    const options = {
      public_id: publicId,
      invalidate: true,
      tags: [email.split('@')[0], type]
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
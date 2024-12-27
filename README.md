# simon-backend


SIMO-BACKEND es un backend en Node.js con Express para gestionar una base de datos MySQL.

---

## **Dependencias utilizadas**
Este proyecto utiliza las siguientes dependencias:
- **`express`**: Framework para crear y manejar el backend.
- **`mysql2`**: Cliente para conectarse a la base de datos MySQL.
- **`dotenv`**: Manejo de variables de entorno.
- **`nodemon`**: Reinicio automático del servidor en desarrollo.
- **`cors`**: Habilita el acceso desde otros orígenes para peticiones HTTP.
- **`jest`**: Framework de pruebas para JavaScript.
- **`supertest`**: Biblioteca para probar aplicaciones HTTP.
---

## **Instalación**

1. Clona el repositorio, navega a la carpeta del proyecto, instala las dependencias necesarias y configura las variables de entorno:
   ```bash
   git clone https://github.com/Koala-UN/simon-backend.git
   cd simon-backend
   - npm install
   - npm install <dependencias a instalar>

## **Separación de Responsabilidades**:

   - Modelos (Models): Representan las entidades del dominio.
   - Servicios (Services): Contienen la lógica de negocio.
   - Repositorios (Repositories): Manejan la persistencia de datos.
   - Controladores (Controllers): Manejan las solicitudes HTTP y las respuestas.
   - Middleware (Middleware): Gestionan la lógica intermedia de las solicitudes, como el manejo de errores.
   - Interfaces (Interfaces): Definen contratos que aseguran que las implementaciones cumplan con ciertos métodos y propiedades.

const request = require('supertest');
const express = require('express');
const restaurantRoutes = require('../../infrastructure/routes/RestaurantRoutes');
const Restaurant = require('../../domain/models/RestaurantModel');
const restaurantService = require('../../domain/service/RestaurantService');

const app = express();
app.use(express.json());
app.use('/api/restaurants', restaurantRoutes);

jest.mock('../../domain/service/RestaurantService');

describe('Rutas de Restaurantes', () => {
  it('debería crear un nuevo restaurante', async () => {
    const restaurantData = { nombre: 'Test Restaurant', correo: 'test@example.com' };
    const addressData = { street: '123 Test St' };
    const cityId = 1;
    const newRestaurant = new Restaurant({ id: 1, ...restaurantData });

    restaurantService.createRestaurant.mockResolvedValue(newRestaurant);

    /**
     * Realiza una solicitud POST a la ruta '/api/restaurants' para crear un nuevo restaurante.
     * 
     * @param {Object} app - La instancia de la aplicación Express.
     * @param {Object} restaurantData - Los datos del restaurante que se van a enviar en la solicitud.
     * @param {Object} addressData - Los datos de la dirección del restaurante.
     * @param {number} cityId - El ID de la ciudad donde se encuentra el restaurante.
     * @returns {Object} res - El objeto de respuesta de la solicitud.
     * 
     * @description Esta prueba tiene como objetivo verificar que la ruta para crear un nuevo restaurante
     * funciona correctamente y que los datos enviados en la solicitud se procesan adecuadamente.
     */
    const res = await request(app)
      .post('/api/restaurants')
      .send({ restaurantData, addressData, cityId });

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(newRestaurant.toJSON());
  });

  it('debería obtener un restaurante por ID', async () => {
    const restaurantId = 1;
    const restaurant = new Restaurant({ id: restaurantId, nombre: 'Test Restaurant' });

    restaurantService.getRestaurantById.mockResolvedValue(restaurant);

    const res = await request(app).get(`/api/restaurants/${restaurantId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(restaurant.toJSON());
  });


});
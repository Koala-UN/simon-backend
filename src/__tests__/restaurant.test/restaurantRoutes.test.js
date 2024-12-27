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

  it('debería obtener todos los restaurantes por ciudad', async () => {
    const cityId = 1;
    const restaurants = [
      new Restaurant({ id: 1, nombre: 'Test Restaurant 1' }),
      new Restaurant({ id: 2, nombre: 'Test Restaurant 2' }),
    ];

    restaurantService.getAllRestaurantsByCity.mockResolvedValue(restaurants);

    const res = await request(app).get(`/api/restaurants/city/${cityId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(restaurants.map(r => r.toJSON()));
  });

  it('debería obtener todos los restaurantes por departamento', async () => {
    const departmentId = 1;
    const restaurants = [
      new Restaurant({ id: 1, nombre: 'Test Restaurant 1' }),
      new Restaurant({ id: 2, nombre: 'Test Restaurant 2' }),
    ];

    restaurantService.getAllRestaurantsByDepartment.mockResolvedValue(restaurants);

    const res = await request(app).get(`/api/restaurants/department/${departmentId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(restaurants.map(r => r.toJSON()));
  });

  it('debería obtener todos los restaurantes por país', async () => {
    const countryId = 1;
    const restaurants = [
      new Restaurant({ id: 1, nombre: 'Test Restaurant 1' }),
      new Restaurant({ id: 2, nombre: 'Test Restaurant 2' }),
    ];

    restaurantService.getAllRestaurantsByCountry.mockResolvedValue(restaurants);

    const res = await request(app).get(`/api/restaurants/country/${countryId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(restaurants.map(r => r.toJSON()));
  });

  it('debería eliminar un restaurante por ID', async () => {
    const restaurantId = 1;

    restaurantService.deleteRestaurant.mockResolvedValue();

    const res = await request(app).delete(`/api/restaurants/${restaurantId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Restaurante eliminado correctamente');
  });

  it('debería actualizar un restaurante por ID', async () => {
    const restaurantId = 1;
    const updates = { nombre: 'Updated Restaurant' };
    const updatedRestaurant = new Restaurant({ id: restaurantId, ...updates });

    restaurantService.updateRestaurant.mockResolvedValue(updatedRestaurant);

    const res = await request(app)
      .patch(`/api/restaurants/${restaurantId}`)
      .send(updates);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toEqual(updatedRestaurant.toJSON());
  });
});
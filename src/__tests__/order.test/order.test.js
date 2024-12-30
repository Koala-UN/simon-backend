const request = require('supertest');
const express = require('express');
const orderRoutes = require('../../infrastructure/routes/OrderRoutes');
const Order = require('../../domain/models/OrderModel');
const orderService = require('../../domain/service/OrderService');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

jest.mock('../../domain/service/OrderService');

describe('Rutas de Pedidos', () => {
  it('debería obtener todos los pedidos', async () => {
    const orders = [
      new Order({ id: 1, mesaId: 1 }),
      new Order({ id: 2, mesaId: 2 }),
    ];

    orderService.getAll.mockResolvedValue(orders);

    const res = await request(app).get('/api/orders');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(orders.map(order => order.toJSON()));
  });

  it('debería obtener un pedido por ID', async () => {
    const orderId = 1;
    const orderDetails = { id: orderId, platillos: [{ id: 1, nombre: 'Platillo 1' }] };

    orderService.getOrder.mockResolvedValue(orderDetails);

    const res = await request(app).get(`/api/orders/${orderId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(orderDetails);
  });


  it('debería crear un nuevo pedido', async () => {
    const orderData = { mesaId: 1 };
    const platillos = [{ platilloId: 1, cantidad: 2 }];
    const newOrder = new Order({ id: 1, ...orderData });

    orderService.createOrder.mockResolvedValue(newOrder);

    const res = await request(app)
      .post('/api/orders')
      .send({ mesaId: orderData.mesaId, platillos });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(newOrder.toJSON());
  });

  it('debería actualizar el estado de un platillo en un pedido', async () => {
    const pedidoId = 1;
    const platilloId = 1;
    const estado = 'Preparado';
    const result = { message: 'Estado actualizado correctamente.' };

    orderService.updatePlatilloStatus.mockResolvedValue(result);

    const res = await request(app)
      .put(`/api/orders/${pedidoId}/platillo/${platilloId}`)
      .send({ estado });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(result);
  });
});
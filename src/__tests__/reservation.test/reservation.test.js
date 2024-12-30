const request = require("supertest");
const express = require("express");
const reservationRoutes = require("../../infrastructure/routes/ReservationRoutes");
const Reservation = require("../../domain/models/ReservationModel");
const reservationService = require("../../domain/service/ReservationService");
const AppError = require('../../domain/exception/AppError');
const app = express();
app.use(express.json());
app.use("/api/reservations", reservationRoutes);

jest.mock("../../domain/service/ReservationService");

describe("Rutas de Reservas", () => {
  it("debería obtener todas las reservas", async () => {
    const reservations = [
      new Reservation({ id: 1, nombre: "Test Reservation 1" }),
      new Reservation({ id: 2, nombre: "Test Reservation 2" }),
    ];

    reservationService.getAll.mockResolvedValue(reservations);

    const res = await request(app).get("/api/reservations");

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual(reservations.map((r) => r.toJSON()));
  });

  it("debería crear una nueva reserva", async () => {
    const reservationData = {
      nombre: "Test Reservation",
      correo: "test@example.com",
    };
    const newReservation = new Reservation({ id: 1, ...reservationData });

    reservationService.createReservation.mockResolvedValue(newReservation);

    const res = await request(app)
      .post("/api/reservations")
      .send(reservationData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual(newReservation.toJSON());
  });

  it("debería asignar una mesa a una reserva", async () => {
    const reservationId = 1;
    const tableId = 1;

    reservationService.assignTable.mockResolvedValue();

    const res = await request(app).post(
      `/api/reservations/${reservationId}/table/${tableId}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Mesa asignada correctamente");
  });


  it("debería cancelar una reserva", async () => {
    const reservationId = 1;

    reservationService.cancelReservation.mockResolvedValue();

    const res = await request(app).post(
      `/api/reservations/${reservationId}/cancel`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Reserva cancelada correctamente");
  });

  it("debería obtener todas las reservas por restaurante", async () => {
    const restauranteId = 1;
    const reservations = [
      new Reservation({ id: 1, nombre: "Test Reservation 1" }),
      new Reservation({ id: 2, nombre: "Test Reservation 2" }),
    ];

    reservationService.getAllByRestaurant.mockResolvedValue(reservations);

    const res = await request(app).get(
      `/api/reservations/restaurant/${restauranteId}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual(reservations.map((r) => r.toJSON()));
  });

  it('debería producir un error si se asigna la misma reserva a la misma mesa', async () => {
    const reservationId = 1;
    const tableId = 1;

    reservationService.assignTable.mockRejectedValue(new AppError('La mesa ya está asignada a esta reserva', 400));

    const res = await request(app)
        .post(`/api/reservations/${reservationId}/table/${tableId}`);

    expect(res.statusCode).toEqual(400);
});

});

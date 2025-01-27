// infrastructure/routes/MercadoPagoRoutes.js
const express = require("express");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const router = express.Router();

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MERCADO_PAGO , // Coloca tu access token aquí
});

// Ruta de prueba
router.get("/", (req, res) => {
  res.send("Soy el server de Mercado Pago :)");
});

// Endpoint para crear una preferencia
router.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: req.body.quantity,
          unit_price: req.body.unit_price,
        },
      ],
      back_urls: {
        success: "https://github.com/Koala-UN/simon-backend",
        failure: "http://localhost:5173/",
        pending: "http://localhost:5173/",
      },
      auto_return: "approved",
      payment_methods: {
        installments: null,
      },
    };

    const preference = new Preference(client);
    const response = await preference.create({ body });
    res.json({ id: response.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Ocurrió un error al crear la preferencia.",
    });
  }
});

module.exports = router;

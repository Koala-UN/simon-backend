// infrastructure/routes/MercadoPagoRoutes.js
const express = require("express");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

const router = express.Router();

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MERCADO_PAGO, // Coloca tu access token aquí
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
      payment_methods: {
        installments: null,
      },
    };

    const preference = new Preference(client);
    const response = await preference.create({ body });
    res.json({ id: response.id,
      data: response,
     });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Ocurrió un error al crear la preferencia.",
    });
  }
});

router.post("/webhooks", async (req, res) => {
  const response =await req.body;
  const paymentId = response.data && response.data.id; // Extraer el ID correctamente
  console.log("Datos del solicitud: ", response);
  if (!paymentId) {
    return res
      .status(400)
      .json({ error: "No se recibió un paymentId válido en el webhook." });
  }

  try {
    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });

    res.status(200).json({ message: "Compra realizada con éxito",
      status: 200,
      statusText: "OK",
     });
    console.log("Webhook recibido correctamente para id: ", response.id);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Ocurrió un error al obtener el pago.",
    });
  }
});

module.exports = router;

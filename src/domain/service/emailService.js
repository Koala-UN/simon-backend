// utils/emailService.js
const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, 
      },
    });
  }

  async sendReservationConfirmation(reservationData,restaurant) {
    const mailOptions = {
      from: '"SIMON App" <koalasimonapp@gmail.com>',
      to: reservationData.correo,
      subject: "Confirmación de tu reserva en SIMON",
      html: `
        <h2>¡Tu reserva ha sido confirmada!</h2>
        <p>Hola ${reservationData.nombre},</p>
        <p>Hemos registrado tu reserva con los siguientes detalles:</p>
        <ul>
          <li><strong>Restaurante:</strong> ${restaurant.nombre}</li>
          <li><strong>Dirección:</strong> ${restaurant.address.direccion}</li>

          <li><strong>Fecha:</strong> ${reservationData.fecha}</li>
          <li><strong>Hora:</strong> ${reservationData.hora}</li>
          <li><strong>Cantidad de personas:</strong> ${reservationData.cantidad}</li>
          <li><strong>Teléfono:</strong> ${reservationData.telefono}</li>
          <li><strong>Cédula:</strong> ${reservationData.cedula || "No especificada"}</li>
        </ul>
        <p>Por favor, preséntate en el restaurante 5 minutos antes de la hora indicada y muestra este correo para identificarte.</p>
        <p>Si necesitas cancelar o modificar tu reserva, contacta directamente al restaurante.</p>
        <p>Gracias por usar SIMON. ¡Te esperamos!</p>
        <p><strong>Equipo SIMON</strong><br>Email: koalasimonapp@gmail.com</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo de confirmación enviado a ${reservationData.correo}`);
    } catch (error) {
      console.error(`Error al enviar correo: ${error.message}`);
      throw new Error("No se pudo enviar el correo de confirmación");
    }
  }
}

module.exports = new EmailService(); 
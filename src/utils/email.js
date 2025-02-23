const transporter = require('../config/emailConfig');
const config = require('../config/config');
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${config.app.frontendURL}/restaurant/verify-email?token=${token}`;
  
  const data = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verificación de correo electrónico',
    html: `<p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace: <a href="${verificationUrl}">Verificar correo</a></p>
    <br>
    <p>El enlace de verificación caducará en 1 hora.</p>
    <p> Si el tiempo caduco, por favor solicita otro enlace de verificación en el siguiente enlace: <a href="${config.app.frontendURL}/restaurant/verify-email-send">Solicitar otro enlace de verificación</a></p>
    
    <br>
    <p>Si no solicitaste la verificación de correo electrónico, ignora este mensaje.</p>
    
    <br>
    <p>Saludos,</p>
    <p>Equipo de Simon</p>
    <img src="https://res.cloudinary.com/dnljvvheg/image/upload/q_50/simon-logo" alt="logo"  height="100">
    
    `,
  };

  await sendEmail(data.to, data.subject, data.html);
};

const sendEmail = async (email, subject, htmlContent) => {
  console.log('Sending verficacion email to: ', email);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlContent
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred. ' + error.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
    });
};

module.exports = { sendVerificationEmail, sendEmail };
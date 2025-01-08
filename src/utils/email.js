const transporter = require('../config/emailConfig');

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.API_URL}/restaurant/verify-email?token=${token}`;
  
  const data = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verificación de correo electrónico',
    html: `<p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace: <a href="${verificationUrl}">Verificar correo</a></p>`
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
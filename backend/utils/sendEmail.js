const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: email,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

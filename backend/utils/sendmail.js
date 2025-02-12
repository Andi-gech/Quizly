const nodemailer = require("nodemailer");

const sendMail = async ({email, subject, message}) => {
  console.log(email, subject, message);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: "andi.fab23@gmail.com",
      pass: "jval cusp wplh hhnw",
    },
  });

  await transporter.sendMail({
    from: "Edu-Digital",
    to: email,
    subject: subject,
    html: message,
  });
};

module.exports = sendMail;
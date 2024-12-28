const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
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
    html: text,
  });
};

module.exports = sendMail;
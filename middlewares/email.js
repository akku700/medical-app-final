const nodemailer = require("nodemailer");


const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "akku29168@gmail.com",
      pass: "iswmbgxjzfahcrmi",
    },
  });

  const mailoptions = {
    from: "akku29168@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailoptions);
};

module.exports = sendEmail;

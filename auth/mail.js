const nodemailer = require("nodemailer");
require("dotenv").config();
const sendMail = async ({ people, notificationashtml, subject }) => {
  const transport = nodemailer.createTransport({
    service: "mailgun",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transport.sendMail({
    name: "mailgun.com",
    from: process.env.EMAIL_ADDRESS,
    bcc: people,
    subject,
    html: notificationashtml,
    maxMessages: 20,
    maxConnections: 25,
  });
};
module.exports = { sendMail };

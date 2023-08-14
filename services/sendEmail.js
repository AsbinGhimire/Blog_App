const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "ghimireasbin12@gmail.com",
      pass: "yluemsjexpwnlhxu",
    },
  });

  const mailOptions = {
    from: " Asbin Ghimire <ghimireasbin12@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: "Your otp is  " + options.otp,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
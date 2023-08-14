const { users, Blog, combineUser } = require("../model");
const sendEmail = require("../services/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.sendMail = async (req, res) => {
  const { email } = req.body;
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  const userExist = await combineUser.findAll({
    where: {
      email: email,
    },
  });
  console.log(userExist);

  if (userExist.length > 0) {
    console.log(req.body);
    userExist[0].otp = randomNumber;
    await userExist[0].save();

    await sendEmail({
      email: email,
      subject: "forgot password",
      otp: randomNumber,
    });
    res.redirect("/input_otp");
  } else {
    // console.log('errors appear');
    return res.json({ status: 404, message: "User not found" });

    // res.render('errors.ejs');
  }
};



exports.newPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  const userOTP = await combineUser.findOne({
    where: {
      otp: otp,
    },
  });

  if (!userOTP) {
    console.log("Invalid OTP");
  } else {
    try {
      const hashedPassword =  bcrypt.hashSync(newPassword,10); // Hash the new password with await
      userOTP.password = hashedPassword; // Assign the hashed password to the user object
      await userOTP.save();
    } catch (error) {
      console.log("Error occurred while hashing the password:", error);
    }
  }
  res.redirect("/login");
};

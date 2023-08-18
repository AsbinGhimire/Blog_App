const { combineBlog, combineUser } = require("../model");
const session = require("express-session");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// for Registeration
exports.registerUser = async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;
  console.log(username, email, password);

  // await users.create(req.body)
  await combineUser.create({
    username: username,
    email: email,
    //    password: password,
    password: bcrypt.hashSync(password, 10),
  });


  // register vaeapaxi login page maa jaa vaneko
  res.redirect("/login");
};

// for login
exports.loginUser = async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;
  const userExist = await combineUser.findAll({
    where: {
      email: email,
    },
  });
  console.log(userExist);

 
  if (userExist.length == 0) {
    // Set the flash message for incorrect username/password combination
    req.flash("error", "User not found or incorrect password");

    res.redirect("/login");
  } else {
    const isPasswordCorrect = bcrypt.compareSync(
      password,
      userExist[0].password
    );
// jwt payload, secret key
const token = jwt.sign({id:userExist[0].id},'hello');

res.cookie('token',token);

    if (isPasswordCorrect) {
      // req.flash("error", "User not found or incorrect password");
      res.redirect("/home");
    } else {
      // Set the flash message for incorrect username/password combination
      req.flash("error", "User not found or incorrect password");
      res.redirect("/login");
    }
  }
};
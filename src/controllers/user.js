const User = require("../models/User");
const server = require("http").createServer();

const bcrypt = require("bcryptjs");
const session = require("express-session");

exports.home = (req, res, next) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.send({ user: req.session, status: "login" });
  } else {
    res.send({ status: "logout" });
  }
  // res.send("123");
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.send({ status: "logout" });
  });
};

//post/postSignUp
exports.signup = (req, res, next) => {
  const { email, password, fullname, phone } = req.body;
  User.findOne({ email: email })
    .then((e) => {
      if (e) {
        console.log("email đã tồn tại đúng");
        res.send({ isLoggedIn: false });
        return;
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hashedPassword) => {
      const newUser = new User({
        email: email,
        password: hashedPassword,
        name: fullname,
        phone: phone,
        isAdmin: false,
      });
      return newUser.save();
    })
    .then((result) => {
      res.send({ Signup: true });
    })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

//post/postLogin
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.session.isLoggedIn);
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      console.log("username không đúng");
      res.send({ isLoggedIn: false });
      return;
    } else
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            return res.send({ user: user.email, isLoggedIn: true });
          } else res.send({ isLoggedIn: false });
        })
        .catch((err) => {
          console.log(err);
        });
  });
};

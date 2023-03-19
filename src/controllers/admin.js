const User = require("../models/User");
const Products = require("../models/products");

const bcrypt = require("bcryptjs");

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
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
            User.findOne({ email: email }).then((user) => {
              if (user.role === "admin") {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return res.send({
                  user: user.email,
                  isLoggedIn: true,
                  role: "admin",
                });
              } else res.send({ isLoggedIn: true, role: "staff" });
            });
          } else res.send({ isLoggedIn: false });
        })
        .catch((err) => {
          console.log(err);
        });
  });
};
exports.admin = (req, res) => {
  Products.find({}).then((data) => {
    res.send({ products: data });
  });
};

exports.deleteProduct = (req, res) => {
  const id = req.body.id;
  Products.findOne({ _id: id })
    .then((prod) => {
      Products.deleteOne({ _id: prod._id }).then(() => {
        res.send({
          massage: " the Product has been sucessfully deleted",
          delete: true,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.adminSearch = (req, res, next) => {
  const search = req.body.search;
  console.log(search);
  Products.find({})
    .then((prod) => {
      const arrSearch = prod.filter((e) => {
        return e.category.toUpperCase().includes(search.toUpperCase());
      });
      console.log(arrSearch);
      res.send({ products: arrSearch });
    })
    .catch(next);
};

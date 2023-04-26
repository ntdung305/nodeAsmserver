const Products = require("../models/products");
const User = require("../models/User");
const Order = require("../models/order");

const sgMail = require("@sendgrid/mail");
const contentEmail = `<div>
<h1> Bạn đã đặt hàng thành công </h1>
<h2>
<table>
<thead>
  <tr>
    <th>
      <strong className="text-small text-uppercase">Image</strong>
    </th>
    <th>
      <strong className="text-small text-uppercase">Product</strong>
    </th>
    <th >
      <strong>Price</strong>
    </th>
    <th className="border-0" scope="col">

      <strong>Quantity</strong>
    </th>
    <th>
      <strong>Total</strong>
    </th>
  </tr>
</thead>
<tbody>
 {result.products.map((value, index) => {
   return true;
   //  <tr>
   //    <td>
   //      <div>
   //        <img src={value.product.img} alt="..." width="70" />
   //      </div>
   //    </td>
   //    <td>
   //      <div>
   //        <div>{value.product.category}</div>
   //      </div>
   //    </td>
   //    <td>
   //      <p>{value.product.price} VND</p>
   //    </td>
   //    <td>{value.quantity}</td>
   //    <td>
   //      <p>
   //        {parseInt(value.product.price) * parseInt(value.quantity)}
   //        VND
   //      </p>
   //    </td>
   //  </tr>
 })}
</tbody>
</table>
</div>`;
const SENDGRID_API_KEY =
  "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";
sgMail.setApiKey(SENDGRID_API_KEY);
const msg = {
  from: "ngtdung305@gmail.com",
  to: "valatino.ntd@gmail.com",
  subject: "succesfully!",
  html: `${contentEmail}`,
};

// const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");

// //api sendgrid
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       user: "ngtdung305@gmail.com",
//       api_key:
//         "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",
//     },
//   })
// );

exports.allProduct = (req, res) => {
  Products.find({}).then((data) => {
    res.send({ products: data });
    sgMail.send(msg).then(
      (mess) => {
        console.log("email send");
      },
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
  });
};

exports.shop = (req, res) => {
  Products.find({}).then((product) => {
    res.send({ category: product });
  });
};

exports.searchTag = (req, res) => {
  const category = req.body.category;
  Products.find({ category: category }).then((product) => {
    res.send({ category: product });
  });
};

exports.detail = (req, res) => {
  const productId = req.body.id.id;
  Products.find({ _id: productId }).then((product) => {
    res.send({ products: product });
  });
};

exports.addToCart = (req, res, next) => {
  const idProduct = req.body.idProduct;
  const count = req.body.count;
  if (req.session.isLoggedIn) {
    const email = req.session.user.email;
    User.findOne({ email: email }).then((user) => {
      const cartProductIndex = user.cart.items.findIndex((cp) => {
        return cp.productId.toString() === idProduct.toString();
      });
      let newQuantity = 0;
      const updatedCartItems = [...user.cart.items];
      if (cartProductIndex >= 0) {
        newQuantity = user.cart.items[cartProductIndex].quantity + count;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: idProduct,
          quantity: count,
        });
      }
      const updatedCart = {
        items: updatedCartItems,
      };
      user.cart = updatedCart;
      user.save();
      res.send({ status: "true" });
    });
  } else {
    return res.send({ status: "false" });
  }
};

exports.cart = (req, res, next) => {
  if (req.session.isLoggedIn == true) {
    const email = req.session.user.email;
    User.find({ email: email })
      .populate("cart.items.productId")
      .then((user) => {
        const products = user[0].cart.items.map((i) => {
          return {
            quantity: i.quantity,
            product: {
              category: i.productId.category,
              img: i.productId.img1,
              price: i.productId.price,
              _id: i.productId._id,
            },
          };
        });
        res.send({ cart: products });
      });
  }
};

exports.deleteCart = (req, res, next) => {
  const idProduct = req.body.id;
  const user = req.session.user;

  function deleteProduct(prodId) {
    const updatedCartItems = prodId.cart.items.filter((item) => {
      return item.productId !== idProduct;
    });
    const newCart = { items: updatedCartItems };

    User.updateOne({ _id: prodId._id }, { cart: newCart })
      .then(() => {
        res.send({ status: "true" });
      })
      .catch(next);
  }

  User.findOne({ _id: user._id }).then((result) => {
    deleteProduct(result);
  });
};

exports.billCart = (req, res, next) => {
  if (req.session.isLoggedIn == true) {
    const email = req.session.user.email;
    User.find({ email: email })
      .populate("cart.items.productId")
      .then((user) => {
        const products = user[0].cart.items.map((i) => {
          return {
            quantity: i.quantity,
            product: {
              name: i.productId.name,
              img: i.productId.img1,
              price: i.productId.price,
              _id: i.productId._id,
            },
          };
        });
        res.send({ cart: products, user: user });
      });
  } else res.send({ status: "false" });
};

exports.order = (req, res) => {
  if (req.session.isLoggedIn == true) {
    const email = req.session.user.email;
    User.find({ email: email })
      .populate("cart.items.productId")
      .then((user) => {
        const products = user[0].cart.items.map((i) => {
          return {
            quantity: i.quantity,
            product: {
              name: i.productId.name,
              img: i.productId.img1,
              price: i.productId.price,
              _id: i.productId._id,
            },
          };
        });
        const order = new Order({
          email: email,
          products: products,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          total: req.body.total,
        });
        order.save();

        User.updateOne({ email: user[0].email }, { cart: { items: [] } }).then(
          () => {
            console.log("succesfully");
          }
        );
        return email;
      })

      .then((email) => {
        Order.find({ email: email }).then((result) => {
          sgMail.send(msg).then(
            (mess) => {
              console.log(mess);
              console.log("email send");
            },
            (error) => {
              console.error(error);

              if (error.response) {
                console.error(error.response.body);
              }
            }
          );
          // return transporter.sendMail({
          //   from: "ngtdung305@gmail.com",
          //   to: "dungntfx17974@funix.edu.vn",
          //   subject: "succesfully!",
          //   html: `<div>
          //   <h1> Bạn đã đặt hàng thành công </h1>
          //   <h2>
          //   <table>
          //   <thead>
          //     <tr>
          //       <th>
          //         <strong className="text-small text-uppercase">Image</strong>
          //       </th>
          //       <th>
          //         <strong className="text-small text-uppercase">Product</strong>
          //       </th>
          //       <th >
          //         <strong>Price</strong>
          //       </th>
          //       <th className="border-0" scope="col">

          //         <strong>Quantity</strong>
          //       </th>
          //       <th>

          //         <strong>Total</strong>
          //       </th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {result.products.map((value, index) => {
          //       return (
          //         <tr>
          //           <td>
          //             <div>
          //               <img src={value.product.img} alt="..." width="70" />
          //             </div>
          //           </td>
          //           <td>
          //             <div>
          //               <div>{value.product.category}</div>
          //             </div>
          //           </td>
          //           <td>
          //             <p>{value.product.price} VND</p>
          //           </td>
          //           <td>{value.quantity}</td>
          //           <td>
          //             <p>
          //               {parseInt(value.product.price) *
          //                 parseInt(value.quantity)}
          //               VND
          //             </p>
          //           </td>
          //         </tr>
          //       );
          //     })}
          //   </tbody>
          // </table>
          //   </div>`,
          // });
        });
      })
      .then(() => {
        res.send({ status: "true" });
      })
      .catch((err) => console.log(err));
  } else res.send({ status: "false" });
};

//ES6

exports.historyOrder = (req, res, next) => {
  const email = req.session.user.email;

  Order.find({ email: email }).then((order) => {
    res.send({ order: order });
  });
};

exports.historyDetail = (req, res, next) => {
  const prodId = req.body.id;
  Order.find({ _id: prodId }).then((order) => {
    res.send({ order: order });
  });
};

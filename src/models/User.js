const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// const ObjectId = Schema.ObjectId;

const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "client" },
  cart: {
    items: [
      {
        productId: { type: String, ref: "Products", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

user.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model("User", user);

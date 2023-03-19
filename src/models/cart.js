const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Cart = new Schema({
  email: { type: String },
  items: [
    {
      productId: {
        type: String,
      },
      quantity: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Cart", Cart);

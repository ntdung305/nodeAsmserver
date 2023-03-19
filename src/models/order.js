const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const order = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  email: {
    type: String,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Order", order);

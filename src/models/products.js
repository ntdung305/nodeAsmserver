const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// const ObjectId = Schema.ObjectId;

const Products = new Schema({
  category: { type: String },
  img1: { type: String },
  img2: { type: String },
  img3: { type: String },
  img4: { type: String },
  long_desc: { type: String },
  name: { type: String },
  price: { type: String },
  short_desc: { type: String },
  _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Products", Products);

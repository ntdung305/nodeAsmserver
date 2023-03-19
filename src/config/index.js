const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerceApp");
    console.log("connected");
  } catch (error) {
    console.log("error");
  }
};

module.exports = { connect };

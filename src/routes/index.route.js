const clientRouter = require("./client");
const adminRouter = require("./admin");
const productRouter = require("./shop");

function route(app) {
  app.use("/admin", adminRouter);
  app.use("/product", productRouter);
  app.use("/", clientRouter);
}

module.exports = route;

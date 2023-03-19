const express = require("express");
const router = express.Router();

const {
  allProduct,
  detail,
  shop,
  searchTag,
  addToCart,
  deleteCart,
  cart,
  billCart,
  order,
  historyOrder,
  historyDetail,
} = require("../controllers/shop");

router.post("/", allProduct);

router.post("/shop", shop);

router.post("/searchTag", searchTag);

router.post("/detail", detail);

router.post("/cart", cart);

router.post("/addtocart", addToCart);

router.post("/deletecart", deleteCart);

router.post("/billcart", billCart);

router.post("/order", order);

router.post("/historyorder", historyOrder);

router.post("/historydetail", historyDetail);

module.exports = router;

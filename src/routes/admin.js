const express = require("express");
const router = express.Router();
const {
  adminLogin,
  admin,
  deleteProduct,
  adminSearch,
} = require("../controllers/admin");

router.post("/login", adminLogin);
router.post("/deleteproduct", deleteProduct);
router.post("/search", adminSearch);
router.post("/", admin);

module.exports = router;

const express = require("express");
const router = express.Router();

const { home, signup, postLogin, logout } = require("../controllers/user");

router.post("/signup", signup);
router.post("/login", postLogin);
router.post("/logout", logout);
router.post("/", home);

module.exports = router;

const db = require("../data/userToken.json");

exports.auth = (req, res, next) => {
  // const token = req.body.token;
  const token = req.body.token;
  const userId = req.body.userId;

  const validate = (e) => {
    return e.token == token && e.userId == userId;
  };
  const user = db.some(validate);
  if (!user) {
    console.log("Unauthorized");
    res.send("Unauthorized");
    res.redirect("/");
    return;
  }
  next();
};

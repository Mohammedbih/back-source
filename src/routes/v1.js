const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/users.controller");

// Auth and Sign Up
router.post("/register", userController.register);
router.post("/login", userController.login);

//Customize And protect routs
router.all("*", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("U Are Not Authorized to access this erea");
      error.status = 401;
      throw error;
    }

    req.user = user;
    return next();
  })(req, res, next);
});

// ------------------ Protected ------------------//

router.get("/test", (req, res, next) => {
  return res.send({ message: "auth done" });
});

module.exports = router;

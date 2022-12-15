const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/users.controller");
const tShirtController = require("../controllers/t_shirt.controller");

// ------------------ Public ------------------//

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/t-shirts/get-all", tShirtController.get_list);
router.get("/t-shirts/get-by-id/:id", tShirtController.get_tShirt_by_id);

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

router.post("/t-shirts/add", tShirtController.post_tShirt);
router.post("/t-shirts/delete-by-id/:id", tShirtController.post_delete_by_id);
router.post("/t-shirts/update-by-id/:id", tShirtController.post_update_by_id);

module.exports = router;

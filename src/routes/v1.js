const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/users.controller");
const tShirtController = require("../controllers/t_shirt.controller");
const visaController = require("../controllers/visa.controller");
const orderController = require("../controllers/order.controller");
const posterController = require("../controllers/poster.controller");

// ------------------ Public ------------------//

////////////// User ////////////////////
router.post("/register", userController.register);
router.post("/login", userController.login);

////////////// T-Shirt ////////////////////
router.get("/t-shirt/all", tShirtController.get_list);
router.get("/t-shirt/:id", tShirtController.get_tShirt_by_id);
router.get("/t-shirt/hody", tShirtController.get_hody_list);
router.get("/t-shirt/half-sleeve", tShirtController.get_half_sleeve_list);
router.get("/t-shirt/not-printed", tShirtController.get_not_printed_list);
router.get("/t-shirt/printed", tShirtController.get_printed_list);
router.get("/t-shirt/long-sleeve", tShirtController.get_long_sleeve_list);
router.get("/t-shirt/review/:id", tShirtController.get_tshirt_review_by_id);

////////////// Poster ////////////////////
router.get("/poster/:id", posterController.get_poster);
router.get("/poster/all", posterController.get_list);
router.get("/poster/review/:id", posterController.get_poster_review_by_id);

//////Customize And protect routs
router.all("*", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("You Are Not Authorized to access this area");
      error.status = 401;
      throw error;
    }

    req.user = user;
    return next();
  })(req, res, next);
});

// ------------------ Protected ------------------//

////////////// visa ////////////////////
router.get("/visa/:id", visaController.get_visa_by_id);
router.get("/visa/all", visaController.get_list);
router.post("/visa", visaController.post_create_visa);
router.delete("/visa/:id", visaController.post_delete_by_id);
router.put("/visa/:id", visaController.put_update_by_id);

////////////// Order ////////////////////
router.post("/order", orderController.post_create_order);
router.get("/order/:id", orderController.get_order_by_id);
router.put("/order/:id", orderController.put_is_paid);
router.get("/order/all", orderController.get_order_list);

////////////// Poster ////////////////////
router.delete("/poster/:id", posterController.post_delete_by_id);
router.put("/poster/:id", posterController.put_update_by_id);
router.post("/poster/review/:id", posterController.post_review_by_id);
router.post("/poster", posterController.post_poster);
router.post("/poster/cart/:id", userController.post_add_poster_to_cart);
router.delete("/poster/cart/:id", userController.post_delete_poster_cart_by_id);

////////////// T-Shirt ////////////////////
router.post("/t-shirt", tShirtController.post_tShirt);
router.delete("/t-shirt/:id", tShirtController.post_delete_by_id);
router.put("/t-shirt/:id", tShirtController.put_update_by_id);
router.post("/t-shirt/review/:id", tShirtController.post_review_by_id);
router.post("/t-shirt/cart/:id", userController.post_add_tshirt_to_cart);
router.delete(
  "/t-shirt/cart/:id",
  userController.post_delete_tshirt_cart_by_id
);

////////////// User ////////////////////
router.put("/user/update", userController.put_update);

module.exports = router;

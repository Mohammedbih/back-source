const jwt = require("jsonwebtoken");
const Poster = require("../models/poster.model");
const Tshirt = require("../models/t_shirt.model");

const User = require("../models/user.model");

const userController = {};

userController.register = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    try {
      const newUser = new User(req.body);
      console.log("newUser", newUser);

      const secret = process.env.JWT_SECRET; //Secret
      const expire = process.env.JWT_EXPIRATION; //Expiration

      const token = jwt.sign({ _id: newUser._id }, secret, {
        expiresIn: expire,
      });
      newUser.token = token;

      const user = await newUser.save();

      return res.send({ token: user.token });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
  const err = new Error(`Email address ${req.body.email} is already taken`);
  return next(err);
};

userController.login = async (req, res, next) => {
  //name, pass
  const { email, password } = req.body;

  //check name, pass
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error(`This email ${email} is not in our system`);
      err.status = 401;
      return next(err);
    }
    if (!user.isPasswordMatch(password, user.password)) {
      const err = new Error("password is not correct");
      err.status = 401;
      return next(err);
    }
    const secret = process.env.JWT_SECRET; //Secret
    const expire = process.env.JWT_EXPIRATION; //Expiration
    jwt.verify(user.token, secret, function (err, decoded) {
      if (err) {
        user.token = jwt.sign({ _id: user._id }, secret, { expiresIn: expire });
      }
    });

    return res.send({ token: user.token });
  } catch (e) {
    return next(e);
  }
};

// carts

// delete

// router.post("/user/add-cart", userController.post_add_cart);
// router.post("/user/delete-cart-by-id/:id", userController.post_delete_cart_by_id);
// router.post("/user/update-cart-by-id/:id", userController.post_update_cart_by_id);
// router.get("/user/get-carts", userController.get_carts);

userController.post_delete_tshirt_cart_by_id = async (req, res, next) => {
  Tshirt.findById(req.params.id)
    .then((tshirt) => {
      req.user.deleteTshirtFromCart(tshirt).then((result) => {
        return res.status(200).send({ result });
      });
    })
    .catch((err) => console.log(err));
};

userController.post_delete_poster_cart_by_id = async (req, res, next) => {
  Poster.findById(req.params.id)
  .then((poster) => {
    req.user.deletePosterFromCart(poster).then((result) => {
      return res.status(200).send({ result });
    });
  })
  .catch((err) => console.log(err));
};

// add to tshirt cart
userController.post_add_tshirt_to_cart = async (req, res, next) => {
  Tshirt.findById(req.params.id)
    .then((tshirt) => {
      req.user.addTshirtToCart(tshirt).then((result) => {
        return res.status(200).send({ result });
      });
    })
    .catch((err) => console.log(err));
};

// add to poster cart
userController.post_add_poster_to_cart = async (req, res, next) => {
  Poster.findById(req.params.id)
    .then((poster) => {
      req.user.addPosterToCart(poster).then((result) => {
        return res.status(200).send({ result });
      });
    })
    .catch((err) => console.log(err));
};

userController.post_add_cart = module.exports = userController;

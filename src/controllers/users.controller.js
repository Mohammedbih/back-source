const jwt = require("jsonwebtoken");

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

userController.post_delete_cart_by_id = async (req, res, next) => {
  const id = req.params.id;

  if (!id) return res.status(404).send({ err: "Missing Data Parameter" });

  const user = req.user;
  try {
    const index = await user.carts.indexOf({_id: id})
    const result = await user.carts.splice(index,1);
    if(result){
     return res.status(200).send({massage: `${result} deleted`})
    }
    return res.status(401).send({error: "error can not delete"})

  } catch (error) {
    next(error)
  }

}

module.exports = userController;

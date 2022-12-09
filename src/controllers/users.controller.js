const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const userController = {};

userController.register = async (req, res, next) => {
  const newUser = new User(req.body);
  console.log("newUser", newUser);

  try {
    const user = await newUser.save();
    return res.send({ user });
  } catch (e) {
    console.log(e);
    if (e.code === 11000 && e.name === "MongoError") {
      const err = new Error(`Email adress ${req.body.email} is already taken`);
      next(err);
    } else {
      next(e);
    }
  }
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
    //if credi ok, then JWT and return
    const secret = process.env.JWT_SECRET; //Secret
    const expire = process.env.JWT_EXPIRATION; //Expiration

    const token = jwt.sign({ _id: user._id }, secret, { expiresIn: expire });
    return res.send({ token });
  } catch (e) {
    return next(e);
  }
};

module.exports = userController;

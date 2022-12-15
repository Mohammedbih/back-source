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
  const err = new Error(`Email adress ${req.body.email} is already taken`);
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

module.exports = userController;

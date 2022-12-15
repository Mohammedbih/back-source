const mongoose = require("mongoose");
const bctypt = require("bcryptjs");

const { Schema } = mongoose;

const UserSchema = Schema({
  name: { type: String, require: true },
  age: { type: Number },
  mobile: { type: String },
  visa_id: { type: mongoose.Schema.Types.ObjectId, ref: "Visa" },
  t_shirts_bought: [{ type: mongoose.Schema.Types.ObjectId, ref: "T-Shirt" }],
  t_shirt_cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "T-Shirt" }],
  adress: { type: String },
  email: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  password: { type: String, require: true },
  isAdmin: { type: Boolean, require: true, default: false },
  type: {
    type: String,
    enum: {
      values: ["User", "Admin"],
      message: "{VALUE} is not supported",
    },
    default: "User",
  },
  joined: { type: Date, default: new Date() },
  token: String,
});

UserSchema.pre("save", async function (next) {
  //Check new account, or modified
  if (!this.isModified("password")) {
    return next();
  }

  //Encrypt pass
  try {
    const salt = await bctypt.genSalt(12);
    const hash = await bctypt.hash(this.password, salt);
    this.password = hash;

    next();
  } catch (e) {
    return next(e);
  }
});

UserSchema.methods.isPasswordMatch = function (password, hashed) {
  return bctypt.compareSync(password, hashed);
};

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
5;

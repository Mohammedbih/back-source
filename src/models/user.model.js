const mongoose = require("mongoose");
const bctypt = require("bcryptjs");

const { Schema } = mongoose;

const UserSchema = Schema({
  name: { type: String, required: true },
  age: { type: Number },
  mobile: { type: String },
  visa_number: { type: Number, uinque: true },
  t_shirts: { type: [] },
  adress: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: { type: String, required: true },
  type: { type: String }, // admin || user
  joined: { type: Date, default: new Date() },
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

UserSchema.methods.isPasswordMatch = function(password, hashed){
  return bctypt.compareSync(password,hashed)
}

const User = mongoose.model("User", UserSchema);
module.exports = User;

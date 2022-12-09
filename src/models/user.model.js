const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = Schema({
  name: { type: String, required: true },
  age: { type: Number },
  mobile: { type: String },
  visa_number: { type: Number, uinque: true },
  t_shirts: { type: [] },
  adress: { type: String },
  email: { type: String, required: true, index: true, uinque: true },
  password: { type: String, required: true },
  type: { type: String }, // admin || user
  joined: { type: Date, default: new Date() },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

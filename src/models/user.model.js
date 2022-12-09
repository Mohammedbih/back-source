const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = Schema({
  name: { tybe: String, required: true },
  age: { tybe: Number },
  mobile:{ tybe: String},
  visa_number:{tybe: Number , uinque: true},
  t_shirts:{tybe: []},
  email: { tybe: String, required: true, index: true, uinque: true },
  password: { tybe: String, required: true },
  tybe: { tybe: String }, // admin || user
  joined: { tybe: Date, default: new Date() },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

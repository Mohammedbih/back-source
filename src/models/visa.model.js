const mongoose = require("mongoose");

const { Schema } = mongoose;

const VisaSchema = Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, require: true, ref:"User" },
  number: { type: Number, unique: true, require: true , index: true },
  serialcode: { type: Number, unique: true, require: true },
  password: { type: String, require: true },
  valid: { type: Date, require: true },
});

const Visa = mongoose.model("Visa", VisaSchema);
module.exports = Visa;

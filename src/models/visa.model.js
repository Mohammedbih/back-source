const mongoose = require("mongoose");

const { Schema } = mongoose;

const VisaSchema = Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  number: { type: Number, unique: true, required: true, index: true },
  serialcode: { type: Number, unique: true, required: true },
  password: { type: String, required: true },
  valid: { type: Date, required: true },
});

const Visa = mongoose.model("Visa", VisaSchema);
module.exports = Visa;

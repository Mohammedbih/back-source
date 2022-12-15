const mongoose = require("mongoose");

const { Schema } = mongoose;

const TshirtSchema = Schema({
  name: { type: String, required: true },
  color: { type: String, default: "#182970" },
  type: {
    type: String,
    enum: {
      values: ["Printed", "NonPrinted"],
      message: "{VALUE} is not supported",
    },
  },
  size: {
    type: String,
    enum: {
      values: ["Small", "Medium", "Large"],
      message: "{VALUE} is not supported",
    },
  },
  fit_or_over: {
    type: String,
    enum: {
      values: ["Fit", "Over"],
      message: "{VALUE} is not supported",
    },
  },

  added: { type: Date, default: new Date() },
  price: {
    type: Number,
    required: true,
    min: [100, "Price must be greater than 100"],
  },
  img: { type: String, required: true },
});

const Tshirt = mongoose.model("T-Shirt", TshirtSchema);
module.exports = Tshirt;

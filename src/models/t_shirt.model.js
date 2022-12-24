const mongoose = require("mongoose");
const Review = require("./review.model");

const { Schema } = mongoose;

const TshirtSchema = Schema({
  name: { type: String, required: true },
  color: { type: String, default: "#182970" },
  tshirt_type: {
    type: String,
    enum: {
      values: ["Half-Sleeve", "Long-Sleeve", "Hody"],
      message: "{VALUE} is not supported",
    },
  },
  type: {
    type: String,
    enum: {
      values: ["Printed", "Not-Printed"],
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
    requiredd: true,
    min: [100, "Price must be greater than 100"],
  },
  img: { type: String, required: true },
  stock: { type: Boolean, default: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  no_of_reviews: { type: Number, required: true, default: 0 },
  reviews: { type: [Review.Schema] },
  quantity: { type: Number, default: 1 },
});

const Tshirt = mongoose.model("T-Shirt", TshirtSchema);
module.exports = Tshirt;

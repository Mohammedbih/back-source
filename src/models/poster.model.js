const mongoose = require("mongoose");
const Review = require("./review.model");

const { Schema } = mongoose;

const PosterSchema = Schema({
  name: { type: String, required: true },
  size: {
    type: String,
    enum: {
      values: ["Small", "Large"],
      message: "{VALUE} is not supported",
    },
  },
  price: {
    type: Number,
    required: true,
    min: [50, "Price must be greater than 50"],
  },
  date: { type: Date, default: new Date() },
  img: { type: String, required: true },
  stock: { type: Boolean, default: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  no_of_reviews: { type: Number, required: true, default: 0 },
  reviews: { type: [Review.Schema] },
  quantity: { type: Number, default: 1 },
});

const Poster = mongoose.model("Poster", PosterSchema);
module.exports = Poster;

const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReviewSchema = Schema({
  name:{type: String, required: true},
  rating: { type: Number, required: true },
  comment: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;

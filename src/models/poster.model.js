const mongoose = require("mongoose");

const { Schema } = mongoose;

const PosterSchema = Schema({
  name: { type: String, require: true },
  size: {
    type: String,
    enum: {
      values: ["Small", "Large"],
      message: "{VALUE} is not supported",
    }
  },
  price: {
    type: Number,
    require: true,
    min: [50, "Price must be greater than 50"]
  },
  date: { type: Date, default: new Date() },
  img: { type: String, require: true },
  stock: { type: Boolean, default: true },
  description: { type: String, require: true },
  rating: { type: Number, require: true, default: 0 },
  no_of_reviews: { type: Number, require: true, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]

});

const Poster = mongoose.model("Poster", PosterSchema);
module.exports = Poster;

const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderSchema = Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order_items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: String, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "T-Shirt",
      },
    },
  ],
  shipping_address: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
  },
  payment_method: { type: String, required: true, default: "Cash" },
  payment_result: {
    id: { type: String },
    status: { type: String },
    email_address: { type: String },
    time: { type: String },
  },
  tax: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shipping_price: {
    type: Number,
    required: true,
    default: 0.0,
  },
  total_price: {
    type: Number,
    required: true,
    default: 0.0,
  },

  is_paid: { type: Boolean, required: true, default: false },
  paid_at: {
    type: Date,
  },
  is_delivered: { type: Boolean, required: true, default: false },
  delivered_at: { type: Date },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;

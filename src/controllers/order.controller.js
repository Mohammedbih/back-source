const Order = require("../models/order.model");

const orderController = {};

// Create
orderController.post_create_order = async (req, res, next) => {
  const {
    order_items,
    shipping_address,
    payment_method,
    tax,
    shipping_price,
    total_price,
  } = req.body;
  if (order_items && order_items.length === 0) {
    res.status(400);
    next(new Error("No Order items"));
  } else {
    const order = new Order({
      user: req.user._id,
      order_items,
      shipping_address,
      payment_method,
      tax,
      shipping_price,
      total_price,
    });
    const create_order = await order.save();
    res.status(201).json(create_order);
  }
};

// Get
orderController.get_order_by_id = async (req, res, next) => {
  const id = req.params.id;

  if (!id) return res.status(404).send({ err: "Missing Data Parameter" });

  try {
    const order = await getOrder(id);
    res.status(200).send(order);
  } catch (e) {
    return next(e);
  }
};
const getOrder = async (id) => {
  const order_exists = await Order.find({ _id: id });

  if (!order_exists) return next(new Error("Order Not Found"));

  return order_exists;
};

// Paid
orderController.put_is_paid = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.is_paid = true;
    order.paid_at = new Date();
    order.payment_result = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
      time: req.body.time,
    };
    const updated_order = await order.save();
    res.json(updated_order);
  } else {
    res.status(400);
    next(new Error(" Order Not Found"));
  }
};
// Get
orderController.get_order_list = async (req, res, next) => {
  const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
  res.json(order);
};

module.exports = orderController;

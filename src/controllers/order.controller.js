const Order = require("../models/order.model");

const orderController = {};

// Create
protect,
  (orderController.post_create_order = async (req, res, next) => {
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
      throw new Error("No Order items");
      return;
    } else {
      const order = new Order({
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
  });

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

  if (!order_exists) throw new Error("Order Not Found");

  return order_exists;
};

module.exports = orderController;

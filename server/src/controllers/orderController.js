const Order = require("../models/Order");

async function getOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("items.product", "name images");
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate("items.product", "name images slug");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingFee, total } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      total,
    });
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOrders, getOrderById, createOrder };

const orders = require("../queries/orders");

async function getAllOrders(req, res, next) {
  try {
    const { page, limit } = req.query;
    const rows = await orders.findAll({ page, limit });
    res.json({ orders: rows });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await orders.updateStatus(req.params.id, status);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

async function getOrders(req, res, next) {
  try {
    const rows = await orders.findByUser(req.user.id);
    res.json({ orders: rows });
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await orders.findById(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    next(err);
  }
}

async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, shippingFee, total } = req.body;
    const order = await orders.create({
      user_id: req.user.id,
      items,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      subtotal,
      shipping_fee: shippingFee,
      total,
    });
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllOrders, updateOrderStatus, getOrders, getOrderById, createOrder };

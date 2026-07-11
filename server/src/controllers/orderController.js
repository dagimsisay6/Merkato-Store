const orders = require("../queries/orders");
const products = require("../queries/products");
const pool = require("../config/db");

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
    const { items, shippingAddress, paymentMethod, shippingFee } = req.body;

    if (!items?.length) return res.status(400).json({ message: "No items provided" });

    // Fetch all products from DB — never trust client prices
    const ids = items.map((i) => Number(i.id));
    const dbProducts = await products.findByIds(ids);
    const productMap = Object.fromEntries(dbProducts.map((p) => [p.id, p]));

    // Validate each item
    const verifiedItems = [];
    for (const item of items) {
      const p = productMap[Number(item.id)];
      if (!p) return res.status(400).json({ message: `Product ${item.id} not found` });
      if (!p.is_active) return res.status(400).json({ message: `"${p.name}" is no longer available` });
      if (p.stock !== null && p.stock < item.qty)
        return res.status(400).json({ message: `Insufficient stock for "${p.name}"` });
      verifiedItems.push({
        id: p.id,
        name: p.name,
        brand: p.brand,
        image: p.images?.[0] ?? null,
        price: Number(p.price),
        qty: Number(item.qty),
        line_total: Number(p.price) * Number(item.qty),
      });
    }

    // Recalculate totals server-side
    const subtotal = verifiedItems.reduce((s, i) => s + i.line_total, 0);
    const calcShipping = subtotal > 50 ? 0 : 4.99;
    const tax = subtotal * 0.05;
    const total = subtotal + calcShipping + tax;

    // Decrement stock
    for (const item of verifiedItems) {
      await pool.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1",
        [item.qty, item.id]
      );
    }

    const order = await orders.create({
      user_id: req.user.id,
      items: verifiedItems,
      shipping_address: shippingAddress,
      payment_method: paymentMethod ?? "cod",
      subtotal,
      shipping_fee: calcShipping,
      total,
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllOrders, updateOrderStatus, getOrders, getOrderById, createOrder };

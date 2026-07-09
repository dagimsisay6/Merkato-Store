const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        image: String,
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      name: String,
      line1: String,
      city: String,
      country: String,
      phone: String,
    },
    paymentMethod: { type: String, default: "card" },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

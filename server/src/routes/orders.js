const router = require("express").Router();
const { getAllOrders, updateOrderStatus, getOrders, getOrderById, createOrder } = require("../controllers/orderController");
const { protect, adminOnly, customerOnly } = require("../middleware/auth");

router.use(protect);

// Admin
router.get("/all", adminOnly, getAllOrders);
router.put("/:id/status", adminOnly, updateOrderStatus);

// Customer
router.get("/", customerOnly, getOrders);
router.get("/:id", customerOnly, getOrderById);
router.post("/", customerOnly, createOrder);

module.exports = router;

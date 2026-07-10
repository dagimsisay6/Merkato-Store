const router = require("express").Router();
const { getAllOrders, updateOrderStatus, getOrders, getOrderById, createOrder } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);

// Admin
router.get("/all", adminOnly, getAllOrders);
router.put("/:id/status", adminOnly, updateOrderStatus);

// User
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);

module.exports = router;

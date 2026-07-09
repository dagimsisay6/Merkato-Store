const router = require("express").Router();
const { getOrders, getOrderById, createOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);

module.exports = router;

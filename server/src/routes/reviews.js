const router = require("express").Router();
const { getProductReviews, createReview, deleteReview } = require("../controllers/reviewController");
const { protect, customerOnly } = require("../middleware/auth");

// Public — get reviews for a product
router.get("/products/:slug/reviews", getProductReviews);

// Customers only — submit / delete
router.post("/products/:slug/reviews", protect, customerOnly, createReview);
router.delete("/reviews/:id", protect, customerOnly, deleteReview);

module.exports = router;

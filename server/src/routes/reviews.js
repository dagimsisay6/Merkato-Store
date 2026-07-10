const router = require("express").Router();
const { getProductReviews, createReview, deleteReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// Public — get reviews for a product
router.get("/products/:slug/reviews", getProductReviews);

// Protected — submit / delete
router.post("/products/:slug/reviews", protect, createReview);
router.delete("/reviews/:id", protect, deleteReview);

module.exports = router;

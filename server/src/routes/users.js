const router = require("express").Router();
const {
  getProfile, updateProfile, changePassword,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getWishlist, addToWishlist, removeFromWishlist,
  getAllUsers, getUserById, updateUserRole, disableUser,
} = require("../controllers/userController");
const { getUserReviews } = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", changePassword);

// Addresses
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

// Reviews
router.get("/reviews", getUserReviews);

// Admin
router.get("/", adminOnly, getAllUsers);
router.get("/:id", adminOnly, getUserById);
router.put("/:id/role", adminOnly, updateUserRole);
router.delete("/:id", adminOnly, disableUser);

module.exports = router;

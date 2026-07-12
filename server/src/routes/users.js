const router = require("express").Router();
const {
  getProfile, updateProfile, changePassword, uploadAvatar, removeAvatar,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getWishlist, addToWishlist, removeFromWishlist,
  getCart, updateCart, deleteAccount,
  getAllUsers, getUserById, updateUserRole, disableUser,
} = require("../controllers/userController");
const { getUserReviews } = require("../controllers/reviewController");
const { protect, adminOnly, customerOnly } = require("../middleware/auth");

router.use(protect);

// Profile — any authenticated user
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/avatar", uploadAvatar);
router.delete("/avatar", removeAvatar);
router.put("/password", changePassword);

// Addresses — customers only
router.get("/addresses", customerOnly, getAddresses);
router.post("/addresses", customerOnly, addAddress);
router.put("/addresses/:id", customerOnly, updateAddress);
router.delete("/addresses/:id", customerOnly, deleteAddress);

// Wishlist — customers only
router.get("/wishlist", customerOnly, getWishlist);
router.post("/wishlist/:productId", customerOnly, addToWishlist);
router.delete("/wishlist/:productId", customerOnly, removeFromWishlist);

// Cart — customers only
router.get("/cart", customerOnly, getCart);
router.put("/cart", customerOnly, updateCart);

// Delete account — customers only
router.delete("/account", customerOnly, deleteAccount);

// Reviews — customers only
router.get("/reviews", customerOnly, getUserReviews);

// Admin
router.get("/", adminOnly, getAllUsers);
router.get("/:id", adminOnly, getUserById);
router.put("/:id/role", adminOnly, updateUserRole);
router.delete("/:id", adminOnly, disableUser);

module.exports = router;

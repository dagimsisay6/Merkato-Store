const router = require("express").Router();
const { getProfile, updateProfile, getAddresses, addAddress, deleteAddress } = require("../controllers/userController");
const { getUserReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.delete("/addresses/:id", deleteAddress);
router.get("/reviews", getUserReviews);

module.exports = router;

const router = require("express").Router();
const { getProfile, updateProfile, getAddresses, addAddress, deleteAddress } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.delete("/addresses/:id", deleteAddress);

module.exports = router;

const router = require("express").Router();
const { getProducts, getProductBySlug, getProductsByIds, uploadImage, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getProducts);
router.get("/by-ids", getProductsByIds);
router.get("/:slug", getProductBySlug);
router.post("/", protect, adminOnly, createProduct);
router.post("/upload-image", protect, adminOnly, uploadImage);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;

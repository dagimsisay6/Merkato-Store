const router = require("express").Router();
const {
  submitApplication, getApplications, getApplication,
  updateStatus, replyToApplication, deleteApplication,
  restoreApplication, getNewCount,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/auth");

// Public
router.post("/careers/apply", submitApplication);

// Admin only
router.get("/admin/applications/new-count", protect, adminOnly, getNewCount);
router.get("/admin/applications", protect, adminOnly, getApplications);
router.get("/admin/applications/:id", protect, adminOnly, getApplication);
router.patch("/admin/applications/:id/status", protect, adminOnly, updateStatus);
router.post("/admin/applications/:id/reply", protect, adminOnly, replyToApplication);
router.delete("/admin/applications/:id", protect, adminOnly, deleteApplication);
router.patch("/admin/applications/:id/restore", protect, adminOnly, restoreApplication);

module.exports = router;

const router = require("express").Router();
const {
  submitContact,
  getMessages,
  getMessage,
  updateStatus,
  replyToMessage,
  deleteMessage,
  restoreMessage,
  getUnreadCount,
} = require("../controllers/messageController");
const { protect, adminOnly } = require("../middleware/auth");

// Public
router.post("/contact", submitContact);

// Admin only
router.get("/admin/messages/unread-count", protect, adminOnly, getUnreadCount);
router.get("/admin/messages", protect, adminOnly, getMessages);
router.get("/admin/messages/:id", protect, adminOnly, getMessage);
router.patch("/admin/messages/:id/status", protect, adminOnly, updateStatus);
router.post("/admin/messages/:id/reply", protect, adminOnly, replyToMessage);
router.delete("/admin/messages/:id", protect, adminOnly, deleteMessage);
router.patch("/admin/messages/:id/restore", protect, adminOnly, restoreMessage);

module.exports = router;

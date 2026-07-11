const messages = require("../queries/messages");
const { sendAcknowledgment, sendReply } = require("../config/email");

// POST /api/contact — public
async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Name, email, subject and message are required" });
    }
    const msg = await messages.create({ name, email, phone, subject, message });

    // Send acknowledgment email (non-blocking)
    sendAcknowledgment({ name, email, subject }).catch(() => {});

    res.status(201).json({ success: true, message: "Message received", id: msg.id });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/messages
async function getMessages(req, res, next) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const data = await messages.findAll({ page, limit, status, search });
    const unread = await messages.countUnread();
    res.json({ ...data, unread });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/messages/:id
async function getMessage(req, res, next) {
  try {
    const msg = await messages.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    // Auto-mark as read when opened
    if (msg.status === "unread") {
      await messages.updateStatus(req.params.id, "read");
      msg.status = "read";
    }

    const replies = await messages.getReplies(req.params.id);
    res.json({ message: msg, replies });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/messages/:id/status
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const valid = ["unread", "read", "replied", "resolved", "archived"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const msg = await messages.updateStatus(req.params.id, status);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json({ message: msg });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/messages/:id/reply
async function replyToMessage(req, res, next) {
  try {
    const { reply } = req.body;
    if (!reply?.trim()) return res.status(400).json({ message: "Reply text is required" });

    const msg = await messages.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    const replyRow = await messages.createReply({
      messageId: req.params.id,
      adminId: req.user.id,
      reply: reply.trim(),
    });

    await messages.updateStatus(req.params.id, "replied");

    // Send reply email (non-blocking)
    sendReply({
      customerName: msg.name,
      customerEmail: msg.email,
      subject: msg.subject,
      replyText: reply.trim(),
      adminName: req.user.name,
    }).catch(() => {});

    res.status(201).json({ reply: replyRow });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/messages/:id — soft delete
async function deleteMessage(req, res, next) {
  try {
    const msg = await messages.softDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/messages/:id/restore
async function restoreMessage(req, res, next) {
  try {
    const msg = await messages.restore(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json({ message: msg });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/messages/unread-count
async function getUnreadCount(req, res, next) {
  try {
    const count = await messages.countUnread();
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContact, getMessages, getMessage, updateStatus, replyToMessage, deleteMessage, restoreMessage, getUnreadCount };

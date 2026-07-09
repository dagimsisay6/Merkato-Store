const router = require("express").Router();

router.post("/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  // TODO: integrate email service (Mailchimp, SendGrid, etc.)
  res.json({ success: true, message: "Subscribed successfully" });
});

module.exports = router;

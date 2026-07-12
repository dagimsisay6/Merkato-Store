const applications = require("../queries/applications");
const cloudinary = require("cloudinary").v2;
const { sendApplicationAck, sendApplicationReply } = require("../config/email");

// POST /api/careers/apply — public
async function submitApplication(req, res, next) {
  try {
    const { position, firstName, lastName, email, phone, location, linkedin, portfolio, experience, coverLetter, resumeData } = req.body;

    if (!position || !firstName || !lastName || !email || !location || !experience || !coverLetter) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // Upload resume to Cloudinary if provided (base64)
    let resumeUrl = null;
    if (resumeData) {
      const result = await cloudinary.uploader.upload(resumeData, {
        folder: "merkato/resumes",
        resource_type: "raw",
        use_filename: true,
      });
      resumeUrl = result.secure_url;
    }

    const app = await applications.create({ position, firstName, lastName, email, phone, location, linkedin, portfolio, experience, coverLetter, resumeUrl });

    sendApplicationAck({ firstName, email, position }).catch(() => {});

    res.status(201).json({ success: true, id: app.id });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/applications
async function getApplications(req, res, next) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const data = await applications.findAll({ page, limit, status, search });
    const newCount = await applications.countNew();
    res.json({ ...data, newCount });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/applications/:id
async function getApplication(req, res, next) {
  try {
    const app = await applications.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.status === "new") {
      await applications.updateStatus(req.params.id, "reviewing");
      app.status = "reviewing";
    }
    const replies = await applications.getReplies(req.params.id);
    res.json({ application: app, replies });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/applications/:id/status
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const valid = ["new", "reviewing", "shortlisted", "rejected", "hired", "archived"];
    if (!valid.includes(status)) return res.status(400).json({ message: "Invalid status" });
    const app = await applications.updateStatus(req.params.id, status);
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ application: app });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/applications/:id/reply
async function replyToApplication(req, res, next) {
  try {
    const { reply } = req.body;
    if (!reply?.trim()) return res.status(400).json({ message: "Reply text is required" });

    const app = await applications.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const replyRow = await applications.createReply({ applicationId: req.params.id, adminId: req.user.id, reply: reply.trim() });

    // Auto-advance status if still reviewing
    if (app.status === "reviewing" || app.status === "new") {
      await applications.updateStatus(req.params.id, "reviewing");
    }

    sendApplicationReply({
      firstName: app.first_name,
      email: app.email,
      position: app.position,
      replyText: reply.trim(),
      adminName: req.user.name,
      status: app.status,
    }).catch(() => {});

    res.status(201).json({ reply: replyRow });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/applications/:id
async function deleteApplication(req, res, next) {
  try {
    const app = await applications.softDelete(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/applications/:id/restore
async function restoreApplication(req, res, next) {
  try {
    const app = await applications.restore(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ application: app });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/applications/new-count
async function getNewCount(req, res, next) {
  try {
    const count = await applications.countNew();
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitApplication, getApplications, getApplication, updateStatus, replyToApplication, deleteApplication, restoreApplication, getNewCount };

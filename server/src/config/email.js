const nodemailer = require("nodemailer");

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

const FROM = () => `"Merkato Store Support" <${process.env.SMTP_USER}>`;

async function sendAcknowledgment({ name, email, subject }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("⚠️  SMTP not configured — skipping acknowledgment email");
    return;
  }
  await transporter.sendMail({
    from: FROM(),
    to: email,
    subject: `We received your message — ${subject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Africa &amp; Middle East's Marketplace</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">
            Thank you for contacting Merkato Store. We have received your message and our support team will respond as soon as possible.
          </p>
          <div style="background:#f9fafb;border-left:4px solid #2d7a5a;border-radius:4px;padding:16px 20px;margin:24px 0">
            <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Your subject</p>
            <p style="margin:6px 0 0;color:#111827;font-weight:600">${subject}</p>
          </div>
          <p style="color:#374151;line-height:1.7;margin:0 0 8px">We typically respond within <strong>24 hours</strong> during business days.</p>
          <p style="color:#6b7280;font-size:13px;margin:32px 0 0">— Merkato Store Support Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

async function sendReply({ customerName, customerEmail, subject, replyText, adminName }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("⚠️  SMTP not configured — skipping reply email");
    return;
  }
  await transporter.sendMail({
    from: FROM(),
    to: customerEmail,
    subject: `Re: ${subject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Support Team Reply</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${customerName},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">
            ${adminName} from Merkato Store Support has replied to your message:
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px 24px;margin:0 0 24px">
            <p style="margin:0;color:#166534;line-height:1.7;white-space:pre-wrap">${replyText}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0">
            If you have further questions, visit our <a href="${process.env.CLIENT_URL}/contact" style="color:#2d7a5a">contact page</a>.
          </p>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— ${adminName}, Merkato Store Support</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

async function sendPasswordReset({ email, resetUrl, expiresMinutes = 15 }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("⚠️  SMTP not configured — skipping password reset email");
    return;
  }
  await transporter.sendMail({
    from: FROM(),
    to: email,
    subject: "Reset Your Merkato Store Password",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Africa &amp; Middle East's Marketplace</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Reset Your Password</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">
            We received a request to reset the password for your Merkato Store account.
            Click the button below to create a new password.
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#2d7a5a,#4ade80);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:50px">
              Reset Password
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px">Or copy and paste this link into your browser:</p>
          <p style="color:#2d7a5a;font-size:12px;word-break:break-all;margin:0 0 24px">${resetUrl}</p>
          <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:14px 18px;margin:0 0 24px">
            <p style="margin:0;font-size:13px;color:#854d0e">⏱ This link will expire in <strong>${expiresMinutes} minutes</strong>.</p>
          </div>
          <p style="color:#374151;font-size:13px;line-height:1.7;margin:0">
            If you did not request a password reset, you can safely ignore this email. Your password will not change.
          </p>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Support Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

async function sendProfileUpdated({ name, email, changedFields }) {
  const transporter = getTransporter();
  if (!transporter) return;
  const fieldList = changedFields.map(f => `<li style="color:#374151;font-size:14px;line-height:1.8">${f}</li>`).join("");
  await transporter.sendMail({
    from: FROM(),
    to: email,
    subject: "Your Merkato Store profile has been updated",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Account Update Notification</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">Your Merkato Store profile was just updated. The following information was changed:</p>
          <ul style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px 16px 36px;margin:0 0 24px">${fieldList}</ul>
          <p style="color:#374151;line-height:1.7;margin:0 0 8px">If you did not make this change, please <a href="${process.env.CLIENT_URL}/account/settings" style="color:#2d7a5a;font-weight:600">secure your account</a> immediately.</p>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Support Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

async function sendPasswordChanged({ name, email }) {
  const transporter = getTransporter();
  if (!transporter) return;
  const time = new Date().toUTCString();
  await transporter.sendMail({
    from: FROM(),
    to: email,
    subject: "Your Merkato Store password has been changed",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Security Notification</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">Your Merkato Store account password was successfully changed.</p>
          <div style="background:#f9fafb;border-left:4px solid #2d7a5a;border-radius:4px;padding:14px 18px;margin:0 0 24px">
            <p style="margin:0;font-size:13px;color:#6b7280">⏰ Changed at: <strong style="color:#111827">${time}</strong></p>
          </div>
          <p style="color:#374151;line-height:1.7;margin:0 0 8px">If you did not make this change, please <a href="${process.env.CLIENT_URL}/forgot-password" style="color:#2d7a5a;font-weight:600">reset your password</a> immediately and contact support.</p>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Support Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendAcknowledgment, sendReply, sendPasswordReset, sendProfileUpdated, sendPasswordChanged };

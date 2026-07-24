const BREVO_API = "https://api.brevo.com/v3/smtp/email";

const BRAND = {
  name:    "Merkato Store",
  tagline: "Africa & Middle East's Marketplace",
  color:   "#2d7a5a",
  url:     () => process.env.CLIENT_URL || "https://merkato-store-web.vercel.app",
  year:    () => new Date().getFullYear(),
};

function layout(headerTag, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${BRAND.name}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2d7a5a 0%,#22c55e 100%);padding:36px 48px">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px">${BRAND.name}</p>
            <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.75);letter-spacing:0.5px;text-transform:uppercase">${headerTag}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 48px">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:24px 48px;border-top:1px solid #e5e7eb">
            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6">
              You received this email because you have an account with ${BRAND.name}.<br>
              © ${BRAND.year()} ${BRAND.name}. All rights reserved. &nbsp;·&nbsp;
              <a href="${BRAND.url()}" style="color:#6b7280;text-decoration:none">${BRAND.url().replace("https://", "")}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">`;
}

function badge(text, color = "#dcfce7", textColor = "#166534") {
  return `<span style="display:inline-block;background:${color};color:${textColor};font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;padding:4px 10px;border-radius:20px">${text}</span>`;
}

async function sendMail({ to, toName, subject, html }) {
  if (!process.env.BREVO_API_KEY) {
    console.warn("⚠️  Brevo not configured — skipping email");
    return;
  }
  const res = await fetch(BREVO_API, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name:  process.env.BREVO_SENDER_NAME || BRAND.name,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to, name: toName || to }],
      subject,
      htmlContent: html,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Brevo API error");
  return data;
}

// ── OTP Verification ─────────────────────────────────────────────────────────
async function sendOtpEmail({ name, email, otp }) {
  await sendMail({
    to: email, toName: name,
    subject: `${otp} is your Merkato Store verification code`,
    html: layout("Email Verification", `
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Verify your email address</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Hi ${name}, welcome to ${BRAND.name}. Please use the code below to complete your registration.</p>

      <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;letter-spacing:1px;text-transform:uppercase">Your verification code</p>
        <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:16px;color:#2d7a5a;font-family:'Courier New',monospace">${otp}</p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin:0 0 28px">
        <tr><td style="padding:14px 18px">
          <p style="margin:0;font-size:13px;color:#92400e">
            <strong>⏱ This code expires in 10 minutes.</strong> For your security, do not share this code with anyone — ${BRAND.name} will never ask for it.
          </p>
        </td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#9ca3af">Didn't create an account? You can safely ignore this email — no action is required.</p>
    `),
  });
}

// ── Password Reset ────────────────────────────────────────────────────────────
async function sendPasswordReset({ email, resetUrl, expiresMinutes = 15 }) {
  await sendMail({
    to: email,
    subject: "Reset your Merkato Store password",
    html: layout("Password Reset", `
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Forgot your password?</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">No worries — it happens to the best of us. Click the button below to create a new password for your account.</p>

      <div style="text-align:center;margin:0 0 28px">
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#2d7a5a,#22c55e);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:16px 40px;border-radius:50px;letter-spacing:0.2px">
          Reset My Password
        </a>
      </div>

      <p style="margin:0 0 8px;font-size:13px;color:#9ca3af">Button not working? Copy and paste this link into your browser:</p>
      <p style="margin:0 0 28px;font-size:12px;color:#2d7a5a;word-break:break-all">${resetUrl}</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin:0 0 28px">
        <tr><td style="padding:14px 18px">
          <p style="margin:0;font-size:13px;color:#92400e">
            <strong>⏱ This link expires in ${expiresMinutes} minutes.</strong> If you did not request a password reset, please ignore this email — your password will remain unchanged.
          </p>
        </td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#9ca3af">For security, this link can only be used once. If you need a new one, visit the <a href="${BRAND.url()}/forgot-password" style="color:#2d7a5a">forgot password</a> page.</p>
    `),
  });
}

// ── Contact Acknowledgment ────────────────────────────────────────────────────
async function sendAcknowledgment({ name, email, subject }) {
  await sendMail({
    to: email, toName: name,
    subject: `We've received your message — ${subject}`,
    html: layout("Support", `
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Thank you for reaching out</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Hi ${name}, we've received your message and a member of our support team will get back to you shortly.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 28px">
        <tr><td style="padding:20px 24px">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:0.8px;text-transform:uppercase">Subject</p>
          <p style="margin:0;font-size:15px;font-weight:600;color:#111827">${subject}</p>
        </td></tr>
      </table>

      <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">Our support team typically responds within <strong>24 hours</strong> on business days. We appreciate your patience.</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7">In the meantime, you may find answers to common questions in our <a href="${BRAND.url()}/faq" style="color:#2d7a5a;font-weight:600">Help Center</a>.</p>

      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af">Warm regards,<br><strong style="color:#374151">The ${BRAND.name} Support Team</strong></p>
    `),
  });
}

// ── Support Reply ─────────────────────────────────────────────────────────────
async function sendReply({ customerName, customerEmail, subject, replyText, adminName }) {
  await sendMail({
    to: customerEmail, toName: customerName,
    subject: `Re: ${subject}`,
    html: layout("Support Reply", `
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">We've responded to your message</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Hi ${customerName}, ${adminName} from our support team has replied to your inquiry.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 8px">
        <tr><td style="padding:12px 24px;border-bottom:1px solid #e5e7eb">
          <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:0.8px;text-transform:uppercase">Re: ${subject}</p>
        </td></tr>
        <tr><td style="padding:20px 24px">
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.8;white-space:pre-wrap">${replyText}</p>
        </td></tr>
      </table>
      <p style="margin:0 0 28px;font-size:12px;color:#9ca3af;text-align:right">${adminName} · ${BRAND.name} Support</p>

      <p style="margin:0;font-size:13px;color:#6b7280">Have a follow-up question? Visit our <a href="${BRAND.url()}/contact" style="color:#2d7a5a;font-weight:600">contact page</a> and we'll be happy to help.</p>
    `),
  });
}

// ── Profile Updated ───────────────────────────────────────────────────────────
async function sendProfileUpdated({ name, email, changedFields }) {
  const fieldList = changedFields.map(f =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151">✓ &nbsp;${f}</td></tr>`
  ).join("");
  await sendMail({
    to: email, toName: name,
    subject: "Your Merkato Store profile has been updated",
    html: layout("Account Security", `
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Profile update confirmed</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Hi ${name}, the following changes were made to your ${BRAND.name} account.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:0 0 28px">
        <tr><td style="background:#f9fafb;padding:12px 20px;border-bottom:1px solid #e5e7eb">
          <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:0.8px;text-transform:uppercase">Changes made</p>
        </td></tr>
        <tr><td style="padding:4px 20px">
          <table width="100%" cellpadding="0" cellspacing="0">${fieldList}</table>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin:0 0 28px">
        <tr><td style="padding:14px 18px">
          <p style="margin:0;font-size:13px;color:#991b1b">
            <strong>Wasn't you?</strong> If you did not make these changes, please <a href="${BRAND.url()}/account/settings" style="color:#dc2626;font-weight:600">secure your account</a> immediately or contact our support team.
          </p>
        </td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#9ca3af">This is an automated security notification. No action is required if you made these changes.</p>
    `),
  });
}

// ── Password Changed ──────────────────────────────────────────────────────────
async function sendPasswordChanged({ name, email }) {
  const time = new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", timeZone: "UTC" }) + " UTC";
  await sendMail({
    to: email, toName: name,
    subject: "Your Merkato Store password has been changed",
    html: layout("Security Alert", `
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Password changed successfully</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Hi ${name}, your ${BRAND.name} account password was recently updated.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 28px">
        <tr><td style="padding:20px 24px">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:0.8px;text-transform:uppercase">Changed at</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#111827">${time}</p>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin:0 0 28px">
        <tr><td style="padding:14px 18px">
          <p style="margin:0;font-size:13px;color:#991b1b">
            <strong>Wasn't you?</strong> If you did not change your password, your account may be compromised. <a href="${BRAND.url()}/forgot-password" style="color:#dc2626;font-weight:600">Reset your password immediately</a> and contact our support team.
          </p>
        </td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#9ca3af">If you made this change, no further action is needed. Keep your password safe and never share it with anyone.</p>
    `),
  });
}

// ── Job Application Acknowledgment ────────────────────────────────────────────
async function sendApplicationAck({ firstName, email, position }) {
  await sendMail({
    to: email, toName: firstName,
    subject: `Application received — ${position} at ${BRAND.name}`,
    html: layout("Careers", `
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">Application received</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Hi ${firstName}, thank you for your interest in joining the ${BRAND.name} team.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 28px">
        <tr><td style="padding:20px 24px">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:0.8px;text-transform:uppercase">Position applied for</p>
          <p style="margin:0;font-size:16px;font-weight:700;color:#111827">${position}</p>
          <p style="margin:6px 0 0;font-size:12px;color:#6b7280">${BRAND.name} · ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}</p>
        </td></tr>
      </table>

      <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7">We have received your application and our hiring team will carefully review your profile. Here is what to expect next:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151">
            <strong style="color:#2d7a5a">01 &nbsp;</strong> Application review within <strong>5–7 business days</strong>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151">
            <strong style="color:#2d7a5a">02 &nbsp;</strong> Shortlisted candidates will be contacted for an interview
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#374151">
            <strong style="color:#2d7a5a">03 &nbsp;</strong> All applicants will receive a status update
          </td>
        </tr>
      </table>

      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af">We appreciate your interest in ${BRAND.name}. Good luck!<br><strong style="color:#374151">The ${BRAND.name} Careers Team</strong></p>
    `),
  });
}

// ── Job Application Reply ─────────────────────────────────────────────────────
async function sendApplicationReply({ firstName, email, position, replyText, adminName, status }) {
  const statusConfig = {
    reviewing:   { label: "Under Review",      color: "#dbeafe", text: "#1e40af" },
    shortlisted: { label: "Shortlisted 🎉",    color: "#dcfce7", text: "#166534" },
    rejected:    { label: "Application Update", color: "#f3f4f6", text: "#374151" },
    hired:       { label: "Offer Extended 🎉", color: "#dcfce7", text: "#166534" },
    archived:    { label: "Closed",             color: "#f3f4f6", text: "#374151" },
  };
  const s = statusConfig[status] || { label: "Update", color: "#f3f4f6", text: "#374151" };

  await sendMail({
    to: email, toName: firstName,
    subject: `${s.label} — ${position} at ${BRAND.name}`,
    html: layout("Careers Update", `
      <div style="margin:0 0 24px">${badge(s.label, s.color, s.text)}</div>
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827">An update on your application</h2>
      <p style="margin:0 0 28px;font-size:15px;color:#6b7280">Hi ${firstName}, here is the latest update regarding your application for <strong>${position}</strong>.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:0 0 28px">
        <tr><td style="background:#f3f4f6;padding:12px 24px;border-bottom:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;font-weight:600;color:#6b7280">${adminName} · ${BRAND.name} Careers</p>
        </td></tr>
        <tr><td style="padding:20px 24px">
          <p style="margin:0;font-size:14px;color:#374151;line-height:1.8;white-space:pre-wrap">${replyText}</p>
        </td></tr>
      </table>

      <p style="margin:0;font-size:13px;color:#6b7280">Questions? Reach us through our <a href="${BRAND.url()}/contact" style="color:#2d7a5a;font-weight:600">contact page</a>.</p>
      ${divider()}
      <p style="margin:0;font-size:13px;color:#9ca3af">Best regards,<br><strong style="color:#374151">${adminName}, ${BRAND.name} Careers</strong></p>
    `),
  });
}

module.exports = {
  sendOtpEmail,
  sendPasswordReset,
  sendAcknowledgment,
  sendReply,
  sendProfileUpdated,
  sendPasswordChanged,
  sendApplicationAck,
  sendApplicationReply,
};

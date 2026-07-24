const BREVO_API = "https://api.brevo.com/v3/smtp/email";

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
        name: process.env.BREVO_SENDER_NAME || "Merkato Store",
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

async function sendOtpEmail({ name, email, otp }) {
  await sendMail({
    to: email, toName: name,
    subject: "Your Merkato Store verification code",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Email Verification</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">Use the code below to verify your Merkato Store account. It expires in <strong>10 minutes</strong>.</p>
          <div style="text-align:center;margin:32px 0">
            <div style="display:inline-block;background:#f0fdf4;border:2px solid #4ade80;border-radius:16px;padding:20px 48px">
              <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:12px;color:#2d7a5a;font-family:monospace">${otp}</p>
            </div>
          </div>
          <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:14px 18px;margin:0 0 24px">
            <p style="margin:0;font-size:13px;color:#854d0e">⏱ This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <p style="color:#374151;font-size:13px;line-height:1.7;margin:0">If you did not create a Merkato Store account, you can safely ignore this email.</p>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>`,
  });
}

async function sendPasswordReset({ email, resetUrl, expiresMinutes = 15 }) {
  await sendMail({
    to: email,
    subject: "Reset Your Merkato Store Password",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Reset Your Password</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">We received a request to reset your password. Click the button below to create a new one.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#2d7a5a,#4ade80);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:50px">Reset Password</a>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px">Or copy this link:</p>
          <p style="color:#2d7a5a;font-size:12px;word-break:break-all;margin:0 0 24px">${resetUrl}</p>
          <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:14px 18px;margin:0 0 24px">
            <p style="margin:0;font-size:13px;color:#854d0e">⏱ Expires in <strong>${expiresMinutes} minutes</strong>.</p>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Support Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>`,
  });
}

async function sendAcknowledgment({ name, email, subject }) {
  await sendMail({
    to: email, toName: name,
    subject: `We received your message — ${subject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">Thank you for contacting Merkato Store. We have received your message and will respond as soon as possible.</p>
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
      </div>`,
  });
}

async function sendReply({ customerName, customerEmail, subject, replyText, adminName }) {
  await sendMail({
    to: customerEmail, toName: customerName,
    subject: `Re: ${subject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${customerName},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">${adminName} from Merkato Store Support has replied to your message:</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px 24px;margin:0 0 24px">
            <p style="margin:0;color:#166534;line-height:1.7;white-space:pre-wrap">${replyText}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— ${adminName}, Merkato Store Support</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>`,
  });
}

async function sendProfileUpdated({ name, email, changedFields }) {
  const fieldList = changedFields.map(f => `<li style="color:#374151;font-size:14px;line-height:1.8">${f}</li>`).join("");
  await sendMail({
    to: email, toName: name,
    subject: "Your Merkato Store profile has been updated",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">Your profile was just updated. The following information was changed:</p>
          <ul style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px 16px 36px;margin:0 0 24px">${fieldList}</ul>
          <p style="color:#374151;line-height:1.7;margin:0 0 8px">If you did not make this change, please <a href="${process.env.CLIENT_URL}/account/settings" style="color:#2d7a5a;font-weight:600">secure your account</a> immediately.</p>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Support Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>`,
  });
}

async function sendPasswordChanged({ name, email }) {
  const time = new Date().toUTCString();
  await sendMail({
    to: email, toName: name,
    subject: "Your Merkato Store password has been changed",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${name},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">Your account password was successfully changed.</p>
          <div style="background:#f9fafb;border-left:4px solid #2d7a5a;border-radius:4px;padding:14px 18px;margin:0 0 24px">
            <p style="margin:0;font-size:13px;color:#6b7280">⏰ Changed at: <strong style="color:#111827">${time}</strong></p>
          </div>
          <p style="color:#374151;line-height:1.7;margin:0 0 8px">If you did not make this change, <a href="${process.env.CLIENT_URL}/forgot-password" style="color:#2d7a5a;font-weight:600">reset your password</a> immediately.</p>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Support Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>`,
  });
}

async function sendApplicationAck({ firstName, email, position }) {
  await sendMail({
    to: email, toName: firstName,
    subject: `We received your application — ${position}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Careers Team</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Hi ${firstName},</h2>
          <p style="color:#374151;line-height:1.7;margin:0 0 16px">Thank you for applying for the <strong>${position}</strong> position. We have received your application and will carefully review it.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:24px 0">
            <p style="margin:0;font-size:14px;color:#166534;font-weight:600">What happens next?</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#374151;font-size:13px;line-height:1.8">
              <li>Our team reviews applications within <strong>5–7 business days</strong></li>
              <li>Shortlisted candidates will be contacted for an interview</li>
              <li>You will receive an update either way</li>
            </ul>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— Merkato Store Careers Team</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>`,
  });
}

async function sendApplicationReply({ firstName, email, position, replyText, adminName, status }) {
  const statusLabels = { reviewing: "Under Review", shortlisted: "Shortlisted 🎉", rejected: "Application Update", hired: "Offer Extended 🎉", archived: "Application Closed" };
  const subjectPrefix = statusLabels[status] || "Update on Your Application";
  await sendMail({
    to: email, toName: firstName,
    subject: `${subjectPrefix} — ${position} at Merkato Store`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:linear-gradient(135deg,#2d7a5a,#4ade80);padding:32px 40px">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Merkato Store</h1>
          <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:13px">Careers Team</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#111827;font-size:20px;margin:0 0 4px">Hi ${firstName},</h2>
          <p style="color:#6b7280;font-size:13px;margin:0 0 20px">Re: ${position}</p>
          <p style="color:#374151;line-height:1.7;margin:0 0 24px">${adminName} from the Merkato Store Careers team has sent you an update:</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px 24px;margin:0 0 24px">
            <p style="margin:0;color:#166534;line-height:1.7;white-space:pre-wrap">${replyText}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:24px 0 0">— ${adminName}, Merkato Store Careers</p>
        </div>
        <div style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#9ca3af">© ${new Date().getFullYear()} Merkato Store. All rights reserved.</p>
        </div>
      </div>`,
  });
}

module.exports = { sendOtpEmail, sendPasswordReset, sendAcknowledgment, sendReply, sendProfileUpdated, sendPasswordChanged, sendApplicationAck, sendApplicationReply };

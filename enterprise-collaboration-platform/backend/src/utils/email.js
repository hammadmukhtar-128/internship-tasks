const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

function buildTransport() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

const transporter = buildTransport();

/**
 * Sends an email. If SMTP is not configured (common in local/dev setups),
 * logs the email content instead of throwing, so auth flows keep working.
 */
async function sendEmail({ to, subject, html, text }) {
  if (!transporter) {
    logger.warn(`[email] SMTP not configured - would have sent to ${to}: "${subject}"`);
    logger.debug(`[email] body preview: ${text || html}`);
    return { simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });
    return info;
  } catch (err) {
    logger.error(`[email] failed to send to ${to}: ${err.message}`);
    throw err;
  }
}

function passwordResetTemplate(name, resetUrl) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
    <h2 style="color:#4F46E5;">Reset your password</h2>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to choose a new one. This link expires in 10 minutes.</p>
    <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;border-radius:8px;text-decoration:none;margin:16px 0;">Reset Password</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  </div>`;
}

function welcomeTemplate(name) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
    <h2 style="color:#4F46E5;">Welcome to Enterprise Collab, ${name}!</h2>
    <p>Your account has been created successfully. Start creating teams and channels to collaborate with your colleagues.</p>
  </div>`;
}

module.exports = { sendEmail, passwordResetTemplate, welcomeTemplate };

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const send = async ({ to, subject, html }) => {
  // If email credentials aren't configured, skip silently but log it (useful for local dev)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.warn(`Email not sent (no SMTP credentials configured). To: ${to}, Subject: ${subject}`);
    return;
  }
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'LMS Platform <no-reply@lms.com>',
      to,
      subject,
      html
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
  }
};

const wrapper = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#f4f5f7;">
    <div style="background:#ffffff; border-radius: 8px; padding: 32px;">
      <h2 style="color:#4f46e5; margin-top:0;">${title}</h2>
      ${bodyHtml}
      <p style="color:#9ca3af; font-size:12px; margin-top:32px;">Enterprise LMS &copy; ${new Date().getFullYear()}</p>
    </div>
  </div>
`;

const sendWelcomeEmail = (to, name) =>
  send({
    to,
    subject: 'Welcome to Enterprise LMS',
    html: wrapper('Welcome!', `<p>Hi ${name},</p><p>Your account has been created successfully. You can now log in and start exploring courses.</p>`)
  });

const sendForgotPasswordEmail = (to, resetUrl) =>
  send({
    to,
    subject: 'Reset your password',
    html: wrapper(
      'Password Reset Request',
      `<p>You requested a password reset. Click the button below to reset it. This link expires in 10 minutes.</p>
       <p><a href="${resetUrl}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a></p>
       <p>If you did not request this, please ignore this email.</p>`
    )
  });

const sendAssignmentSubmittedEmail = (to, studentName, assignmentTitle) =>
  send({
    to,
    subject: 'Assignment Submitted',
    html: wrapper('Assignment Submitted', `<p>${studentName} has submitted the assignment "<b>${assignmentTitle}</b>".</p>`)
  });

const sendCourseEnrollmentEmail = (to, courseTitle) =>
  send({
    to,
    subject: 'Course Enrollment Confirmation',
    html: wrapper('You are enrolled!', `<p>You have successfully enrolled in "<b>${courseTitle}</b>". Happy learning!</p>`)
  });

const sendCertificateGeneratedEmail = (to, courseTitle, certificateId) =>
  send({
    to,
    subject: 'Certificate Generated',
    html: wrapper(
      'Congratulations!',
      `<p>You have completed "<b>${courseTitle}</b>". Your certificate ID is <b>${certificateId}</b>.</p>`
    )
  });

module.exports = {
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendAssignmentSubmittedEmail,
  sendCourseEnrollmentEmail,
  sendCertificateGeneratedEmail
};

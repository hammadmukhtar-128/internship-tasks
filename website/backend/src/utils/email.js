import nodemailer from "nodemailer";

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.SMTP_FROM
  );
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

/**
 * Sends a booking-received notification. Silently no-ops (and logs) if SMTP
 * isn't configured, so the booking flow never fails because email isn't set up.
 */
export async function sendAppointmentNotification(data) {
  if (!isSmtpConfigured()) {
    console.info("[email] SMTP not configured — skipping appointment notification email.");
    return { sent: false, reason: "smtp_not_configured" };
  }

  try {
    const transporter = getTransporter();
    const to = process.env.ADMIN_EMAIL || process.env.SMTP_FROM;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      replyTo: data.email,
      subject: `New appointment request — ${data.patientName}`,
      text: [
        "New appointment request received:",
        "",
        `Patient: ${data.patientName}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Service: ${data.service}`,
        data.practitioner ? `Practitioner: ${data.practitioner}` : null,
        `Preferred date: ${data.preferredDate}`,
        `Preferred time: ${data.preferredTime}`,
        data.message ? `Message: ${data.message}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.email,
      subject: "We've received your appointment request",
      text: [
        `Hi ${data.patientName},`,
        "",
        "Thanks for requesting an appointment with us. Here's a summary:",
        "",
        `Service: ${data.service}`,
        `Preferred date: ${data.preferredDate}`,
        `Preferred time: ${data.preferredTime}`,
        "",
        "Our team will contact you shortly to confirm your appointment.",
        "If anything above isn't right, just reply to this email.",
      ].join("\n"),
    });

    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send appointment notification:", err.message);
    return { sent: false, reason: "send_failed" };
  }
}

export async function sendContactNotification(data) {
  if (!isSmtpConfigured()) {
    console.info("[email] SMTP not configured — skipping contact notification email.");
    return { sent: false, reason: "smtp_not_configured" };
  }

  try {
    const transporter = getTransporter();
    const to = process.env.ADMIN_EMAIL || process.env.SMTP_FROM;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      replyTo: data.email,
      subject: `New contact message — ${data.name}`,
      text: [
        "New contact form message:",
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : null,
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send contact notification:", err.message);
    return { sent: false, reason: "send_failed" };
  }
}

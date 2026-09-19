import bcrypt from "bcryptjs";
import { asyncHandler } from "../middleware/errorHandler.js";
import { signAdminSession, cookieOptions, SESSION_COOKIE_NAME } from "../middleware/auth.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminHash) {
    return res.status(503).json({
      error: "Admin login is not configured yet. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH.",
    });
  }

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const valid = await bcrypt.compare(password, adminHash);
  if (!valid) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const token = signAdminSession({ email: adminEmail, role: "admin" });
  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions());
  res.json({ success: true, email: adminEmail });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  res.json({ success: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ email: req.admin.email });
});

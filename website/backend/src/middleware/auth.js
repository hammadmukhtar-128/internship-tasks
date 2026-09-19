import jwt from "jsonwebtoken";

export const SESSION_COOKIE_NAME = "clinic_admin_session";

export function signAdminSession(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
}

export function verifyAdminSession(token) {
  if (!process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Protects a route: requires a valid admin session cookie. Responds 401 if
 * missing or invalid — never trusts client-supplied headers or body for auth.
 */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const session = verifyAdminSession(token);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.admin = session;
  next();
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 12, // 12 hours
  };
}

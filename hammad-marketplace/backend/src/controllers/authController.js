import crypto from "crypto";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { ok, fail } from "../utils/apiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, shopName } = req.body;

  if (!name || !email || !password) {
    return fail(res, "Name, email and password are required", 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return fail(res, "An account with this email already exists", 409);

  const allowedRole = ["vendor"].includes(role) ? "vendor" : "customer";

  const user = await User.create({
    name,
    email,
    password,
    role: allowedRole,
    vendorProfile:
      allowedRole === "vendor"
        ? { shopName: shopName || `${name}'s Shop`, status: "pending" }
        : undefined,
  });

  const token = generateToken(user._id, user.role);
  return ok(res, { user: user.toSafeObject(), token }, "Account created", 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, "Email and password are required", 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return fail(res, "Invalid email or password", 401);
  }

  const token = generateToken(user._id, user.role);
  return ok(res, { user: user.toSafeObject(), token }, "Logged in");
});

export const me = asyncHandler(async (req, res) => {
  return ok(res, req.user.toSafeObject());
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return ok(res, null, "Logged out");
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    return fail(res, "Current password is incorrect", 401);
  }
  user.password = newPassword;
  await user.save();
  return ok(res, null, "Password updated");
});

// Demo-safe forgot/reset password flow: since there is no email service configured,
// the reset token is returned directly in the API response instead of emailed.
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return ok(res, null, "If that email exists, a reset link has been generated");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  await user.save();

  return ok(res, { resetToken }, "Reset token generated (demo mode — no email service configured)");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const hashed = crypto.createHash("sha256").update(token || "").digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) return fail(res, "Reset token is invalid or has expired", 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return ok(res, null, "Password has been reset");
});

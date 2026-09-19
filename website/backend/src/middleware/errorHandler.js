/**
 * Central error handler. Never leaks stack traces or internal details to
 * the client — logs them server-side instead.
 */
export function errorHandler(err, req, res, _next) {
  console.error(`[error] ${req.method} ${req.originalUrl}:`, err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Invalid request data." });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format." });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "A record with this value already exists." });
  }

  res.status(err.status || 500).json({
    error: "Something went wrong on our end. Please try again shortly.",
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found." });
}

/** Wraps an async route handler so thrown errors reach errorHandler. */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

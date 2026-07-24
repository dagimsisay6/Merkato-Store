function errorHandler(err, req, res, next) {
  const status  = err.statusCode || err.status || 500;
  const isProd  = process.env.NODE_ENV === "production";

  // Log all 5xx errors
  if (status >= 500) console.error("❌ Server error:", err.message, err.stack);

  // Postgres unique violation
  if (err.code === "23505") {
    return res.status(409).json({ message: "A record with that value already exists." });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  res.status(status).json({
    message: isProd && status >= 500 ? "Something went wrong. Please try again." : err.message || "Internal server error",
  });
}

module.exports = errorHandler;

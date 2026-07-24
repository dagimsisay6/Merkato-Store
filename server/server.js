require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/auth");
const productRoutes = require("./src/routes/products");
const categoryRoutes = require("./src/routes/categories");
const orderRoutes = require("./src/routes/orders");
const userRoutes = require("./src/routes/users");
const newsletterRoutes = require("./src/routes/newsletter");
const brandRoutes = require("./src/routes/brands");
const countryRoutes = require("./src/routes/countries");
const reviewRoutes = require("./src/routes/reviews");
const messageRoutes = require("./src/routes/messages");
const applicationRoutes = require("./src/routes/applications");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
const allowedOrigins = process.env.CLIENT_URL?.split(",").map(u => u.trim()) || [];
app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api", reviewRoutes);
app.use("/api", messageRoutes);
app.use("/api", applicationRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Keep-alive: ping self every 14 min to prevent Render free tier spin-down
if (process.env.NODE_ENV === "production") {
  const SELF = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  setInterval(() => {
    fetch(`${SELF}/api/health`).catch(() => {});
  }, 14 * 60 * 1000);
}

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

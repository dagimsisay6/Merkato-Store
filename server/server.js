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

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

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

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

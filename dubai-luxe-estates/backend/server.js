require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// Static image serving
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

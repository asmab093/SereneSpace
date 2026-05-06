const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// Load Environment Variables
dotenv.config();

// Production log suppression
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
}

// Force Google DNS to resolve MongoDB Atlas on restricted networks
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const supportRoutes = require("./routes/supportRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const moodRoutes = require("./routes/moodRoutes.js");
const chatRoutes = require("./routes/chatRoutes");

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows server to accept JSON data
app.use(cors()); // Allows Frontend to talk to Backend
app.use(morgan("dev")); // Logs API requests in terminal

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/chat", chatRoutes);

// Test Route
app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SereneSpace Backend is Live and Connected! 🌱",
  });
});

// 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler (Must be defined last)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res
    .status(500)
    .json({ success: false, message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
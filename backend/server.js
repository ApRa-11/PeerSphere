import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import peerRoutes from "./routes/peerRoutes.js";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/peers", peerRoutes);

// Test route
app.get("/api", (req, res) => res.send("API is running..."));

// Database connection
console.log("Connecting to MongoDB:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Serve React build in both dev & prod
    const buildPath = path.join(__dirname, "../frontend/build");
    app.use(express.static(buildPath));

    // Catch-all route for React frontend (Express 5 compatible)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next(); // skip API routes
  res.sendFile(path.join(buildPath, "index.html"));
});


    // Use PORT from .env or default to 8080
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));

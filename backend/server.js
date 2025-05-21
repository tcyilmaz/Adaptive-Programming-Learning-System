// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes.js");
const questionRoutes = require("./routes/questionRoutes.js"); // YENİ: questionRoutes'u import et

const app = express();
const PORT = process.env.PORT || 3001; // Fallback port ekledim

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get("/api/health", (req, res) => {
  // Bu 24. satır olabilir
  res.json({ status: "UP", message: "Backend server is running" });
});

app.use("/api/courses", courseRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).send("Error!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
  db.query("SELECT NOW()", (err, dbResult) => {
    // 'res' yerine 'dbResult' kullandım
    if (err) {
      console.error("Database connection error:", err.stack);
    } else {
      if (dbResult && dbResult.rows && dbResult.rows.length > 0) {
        console.log("Database responded:", dbResult.rows[0].now);
      } else {
        console.log(
          "Database query for NOW() did not return expected results."
        );
      }
    }
  });
});

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const courseRoutes = require('./routes/courseRoutes.js');
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "Backend server is running" });
});

app.use("/api/courses", courseRoutes);

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).send("Error!");
});


app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
  db.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("Database connection error:", err.stack);
    } else {
      console.log("Database responded:", res.rows[0].now);
    }
  });
});

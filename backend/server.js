const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001; 

// Enable CORS 
app.use(cors());
// Allow express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Basic Routes (API Endpoints) ---
// Health check route - good for testing if the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "Backend server is running!" });
});

// Placeholder for future user routes
// app.use('/api/users', require('./routes/userRoutes')); // We'll create this later

// Placeholder for future question routes
// app.use('/api/questions', require('./routes/questionRoutes')); // We'll create this later

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
});

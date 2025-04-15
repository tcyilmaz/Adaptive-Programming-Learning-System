// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Make sure dotenv is configured early
const db = require('./config/db'); // Import db to initiate connection pool

// Import routes
const authRoutes = require('./routes/authRoutes');
// const questionRoutes = require('./routes/questionRoutes'); // Future

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Consider more specific CORS options for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Backend server is running!' });
});

// Use Auth Routes
app.use('/api/auth', authRoutes); // All routes in authRoutes will be prefixed with /api/auth

// Use Question Routes (Future)
// app.use('/api/questions', questionRoutes);


// --- Basic Error Handling (Optional but Recommended) ---
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).send('Something broke!');
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on http://localhost:${PORT}`);
  // Test DB connection on start (optional)
  db.query('SELECT NOW()', (err, res) => {
      if (err) {
          console.error('❌ Database connection error:', err.stack);
      } else {
          console.log('📦 Database responded at:', res.rows[0].now);
      }
  });
});
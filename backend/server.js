const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Database connection (handles local fallback)
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    mode: global.dbFallback ? 'in-memory (fallback)' : 'mongodb (active)',
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'mock-mode'
  });
});

// Serve static assets in production if needed
// (For simplicity we separate frontend and backend servers)

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error occurred' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` Server is running on port ${PORT}`);
  console.log(` Mode: ${global.dbFallback ? 'Fallback In-Memory' : 'MongoDB Connection'}`);
  console.log(` Gemini AI: ${process.env.GEMINI_API_KEY ? 'Active (API Key found)' : 'Mock Active'}`);
  console.log(`=============================================`);
});

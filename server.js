const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Development
  'https://maternal-survey.vercel.app', // Production
  'https://maternal-survey.vercel.app/' // Production with trailing slash
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with or without trailing slash
    if (!origin || allowedOrigins.includes(origin) || 
        allowedOrigins.includes(origin.replace(/\/$/, '')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Legacy browser support
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route imports
const surveyRoutes = require('./routes/surveyRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const responseRoute = require('./routes/responseRoute');

// API routes (versioned)
app.use('/api/v1/responses', surveyRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/adv', analyticsRoutes);
app.use('/api/v1/surveys', responseRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Basic welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Maternal Survey API',
    version: '1.0.0',
    endpoints: {
      survey: '/api/v1/responses',
      auth: '/api/v1/auth',
      analytics: '/api/v1/analytics',
      advanced: '/api/v1/adv'
    },
    documentation: 'https://github.com/your-repo/docs'
  });
});

// Error handling middleware (must be last!)
app.use(errorHandler.errorHandler);

// Server setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
    Server running in ${process.env.NODE_ENV || 'development'} mode
    Port: ${PORT}
    Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
    Time: ${new Date().toLocaleString()}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❗ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❗ Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;
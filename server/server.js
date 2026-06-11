// server/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB, config } = require('./config');
const { logger, errorHandler } = require('./middleware');
const {
  authRoutes,
  tripRoutes,
  alertRoutes,
  safetyRoutes,
  adminRoutes,
  voiceRoutes,
} = require('./routes');

// ----------------------------------------------------------------------
// Express & HTTP server setup
// ----------------------------------------------------------------------
const app = express();
const server = http.createServer(app);

// ----------------------------------------------------------------------
// Middleware
// ----------------------------------------------------------------------
app.use(logger);
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' })); // support larger payloads for audio

// ----------------------------------------------------------------------
// Health check (public)
// ----------------------------------------------------------------------
app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

// ----------------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/voice', voiceRoutes);

// ----------------------------------------------------------------------
// 404 handler for unmatched API routes
// ----------------------------------------------------------------------
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ----------------------------------------------------------------------
// Global error handler (must be after routes)
// ----------------------------------------------------------------------
app.use(errorHandler);

// Socket.IO removed — real-time features now disabled or migrated to HTTP

// ----------------------------------------------------------------------
// Start server
// ----------------------------------------------------------------------
const PORT = config.port;

const startServer = async () => {
  await connectDB(config.mongodbUri); // retry logic inside db.js
  server.listen(PORT, () => {
    console.log(`🚀 SafeRoute AI server running on port ${PORT} in ${config.nodeEnv} mode`);
  });
};

// ----------------------------------------------------------------------
// Graceful shutdown
// ----------------------------------------------------------------------
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

startServer();
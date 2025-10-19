require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/database');
const { initBlockchain } = require('./utils/blockchain');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDatabase();

// Initialize blockchain connection
initBlockchain();

// Start server
const server = app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume-reviewer';
  
  try {
    // Set connection timeout to 3 seconds for quick feedback if local Mongo is not running
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    global.dbFallback = false;
    console.log('>>> MongoDB Connected Successfully!');
  } catch (error) {
    console.error('>>> MongoDB Connection Failed:', error.message);
    console.log('>>> WARNING: Database fallback mode activated. Resume analyses and users will be stored in-memory.');
    global.dbFallback = true;
    isConnected = false;
  }
};

module.exports = { connectDB, isConnected };

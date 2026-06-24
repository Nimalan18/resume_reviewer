const crypto = require('crypto');
const User = require('./User');
const Resume = require('./Resume');

// In-memory data store for fallback mode
const localUsers = [];
const localResumes = [];

// Helper to check database mode
const isFallback = () => !!global.dbFallback;

const dbStore = {
  // --- USER OPERATIONS ---
  
  findUserByEmail: async (email) => {
    const cleanEmail = email.toLowerCase().trim();
    if (isFallback()) {
      return localUsers.find(u => u.email === cleanEmail) || null;
    }
    return await User.findOne({ email: cleanEmail });
  },

  createUser: async (email, hashedPassword) => {
    const cleanEmail = email.toLowerCase().trim();
    if (isFallback()) {
      const newUser = {
        _id: crypto.randomUUID(),
        email: cleanEmail,
        password: hashedPassword,
        createdAt: new Date()
      };
      localUsers.push(newUser);
      return newUser;
    }
    const newUser = new User({ email: cleanEmail, password: hashedPassword });
    return await newUser.save();
  },

  findUserById: async (id) => {
    if (isFallback()) {
      return localUsers.find(u => u._id === id) || null;
    }
    return await User.findById(id);
  },

  // --- RESUME OPERATIONS ---

  createResume: async ({ userId, filename, extractedText, score, strengths, improvements, summary }) => {
    if (isFallback()) {
      const newResume = {
        _id: crypto.randomUUID(),
        user: userId,
        filename,
        extractedText,
        score,
        strengths,
        improvements,
        summary,
        createdAt: new Date()
      };
      localResumes.push(newResume);
      return newResume;
    }
    const newResume = new Resume({
      user: userId,
      filename,
      extractedText,
      score,
      strengths,
      improvements,
      summary
    });
    return await newResume.save();
  },

  getResumesByUserId: async (userId) => {
    if (isFallback()) {
      return localResumes
        .filter(r => r.user === userId)
        .sort((a, b) => b.createdAt - a.createdAt);
    }
    return await Resume.find({ user: userId }).sort({ createdAt: -1 });
  },

  getResumeById: async (id) => {
    if (isFallback()) {
      return localResumes.find(r => r._id === id) || null;
    }
    return await Resume.findById(id);
  }
};

module.exports = dbStore;

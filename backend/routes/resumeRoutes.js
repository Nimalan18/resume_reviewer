const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Multer memory storage
// Enforce file size limit of 5MB
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route   POST api/resume/upload
// @desc    Upload PDF resume and perform AI analysis
// @access  Private
router.post('/upload', authMiddleware, upload.single('resume'), resumeController.uploadResume);

// @route   GET api/resume/history
// @desc    Get user's uploaded resumes history
// @access  Private
router.get('/history', authMiddleware, resumeController.getHistory);

// @route   GET api/resume/:id
// @desc    Get details of a specific resume report
// @access  Private
router.get('/:id', authMiddleware, resumeController.getResumeDetails);

module.exports = router;

const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dbStore = require('../models/dbStore');

// Set up Gemini AI if key is available
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('>>> Gemini AI initialized successfully!');
  } catch (err) {
    console.error('>>> Gemini AI initialization failed:', err.message);
  }
} else {
  console.log('>>> GEMINI_API_KEY not found. Resume analysis will use realistic mock data.');
}

// Generate realistic mock response based on extracted text content
const generateMockAnalysis = (text, filename) => {
  const lowercaseText = text.toLowerCase();
  
  // 1. Contact Details Check
  let contactPoints = 0;
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(lowercaseText);
  const hasPhone = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(lowercaseText);
  const hasLinks = /linkedin\.com|github\.com|portfolio|http/i.test(lowercaseText);
  
  if (hasEmail) contactPoints += 3;
  if (hasPhone) contactPoints += 3;
  if (hasLinks) contactPoints += 4;

  // 2. Sections Completeness Check
  let sectionPoints = 0;
  const sections = {
    education: /education|school|university|college|academic/i.test(lowercaseText),
    experience: /experience|employment|work history|professional history|professional background/i.test(lowercaseText),
    skills: /skills|technologies|expertise|technical/i.test(lowercaseText),
    projects: /projects|academic projects|personal projects/i.test(lowercaseText),
    summary: /summary|profile|objective|about me/i.test(lowercaseText)
  };

  if (sections.education) sectionPoints += 3;
  if (sections.experience) sectionPoints += 4;
  if (sections.skills) sectionPoints += 3;
  if (sections.projects) sectionPoints += 3;
  if (sections.summary) sectionPoints += 2;

  // 3. Action Verbs Check
  let verbPoints = 0;
  const actionVerbs = /\b(led|managed|developed|designed|implemented|created|optimized|reduced|spearheaded|built|designed|analyzed|achieved|improved|delivered|launched)\b/gi;
  const verbMatches = lowercaseText.match(actionVerbs) || [];
  const verbCount = verbMatches.length;
  if (verbCount >= 8) verbPoints = 10;
  else if (verbCount >= 4) verbPoints = 5;
  else if (verbCount >= 1) verbPoints = 2;

  // 4. Quantifiable Metrics Check
  let metricPoints = 0;
  const metrics = /\b(\d+%\s*|\$\d+|\d+\s*percent|\bmillion\b|\bthousand\b)\b/gi;
  const metricMatches = lowercaseText.match(metrics) || [];
  const metricCount = metricMatches.length;
  if (metricCount >= 5) metricPoints = 10;
  else if (metricCount >= 2) metricPoints = 5;

  // 5. Word Count (Length & formatting density)
  let wordPoints = 0;
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words >= 250 && words <= 800) wordPoints = 10;
  else if (words > 800 && words <= 1200) wordPoints = 7;
  else if (words > 1200) wordPoints = 4;
  else if (words > 50) wordPoints = 3;

  // 6. Technical Skills Match Check
  let skillPoints = 0;
  const techKeywords = ['react', 'javascript', 'typescript', 'html', 'css', 'node', 'python', 'express', 'mongodb', 'sql', 'aws', 'docker', 'kubernetes', 'git', 'graphql', 'java', 'c++', 'rust'];
  let foundSkills = 0;
  techKeywords.forEach(kw => {
    if (lowercaseText.includes(kw)) {
      foundSkills++;
    }
  });
  if (foundSkills >= 6) skillPoints = 10;
  else if (foundSkills >= 3) skillPoints = 6;
  else if (foundSkills >= 1) skillPoints = 3;

  // Calculate final score
  let score = 30 + contactPoints + sectionPoints + verbPoints + metricPoints + wordPoints + skillPoints;
  score = Math.min(Math.max(Math.round(score), 35), 98);

  // Generate dynamic contextual strengths
  const strengths = [];
  if (hasEmail && hasPhone && hasLinks) {
    strengths.push("Excellent professional contact section, providing clear channels (email, phone, profiles) for recruiter outreach.");
  } else {
    strengths.push("Contains clear direct contact details for recruiters.");
  }

  if (verbCount >= 5) {
    strengths.push("Demonstrates clear professional impact by using active technical and leadership verbs.");
  } else {
    strengths.push("Good organization of career qualifications and academic milestones.");
  }

  if (foundSkills >= 5) {
    strengths.push("Showcases a strong, well-defined set of modern technical skills and tool stack.");
  } else {
    strengths.push("Clearly outlines core baseline technical qualifications.");
  }

  // Generate dynamic contextual improvements
  const improvements = [];
  if (!hasLinks) {
    improvements.push("Add direct clickable links to professional profiles (e.g. LinkedIn, GitHub, or online portfolio) to showcase practical code.");
  } else if (!hasEmail || !hasPhone) {
    improvements.push("Ensure both a professional email and contact phone number are clearly visible at the top.");
  }

  if (verbCount < 5) {
    improvements.push("Start bullet points with stronger action verbs (such as 'spearheaded', 'orchestrated', 'automated') instead of descriptions of duties.");
  }

  if (metricCount < 3) {
    improvements.push("Quantify your achievements (e.g., 'reduced load times by 20%', 'managed team of 4') to demonstrate clear metrics-driven impact.");
  }

  if (words < 200) {
    improvements.push("Expand on project contributions and key achievements under your experience sections to provide adequate context.");
  } else if (words > 1200) {
    improvements.push("Condense descriptions and bullet points to fit the resume onto a cleaner, more concise 1-2 page format.");
  }

  // Ensure lists have exactly 3 items
  while (strengths.length < 3) {
    strengths.push("Consistent layout architecture and readable font formatting.");
  }
  while (improvements.length < 3) {
    improvements.push("Customize your professional summary statement to target specific job description keywords.");
  }

  // Build evaluation summary
  let summary = `Evaluation Report for ${filename}: The resume scores ${score}/100. `;
  if (score >= 80) {
    summary += "This is a highly competitive resume featuring rich skill descriptions, strong action verbs, and clear professional impact. Minor layout tuning and specific keyword targeting will maximize its ATS performance.";
  } else if (score >= 60) {
    summary += "The resume presents a solid baseline but requires polishing. To stand out, focus on replacing passive descriptions with strong action verbs and add metrics to quantify your project results.";
  } else {
    summary += "The resume requires significant revisions. Bullet points are missing quantified impact, and key contact details or structural sections are absent. Reorganize with distinct headers and detail your technical projects.";
  }

  return {
    score,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    summary
  };
};

// Main Controller handlers
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF resume file.' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Invalid file format. Only PDF files are supported.' });
    }

    // Extract text from the uploaded PDF buffer
    let text = '';
    try {
      const pdfData = await pdf(req.file.buffer);
      text = pdfData.text;
    } catch (parseErr) {
      console.error('PDF parsing error:', parseErr);
      return res.status(400).json({ message: 'Failed to extract text from the PDF file. Ensure the PDF is not corrupt or scanned as image only.' });
    }

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ 
        message: 'The PDF has too little extractable text. Please upload a digital resume containing text (not an image-only scan).' 
      });
    }

    let analysisResult;

    // Call Gemini API if initialized, else fall back to mock
    if (genAI) {
      try {
        console.log(`>>> Analyzing resume "${req.file.originalname}" using Gemini AI...`);
        
        // Use gemini-2.5-flash for speed and reliability, and enforce JSON response
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `
          You are an expert technical recruiter and resume reviewer.
          Analyze the following resume text and provide a structured review in JSON format.
          
          The JSON must contain exactly these fields:
          1. "score": a number between 0 and 100 representing the resume's overall quality and formatting.
          2. "strengths": an array of exactly 3 strings representing the top 3 strengths of the resume.
          3. "improvements": an array of exactly 3 strings representing the top 3 suggestions for improvement.
          4. "summary": a brief overall summary paragraph of the analysis.

          Resume Text:
          ---
          ${text}
          ---
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Parse JSON output (strip any potential markdown wrappers if returned by Gemini)
        let cleanText = responseText.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
        }
        
        analysisResult = JSON.parse(cleanText);
        
        // Validate analysis output format
        if (!analysisResult.score || !Array.isArray(analysisResult.strengths) || !Array.isArray(analysisResult.improvements)) {
          throw new Error('Gemini response format is invalid');
        }
        
      } catch (aiError) {
        console.error('>>> Gemini AI analysis failed, falling back to mock analysis:', aiError.message);
        analysisResult = generateMockAnalysis(text, req.file.originalname);
      }
    } else {
      // Mock analysis fallback
      analysisResult = generateMockAnalysis(text, req.file.originalname);
    }

    // Save report in DB linked to the user
    const newResume = await dbStore.createResume({
      userId: req.user.id,
      filename: req.file.originalname,
      extractedText: text,
      score: Number(analysisResult.score),
      strengths: analysisResult.strengths,
      improvements: analysisResult.improvements,
      summary: analysisResult.summary || 'Resume analysis completed.'
    });

    res.status(201).json(newResume);

  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({ message: 'Server error occurred during resume upload and analysis.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const resumes = await dbStore.getResumesByUserId(req.user.id);
    res.json(resumes);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Server error fetching upload history.' });
  }
};

exports.getResumeDetails = async (req, res) => {
  try {
    const resume = await dbStore.getResumeById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis report not found' });
    }

    // Security check: ensure report belongs to the authenticated user
    if (resume.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this resume report' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Fetch resume details error:', error);
    res.status(500).json({ message: 'Server error fetching resume report details.' });
  }
};

# AI Resume Reviewer

A beautiful, modern, full-stack web application that extracts text from uploaded PDF resumes, analyzes them using Google Gemini AI, and presents key statistics, score assessments, strengths, and targeted improvement suggestions on a responsive dashboard.

---

## Key Features

- **Secure Login & Registration**: Account registration and login powered by secure JWT authentication.
- **Drag-and-Drop Resume Upload**: Seamless file upload interface supporting PDF files (up to 5MB).
- **Automated Text Extraction**: Behind-the-scenes text parsing from digital PDF nodes using `pdf-parse`.
- **Gemini AI Analysis**: Fully integrated with the Google Gemini AI API (`gemini-2.5-flash`) with structured JSON outputs.
- **Color-Coded Circular Score Gauge**: Premium visual SVG-based evaluation dial tracking.
- **Strengths & Improvements Cards**: 3 custom strengths and 3 optimization suggest cards.
- **Statistics Dashboard**: Visual indicators charting total uploaded files, mean scoring, and max score logs.
- **Smart Fallback Modes**:
  - **Database Fallback:** If you don't have MongoDB installed or running, the backend automatically fallbacks to an in-memory cache.
  - **AI Model Fallback:** If you don't configure a Gemini API key, the system generates high-fidelity mock resume analyses based on your content, making it immediately testable.

---

## Technical Stack

- **Frontend**: React.js, Tailwind CSS v4, Vite, Axios, Lucide Icons, React Router.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer, pdf-parse.
- **Database**: MongoDB (via Mongoose), with in-memory fallback.

---

## Getting Started

### 1. Requirements

Make sure you have [Node.js](https://nodejs.org/) (v16+) installed.

### 2. Set Up Environment Variables (Optional)

Navigate to the `backend/` folder and inspect the `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/resume-reviewer
JWT_SECRET=super_secret_key_resume_reviewer_987654

# To use real AI reviews, add your key below. If left blank, it will run in Mock Mode.
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Launch Development Servers

You can run both the frontend client (Vite) and the backend server (Express) concurrently with a single command from the **root directory**:

```bash
# Run both client & server
npm run dev
```

- **Frontend Server**: Runs on [http://localhost:5173/](http://localhost:5173/)
- **Backend Server**: Runs on [http://localhost:5000/](http://localhost:5000/)

---

## Development & testing

1. Open [http://localhost:5173/](http://localhost:5173/) in your browser.
2. Select **Register** and create a new account (e.g. `test@example.com` / `password123`).
3. You will be redirected to the **Dashboard**.
4. Click **Upload Resume** (or *Scan Your First Resume*), select a PDF format resume, and click **Upload & Analyze with AI**.
5. Wait for the processing animation to finish (Uploading -> Parsing -> Evaluating).
6. View your circular score dial, executive summary paragraphs, strengths, and suggestions.
7. Click **Back to Dashboard** to view your list of past scans and see updated upload stats!

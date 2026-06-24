import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, FileText, AlertCircle, RefreshCw } from 'lucide-react';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [progressState, setProgressState] = useState(''); // 'uploading', 'parsing', 'analyzing', ''
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // Validate file type and size
  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF documents are supported at this time.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size exceeds the 5MB limit. Please upload a smaller PDF file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a resume file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setError(null);
    setProgressState('uploading');

    // Artificial timing delays to make progress phases readable for premium UX
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // Phase 1: Uploading
      await delay(800);
      setProgressState('parsing');

      // Phase 2: Parsing (this runs the actual request in background)
      const uploadPromise = axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await delay(1000);
      setProgressState('analyzing');

      // Phase 3: AI Analysis (wait for server response)
      const res = await uploadPromise;
      
      setProgressState('compiling');
      await delay(600);

      // Redirect to result page
      navigate(`/result/${res.data._id}`);

    } catch (err) {
      console.error('Upload fail:', err);
      setProgressState('');
      const errMsg = err.response?.data?.message || 'Failed to process resume. Please ensure the PDF is readable and try again.';
      setError(errMsg);
    }
  };

  const getProgressMessage = () => {
    switch (progressState) {
      case 'uploading': return 'Uploading PDF to secure server...';
      case 'parsing': return 'Extracting text payload from document...';
      case 'analyzing': return 'Running Google Gemini AI evaluation models...';
      case 'compiling': return 'Formatting results dashboard...';
      default: return '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in relative">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="text-center mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
          Analyze Your Resume
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Upload your resume in PDF format. Our AI recruiter assistant will evaluate your credentials, score it, and list actionable improvements.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {progressState ? (
        /* Animated Loading Panel during active upload */
        <div className="glass-panel rounded-2xl p-10 border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full animate-ping"></div>
          </div>
          
          <h3 className="font-display font-extrabold text-lg text-white mb-2">Analyzing Resume</h3>
          <p className="text-indigo-400 text-sm font-medium animate-pulse">{getProgressMessage()}</p>
          <p className="text-slate-500 text-xs mt-4">Please do not refresh the page or click back.</p>
        </div>
      ) : (
        /* Dropzone Upload form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`glass-panel border-2 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-950/10 scale-[0.99]'
                : file
                ? 'border-emerald-500/50 bg-emerald-950/5'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/10'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />

            {file ? (
              /* Selected file state */
              <>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-white max-w-sm truncate mb-1">
                  {file.name}
                </h3>
                <span className="text-slate-500 text-xs font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <p className="text-indigo-400 text-xs mt-4 hover:underline">
                  Click or drag another file to replace
                </p>
              </>
            ) : (
              /* Waiting file state */
              <>
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400 mb-4 group-hover:text-indigo-400 transition-colors">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-white mb-1.5">
                  Drag and drop your PDF resume
                </h3>
                <p className="text-slate-400 text-sm max-w-xs mb-1">
                  or click to browse local files
                </p>
                <span className="text-slate-500 text-xs font-mono">
                  PDF format only (Max 5MB)
                </span>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file}
            className="w-full py-3.5 px-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 active:scale-[0.99] rounded-xl transition-all shadow-lg shadow-indigo-600/15 disabled:opacity-50 disabled:pointer-events-none"
          >
            Upload & Analyze with AI
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadResume;

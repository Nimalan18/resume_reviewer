import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Sparkles,
  Calendar
} from 'lucide-react';

const ResultPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/api/resume/${id}`);
        setData(res.data);
      } catch (err) {
        console.error('Fetch resume details error:', err);
        setError('Failed to fetch the resume analysis report. Ensure you have authorization.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Smooth score count-up animation
  useEffect(() => {
    if (data?.score) {
      let current = 0;
      const step = Math.ceil(data.score / 25);
      const timer = setInterval(() => {
        current += step;
        if (current >= data.score) {
          setAnimatedScore(data.score);
          clearInterval(timer);
        } else {
          setAnimatedScore(current);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [data]);

  // Helper for score details
  const getScoreInfo = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'emerald', class: 'text-emerald-400 border-emerald-500/20' };
    if (score >= 60) return { label: 'Good Progress', color: 'amber', class: 'text-amber-400 border-amber-500/20' };
    return { label: 'Needs Improvement', color: 'rose', class: 'text-rose-400 border-rose-500/20' };
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 text-sm">Compiling analysis dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center animate-fade-in">
        <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl text-red-400 mb-6 flex flex-col items-center">
          <AlertTriangle className="w-8 h-8 mb-2" />
          <h3 className="font-display font-bold">Report Error</h3>
          <p className="text-sm mt-1">{error || 'Review details could not be loaded.'}</p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const scoreInfo = getScoreInfo(data.score);

  // SVG Circular Gauge calculation
  // Radius: 60, Circumference: 2 * PI * r = 377
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in relative">
      {/* Background glow flares */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Top Breadcrumb */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header Profile Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 mb-10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              {data.filename}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-slate-400 text-sm font-sans">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                Parsed: {new Date(data.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="hidden sm:inline text-slate-700">|</span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                Status: Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Score Dial & Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Score Dial Circle Card */}
        <div className="glass-panel border border-slate-800/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">AI Evaluation Score</span>
          
          <div className="relative flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-800 fill-none"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className={`fill-none transition-all duration-1000 ease-out ${
                  scoreInfo.color === 'emerald' 
                    ? 'stroke-emerald-500' 
                    : scoreInfo.color === 'amber' 
                    ? 'stroke-amber-500' 
                    : 'stroke-rose-500'
                }`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display font-black text-4xl text-white tracking-tight">{animatedScore}</span>
              <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">out of 100</span>
            </div>
          </div>

          <div className={`mt-6 inline-block px-4 py-1 text-xs font-bold border rounded-full ${scoreInfo.class}`}>
            {scoreInfo.label}
          </div>
        </div>

        {/* Executive Summary Paragraph Card */}
        <div className="md:col-span-2 glass-panel border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-4">
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider">Recruiter Assessment</h2>
            </div>
            <p className="text-slate-300 font-sans text-base leading-relaxed">
              {data.summary || "The AI system has reviewed the parsed textual representations of your work history, listed achievements, and engineering projects. Below are specific pointers regarding your strengths and items to optimize."}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/50 flex flex-wrap items-center gap-3">
            <span className="text-xs text-slate-500">Suggested Action:</span>
            <span className="text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              Address the 3 suggestions below for a higher scoring response.
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Strengths vs Improvements Pointers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths Column Card */}
        <div className="glass-panel border border-slate-800/80 rounded-3xl p-8">
          <div className="flex items-center gap-2.5 text-emerald-400 border-b border-slate-800/60 pb-4 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h2 className="font-display font-extrabold text-lg text-white">Top 3 Strengths</h2>
          </div>
          <div className="space-y-4">
            {data.strengths.map((str, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-950/5 border border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-950/10 transition-all animate-fade-in"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-300 font-sans text-sm leading-relaxed">{str}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements Column Card */}
        <div className="glass-panel border border-slate-800/80 rounded-3xl p-8">
          <div className="flex items-center gap-2.5 text-rose-400 border-b border-slate-800/60 pb-4 mb-6">
            <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
            <h2 className="font-display font-extrabold text-lg text-white">Top 3 Improvement Areas</h2>
          </div>
          <div className="space-y-4">
            {data.improvements.map((imp, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-4 rounded-2xl bg-rose-950/5 border border-rose-500/10 hover:border-rose-500/25 hover:bg-rose-950/10 transition-all animate-fade-in"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <span className="w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-300 font-sans text-sm leading-relaxed">{imp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

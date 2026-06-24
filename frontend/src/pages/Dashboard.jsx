import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, 
  Plus, 
  Award, 
  TrendingUp, 
  History, 
  ChevronRight, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/resume/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load resume analysis history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Compute stats
  const totalAnalyzed = history.length;
  const averageScore = totalAnalyzed > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / totalAnalyzed) 
    : 0;
  const maxScore = totalAnalyzed > 0 
    ? Math.max(...history.map(item => item.score)) 
    : 0;

  // Helper to color code scores
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        {/* Header placeholder */}
        <div className="h-8 w-48 bg-slate-800 rounded-lg mb-8"></div>
        {/* Stats grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
          <div className="h-32 bg-slate-800 rounded-2xl"></div>
        </div>
        {/* History list placeholder */}
        <div className="h-64 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review previous scans and insights to optimize your resume.
          </p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 shadow-lg shadow-indigo-500/15 transition-all"
        >
          <Plus className="w-4 h-4" />
          Review New Resume
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-8 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Stat 1: Total Uploads */}
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between border border-slate-800/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Resumes Analyzed</span>
            <h3 className="font-display font-black text-4xl text-white mt-2">{totalAnalyzed}</h3>
          </div>
          <div className="p-3.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Average Score */}
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between border border-slate-800/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Average AI Score</span>
            <h3 className="font-display font-black text-4xl text-white mt-2">
              {totalAnalyzed > 0 ? `${averageScore}/100` : '—'}
            </h3>
          </div>
          <div className="p-3.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Best Score */}
        <div className="glass-panel rounded-2xl p-6 flex items-center justify-between border border-slate-800/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Top Resume Score</span>
            <h3 className="font-display font-black text-4xl text-white mt-2">
              {totalAnalyzed > 0 ? `${maxScore}/100` : '—'}
            </h3>
          </div>
          <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800/80 bg-slate-900/40">
          <History className="w-4 h-4 text-indigo-400" />
          <h2 className="font-display font-bold text-base text-slate-200">Upload History</h2>
        </div>

        {history.length === 0 ? (
          /* Empty state */
          <div className="p-12 text-center flex flex-col items-center max-w-md mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-full mb-5">
              <FileCheck className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-white">No resumes scanned yet</h3>
            <p className="text-slate-400 text-sm mt-2 mb-6">
              Upload your resume in PDF format to get detailed strengths, weaknesses, and a score out of 100 from Gemini AI.
            </p>
            <Link
              to="/upload"
              className="px-5 py-3 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
            >
              Scan Your First Resume
            </Link>
          </div>
        ) : (
          /* List History Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-950/20">
                  <th className="py-4 px-6">File Name</th>
                  <th className="py-4 px-6">Date Scanned</th>
                  <th className="py-4 px-6 text-center">AI Score</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((item) => (
                  <tr 
                    key={item._id} 
                    className="hover:bg-slate-900/30 transition-colors group cursor-pointer"
                    onClick={() => window.location.href = `/result/${item._id}`}
                  >
                    {/* Filename */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-indigo-500/30 group-hover:bg-indigo-950/15 transition-all">
                          <FileText className="w-4 h-4 text-indigo-400" />
                        </div>
                        <span className="font-medium text-slate-200 group-hover:text-white transition-colors max-w-xs sm:max-w-md truncate">
                          {item.filename}
                        </span>
                      </div>
                    </td>
                    {/* Date */}
                    <td className="py-4 px-6 text-slate-400 text-sm">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    {/* Score badge */}
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-bold border rounded-full ${getScoreColorClass(item.score)}`}>
                        {item.score} / 100
                      </span>
                    </td>
                    {/* Action link */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/result/${item._id}`}
                        className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                      >
                        View Report
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

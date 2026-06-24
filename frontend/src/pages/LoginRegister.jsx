import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, UserPlus, LogIn, AlertCircle } from 'lucide-react';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [authProgress, setAuthProgress] = useState(false);

  const { login, register, user, error, setError } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Clear errors when toggling tabs
  useEffect(() => {
    setValidationError('');
    setError(null);
  }, [isLogin, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    // Inputs check
    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    setAuthProgress(true);

    if (isLogin) {
      const res = await login(email, password);
      setAuthProgress(false);
      if (res.success) {
        navigate('/dashboard');
      }
    } else {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        setAuthProgress(false);
        return;
      }
      const res = await register(email, password);
      setAuthProgress(false);
      if (res.success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 relative">
      {/* Background ambient blur lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl overflow-hidden border border-slate-800/80 animate-fade-in">
        {/* Toggle tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 text-center font-display font-semibold text-sm transition-all duration-300 ${
              isLogin 
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/10' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </span>
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 text-center font-display font-semibold text-sm transition-all duration-300 ${
              !isLogin 
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/10' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register
            </span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {isLogin 
                ? 'Sign in to access your resume history and new analyses.' 
                : 'Sign up to analyze your resume and optimize your applications.'}
            </p>
          </div>

          {/* Errors indicator */}
          {(validationError || error) && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{validationError || error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans text-sm"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field (Register Only) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans text-sm"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authProgress}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-6 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {authProgress ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;

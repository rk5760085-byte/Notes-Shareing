import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotStatus('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      setForgotStatus(null);
      
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSuccess(true);
      setForgotStatus(
        `Reset link generated: ${res.data.resetToken}. Normally this is emailed, but for testing, you can input it below. (Or check console)`
      );
      console.log('RESET SIMULATION INFO:', res.data);
    } catch (err) {
      setForgotSuccess(false);
      setForgotStatus(err.response?.data?.message || 'Error executing forgot password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950/20">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden p-8 space-y-8 relative">
        
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-450/10 dark:bg-primary-900/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2.5 bg-gradient-to-tr from-primary-500 to-indigo-650 rounded-xl text-white">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
              StudyShare
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100">
            {showForgot ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {showForgot ? 'Retrieve access to your academic profile.' : 'Access your university study guides.'}
          </p>
        </div>

        {/* General Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start space-x-2.5 text-xs font-semibold text-red-650 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Login Form */}
        {!showForgot ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setForgotStatus(null);
                    setForgotSuccess(false);
                  }}
                  className="text-xs font-bold text-primary-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-550 to-indigo-650 text-white font-bold rounded-xl hover:opacity-95 disabled:opacity-50 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="h-4.5 w-4.5" />}
            </button>

            <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </form>
        ) : (
          /* Forgot Password Simulated Form */
          <form onSubmit={handleForgotPassword} className="space-y-5">
            {forgotStatus && (
              <div className={`p-4 border rounded-xl flex items-start space-x-2.5 text-xs font-semibold ${
                forgotSuccess 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450' 
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400'
              }`}>
                {forgotSuccess ? (
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span className="break-all">{forgotStatus}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all"
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-xl hover:opacity-95 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Sending link...' : 'Generate Reset Token'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setError(null);
              }}
              className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 hover:underline"
            >
              Back to Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;

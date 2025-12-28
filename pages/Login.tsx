
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Eye, EyeOff, Lock, Mail, Github, Chrome, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user?: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If Supabase isn't configured, bypass auth for development/demo
    if (!isSupabaseConfigured || !supabase) {
      setLoading(true);
      setTimeout(() => {
        onLogin();
        setLoading(false);
      }, 500);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (view === 'signin') {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { name, role: 'Admin' } }
        });
        if (error) throw error;
        setMessage('Registration successful! Please check your email for verification.');
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <div className="w-full lg:w-[480px] p-8 md:p-16 flex flex-col justify-center bg-white border-r border-slate-100 z-10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">I</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Impulz Desk</h1>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {view === 'signin' ? 'Sign in' : view === 'signup' ? 'Create account' : 'Reset password'}
          </h2>
          <p className="text-slate-500 mt-2">
            {view === 'signin' ? 'Welcome back! Please enter your details.' : view === 'signup' ? 'Start your 14-day free trial today.' : 'Enter your email to receive a reset link.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center space-x-3 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="text-emerald-500" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {view === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 transition-all"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {view !== 'forgot' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {view === 'signin' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <button type="button" onClick={() => setView('forgot')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-100 disabled:opacity-70 active:scale-[0.98]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <span className="flex items-center space-x-2">
                <span>{view === 'signin' ? 'Sign in' : view === 'signup' ? 'Create account' : 'Send reset link'}</span>
                <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            {view === 'signin' ? (
              <>Don't have an account? <button onClick={() => setView('signup')} className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setView('signin')} className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Sign in</button></>
            )}
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-20">
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg")' }}
        ></div>
        
        {/* Gradient Overlay for brand consistency and text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-indigo-800/80 to-violet-900/90 backdrop-blur-[2px]"></div>
        
        <div className="relative max-w-xl z-10 text-white text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8 animate-in slide-in-from-top-4 duration-700">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Live Operations Dashboard</span>
          </div>
          <h2 className="text-6xl font-black mb-8 leading-[1.1] tracking-tight text-white drop-shadow-sm">
            Master your <br /><span className="text-indigo-300">business flow.</span>
          </h2>
          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl">
            <p className="text-xl text-indigo-50/90 leading-relaxed font-light italic">
              "Impulz Desk has transformed how we manage our startup operations. Real-time insights and secure collaboration are total game changers for our growth."
            </p>
            <div className="mt-6 flex items-center justify-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white/20 flex items-center justify-center font-bold text-sm">JS</div>
              <div className="text-left">
                <p className="font-bold text-sm">Jonathan Sterling</p>
                <p className="text-xs text-indigo-200">Founder, Sterling Cloud</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

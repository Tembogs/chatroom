"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, User, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import api from '@/app/api/page';


export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginRole, setLoginRole] = useState<'USER' | 'EXPERT'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      
      const payload = mode === 'login' 
        ? { email, password, role: loginRole } 
        : { email, password, role: 'USER' };    

      // 2. Determine Endpoint
      const endpoint = mode === 'login' ? 'https://marketplace-a.onrender.com/api/auth/login' : 'https://marketplace-a.onrender.com/api/auth/register';

      // 3. API Call
      const { data } = await api.post(endpoint, payload);
      console.log("Full Backend Data:", data);

      // 4. Handle Success: Store Token and User Info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log("Saved Token:", localStorage.getItem('token'));
      console.log("Saved User:", localStorage.getItem('user'));

      // 5. Navigate to respective dashboard
      if (data.user.role === 'EXPERT') {
        router.push('/dashboard/expert');
      } else {
        router.push('/dashboard/client');
      }

    } catch (err: any) {
      // Catch backend errors (e.g., "Invalid credentials" or "Access Denied")
      const message = err.response?.data?.message || "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 w-full max-w-lg mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 bg-[#6366F1] rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-transform hover:scale-105">
          <MessageSquare className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Expert Support</h1>
        <p className="text-slate-500 text-lg">Your gateway to real-time solutions</p>
      </div>

      {/* Auth Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full border border-slate-100 relative overflow-hidden">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400">
            {mode === 'login' ? 'Please enter your details' : 'Registration is for Clients only'}
          </p>
        </div>

        {/* Toggle Switch: Login vs Register */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-8">
          <button 
            type="button"
            onClick={() => setMode('login')} 
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => setMode('register')} 
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* LOGIN ONLY: Role Selector (Organization Standard) */}
          {mode === 'login' && (
            <div className="flex gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-100 mb-2">
              <button 
                type="button" 
                onClick={() => setLoginRole('USER')} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${loginRole === 'USER' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                <User size={14} /> Client
              </button>
              <button 
                type="button" 
                onClick={() => setLoginRole('EXPERT')} 
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${loginRole === 'EXPERT' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                <Briefcase size={14} /> Expert
              </button>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="e.g. alex@company.com" 
              className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-slate-900 focus:border-indigo-500 focus:bg-white outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button 
            disabled={isLoading}
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {mode === 'login' ? `Sign In as ${loginRole === 'USER' ? 'Client' : 'Expert'}` : 'Register as Client'}
          </button>
          {/* Bottom of your form */}
        <div className="mt-6 text-center">
          {mode === 'login' && loginRole !== 'EXPERT' ? (
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setLoginRole('USER'); 
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : loginRole !== 'EXPERT' && (
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
        </form>

        {/* Note about name generation */}
        {mode === 'register' && (
          <p className="mt-4 text-center text-xs text-slate-400 px-4">
            Your display name will be automatically generated from your email.
          </p>
        )}
      </div>
    </div>
  );
}
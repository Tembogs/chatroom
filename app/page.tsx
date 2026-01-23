// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import { MessageSquare, Menu, X, Zap, Shield, Star, } from 'lucide-react';
import  AuthPage  from './components/login/page';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-[#EEF2FF] min-h-screen overflow-x-hidden">
      {/* 1. Responsive Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#EEF2FF]/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <MessageSquare className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-lg md:text-xl font-bold text-slate-900">ExpertFlow</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Features</a>
              <a href="#auth" className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition">Get Started</a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <a href="#features" className="block text-slate-600 font-medium">Features</a>
            <a href="#auth" className="block bg-indigo-600 text-white p-3 rounded-xl text-center font-bold">Sign In</a>
          </div>
        )}
      </nav>

      {/* 2. Hero Section - Responsive Sizing */}
      <section className="pt-32 pb-12 md:pt-48 md:pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Professional Support <br className="hidden sm:block" />
            <span className="text-indigo-600">In Real-Time.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Connect with verified experts instantly. Secure, rated, and ready to solve your problems 24/7.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4 px-2">
            <FeatureBadge icon={<Zap size={14} />} text="Instant" />
            <FeatureBadge icon={<Shield size={14} />} text="Secure" />
            <FeatureBadge icon={<Star size={14} />} text="Top Rated" />
          </div>
        </div>
      </section>

      {/* 3. Auth Section - Centered and Responsive */}
      <section id="auth" className="py-12 md:py-20 bg-gradient-to-b from-transparent to-white/50">
         <div className="container mx-auto max-w-lg md:max-w-xl">
            <AuthPage /> 
         </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 text-center">
        <p className="text-slate-400 text-sm italic">© 2026 ExpertFlow • Organization Standard Secure Protocol</p>
      </footer>
    </div>
  );
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full border border-slate-200 shadow-sm transition hover:shadow-md">
      <span className="text-indigo-600">{icon}</span>
      <span className="text-xs md:text-sm font-bold text-slate-700">{text}</span>
    </div>
  );
}
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Heart 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white border-t border-slate-200 pt-16 pb-8 overflow-hidden">
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand - Centered on mobile */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600  rounded-lg">
                <Image src="/expert.png" alt="ExpertFlow Logo" width={30} height={30} className="object-contain" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">ExpertFlow</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs">
              The world's first sub-100ms technical support ecosystem. Built for developers, by developers.
            </p>
            <div className="flex gap-4 ">
              <SocialIcon icon={<Github size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><FooterLink href="/features" label="Architecture" /></li>
              <li><FooterLink href="/testimonials" label="Success Stories" /></li>
              <li><FooterLink href="#auth" label="Expert Portal" /></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><FooterLink href="#" label="Privacy Policy" /></li>
              <li><FooterLink href="#" label="Terms of Service" /></li>
              <li><FooterLink href="#" label="Security Documentation" /></li>
            </ul>
          </div>

          {/* Column 4: Newsletter - Full width on small screens */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
            <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100">
              <p className="text-xs text-slate-500 mb-4">Get the latest technical updates.</p>
              <div className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="email@work.com" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
                <button className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  Subscribe <Mail size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Responsive Stacking */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-400 text-xs font-medium text-center md:text-left order-2 md:order-1">
            © {currentYear} ExpertFlow Inc. All rights reserved.
          </p>

          {/* The Tembogs Credit - Order 1 on mobile to highlight it */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 rounded-2xl shadow-xl shadow-indigo-100/20 order-1 md:order-2"
          >
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Dev</span>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-white text-sm font-black flex items-center gap-2">
              Tembogs
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart size={14} className="text-rose-500 fill-rose-500" />
              </motion.div>
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

// Sub-components
function FooterLink({ href, label }: { href: string, label: string }) {
  return (
    <Link href={href} className="text-slate-500 hover:text-indigo-600 transition-colors inline-block">
      {label}
    </Link>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a href={href} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
      {icon}
    </a>
  );
}
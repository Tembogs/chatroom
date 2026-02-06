"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { features } from './data'; 
import FloatingShapes from '../background/page'; 


export default function FeaturesPage() {
  return (
    <div className="min-h-screen w-full pb-20 relative overflow-x-hidden overflow-y-auto font-sans bg-linear-to-b from-slate-50 via-white to-slate-100">
      <FloatingShapes />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 pb-24">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-12 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full"
          >
            Platform Capabilities
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6"
          >
            Built for <span className="text-indigo-600">Speed</span> & Precision.
          </motion.h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            ExpertFlow isn't just a chatroom. It's an end-to-end technical support ecosystem 
            designed to eliminate downtime and accelerate learning.
          </p>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              // CHANGE: Using 'animate' instead of 'whileInView' for the initial load 
              // so the user doesn't see a blank screen if the scroll trigger misses.
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-200 hover:border-indigo-300 transition-all shadow-sm"
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {feature.description}
              </p>
              <ul className="space-y-3 text-left">
                <li className="flex items-center text-sm text-slate-500">
                  <ChevronRight className="w-4 h-4 text-indigo-500 mr-2" />
                  Optimized for production environments
                </li>
                <li className="flex items-center text-sm text-slate-500">
                  <ChevronRight className="w-4 h-4 text-indigo-500 mr-2" />
                  Seamless integration
                </li>
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience the difference?</h2>
          <Link href="/#auth" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all group">
            Get Started Now
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
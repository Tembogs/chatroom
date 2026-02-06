"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { testimonials } from './data';

export default function TestimonialSection() {
  return (
    <section className="py-24 z-10 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Developer Trusted.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative"
            >
              <Quote className="absolute top-6 right-8 text-slate-50 w-10 h-10" />
              <p className="text-slate-600 italic mb-8 relative z-10 text-sm">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-xs`}>{t.avatar}</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t.role.split('@')[0]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/components/testimonials" className="text-indigo-600 font-bold flex items-center justify-center gap-2 hover:underline relative z-10">
            Read full success stories <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
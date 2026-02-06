"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faqs } from './data';

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-24 px-4  relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Common Questions</h2>
          <p className="text-slate-600 font-medium">Everything you need to know about the ExpertFlow ecosystem.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="border border-slate-200 rounded-3xl bg-white/50 overflow-hidden transition-all hover:border-indigo-200"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full p-6 text-left flex justify-between items-center gap-4"
              >
                <span className="font-bold text-slate-800 md:text-lg">{faq.question}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openId === faq.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {openId === faq.id ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
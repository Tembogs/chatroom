"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Quote, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { testimonials } from "./data";
import FloatingShapes from "@/app/background/page";

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen w-full pb-20 relative overflow-x-hidden overflow-y-auto font-sans bg-linear-to-b from-slate-50 via-white to-slate-100">
      <FloatingShapes />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">
        {/* Navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-12 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6"
          >
            User <span className="text-indigo-600">Success.</span>
          </motion.h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto italic leading-relaxed">
            "The most valuable feedback comes from those who solved real problems using our platform. Their journeys inspire us to keep building tools that empower people everywhere."
          </p>
        </div>

        {/* Story Cards */}
        <motion.div 
        variants={{ hidden: { opacity: 0, y: 40 }, 
        show: { opacity: 1, y: 0, 
        transition: { staggerChildren: 0.2 } } }} 
        initial="hidden" whileInView="show" 
        viewport={{ once: true }} 
        className="space-y-16" >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 border border-slate-200 shadow-2xl hover:shadow-indigo-100 transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-12 items-start">
                
                {/* Profile Card */}
                <div className="w-full md:w-1/3 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-12">
                  <div
                    className={`w-24 h-24 rounded-full ${t.color} flex items-center justify-center text-3xl font-black mx-auto md:mx-0 mb-6 shadow-lg`}
                  >
                    {t.avatar}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{t.name}</h2>
                  <p className="text-indigo-600 font-semibold mb-4 text-sm uppercase tracking-wider">
                    {t.role}
                  </p>
                  <div className="flex justify-center md:justify-start gap-1 text-amber-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-block w-full">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-widest">
                      Result
                    </p>
                    <p className="text-slate-900 font-black">{t.metrics}</p>
                  </div>
                </div>

                {/* The Story */}
                <div className="w-full md:w-2/3 relative">
                  <Quote className="absolute -top-6 -left-4 text-indigo-100 w-20 h-20 -z-10" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                    "{t.content}"
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {t.longStory}
                  </p>
                  <p className="mt-6 text-sm text-slate-500 italic">
                    — Proof that determination, creativity, and the right tools can transform challenges into achievements.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Ready to write your own success story?
          </h2>
          <p className="text-slate-600 mb-10 max-w-xl mx-auto">
            Join thousands of learners and professionals who have already unlocked new opportunities with us. Your journey starts with a single step.
          </p>
          <Link 
            href="/#auth" 
            className="inline-flex items-center px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all group" > 
              <motion.span 
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300 }} > 
                Start Your First Session 
              </motion.span> 
            <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" /> 
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

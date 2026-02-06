"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { features } from './data';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';



export default function FeatureSection() {
  return (
  <section className="py-24 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Everything you need to <span className="text-indigo-600">scale support.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }} // Increased lift for more impact
            className="group p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden"
          >
            {/* Animated 3D Visual instead of just a flat icon */}
            <div className="relative mb-8 flex justify-start">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`w-20 h-20 flex items-center justify-center rounded-3xl ${feature.bgColor} relative z-10`}
              >
                 {/* PRO TIP: If you have 3D image URLs, use an <img /> here. 
                    If not, the icon still looks great floating! 
                 */}
                <feature.icon className={`w-10 h-10 ${feature.color} drop-shadow-lg`} />
              </motion.div>
              
              {/* Decorative background glow behind the icon */}
              <div className={`absolute -inset-2 blur-2xl opacity-20 ${feature.bgColor} group-hover:opacity-40 transition-opacity`} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {feature.description}
            </p>
            
            {/* Subtle "Learn More" hint that appears on hover */}
            <div className="pt-4 flex items-center text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore Capability <ArrowRight size={14} className="ml-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="mt-16 text-center">
      <Link href="/features" className="group inline-flex items-center gap-2 text-indigo-600 font-black text-lg hover:text-indigo-700 transition-all relative z-10">
        View Detailed Roadmap & Capabilities 
        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  </section>
);
}
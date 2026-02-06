
"use client";

import React, { useState } from 'react';
import { MessageSquare, Menu, X, Zap, Shield, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthPage from './components/login/page';
import FloatingShapes from './background/page';
import FeatureSection from './features/featuresHero';
import TestimonialSection from './components/testimonials/testiomonalsSection';
import FaqSection from './faq/faqSection';
import Footer from './components/footer/page';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation Variants for the staggered badges
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-[#EEF2FF] min-h-screen overflow-x-hidden ">
      <FloatingShapes />
      {/* 1. Navigation with Slide-Down effect */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-[#EEF2FF]/80 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ rotate: 15 }}
                className=" p-2"
              >
                <Image src="/expert.png" alt="ExpertFlow Logo" width={40} height={30}  />
              </motion.div>
              <span className="text-lg md:text-xl font-bold text-slate-900 -mx-4">ExpertFlow</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Features</a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#auth" 
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
              >
                Get Started
              </motion.a>
            </div>

            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu with AnimatePresence */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 overflow-hidden"
            >
              <a href="#features" className="block text-slate-600 font-medium">Features</a>
              <a href="#auth" className="block bg-indigo-600 text-white p-3 rounded-xl text-center font-bold">Sign In</a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* 2. Hero Section - Reveal on Load */}
      <section className="pt-32 pb-12 md:pt-48 md:pb-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
          >
            Professional Support <br className="hidden sm:block" />
            <span className="text-indigo-600 italic">In Real-Time.</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4"
          >
            Connect with verified experts instantly. Secure, rated, and ready to solve your problems 24/7.
          </motion.p>
          
          {/* Staggered Badge Reveal */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4 px-2"
          >
            <FeatureBadge variants={itemVariants} icon={<Zap size={14} />} text="Instant" />
            <FeatureBadge variants={itemVariants} icon={<Shield size={14} />} text="Secure" />
            <FeatureBadge variants={itemVariants} icon={<Star size={14} />} text="Top Rated" />
          </motion.div>
        </div>
      </section>

    {/* 2.5 Trust Bar */}
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-12 relative z-10"
    >
      <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
        Used by professionals from
      </p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
        {/* Replace these with real logos later, using text for now */}
        <span className="text-xl font-bold text-slate-800">TECHCORP</span>
        <span className="text-xl font-bold text-slate-800">GLOBAL-IT</span>
        <span className="text-xl font-bold text-slate-800">SOLUTIONS</span>
        <span className="text-xl font-bold text-slate-800">DEV-HUB</span>
      </div>
    </motion.div>


    {/* 2.6 How It Works Section */}
    <section id="features" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Expertise, <span className="text-indigo-600">Simplified.</span>
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
            We've streamlined the connection between complex problems and specialized solutions.
          </p>
        </motion.div>

        {/* image section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9]">
                Expert Help. <br /> 
                <span className="text-indigo-600">Zero Delay.</span>
              </motion.h1>
              <p className="mt-8 text-lg text-slate-600">
                Connect with Tembogs and other verified specialists in seconds.
              </p>
            </div>

            {/* THE IMAGE AREA */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-125 aspect-square bg-indigo-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-200">
                <Image 
                  src="/tems.png" 
                  alt="Expert Support Illustration"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>
 
        {/* Steps Grid */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-12 relative"
        >
          <StepCard 
            number="01"
            title="Launch a Request"
            description="Detail your technical hurdle. Our matching engine identifies the highest-rated experts for your specific tech stack."
          />
          <StepCard 
            number="02"
            title="Real-Time Session"
            description="Enter a secure, low-latency workspace. Collaborate via live chat and integrated tools to troubleshoot in real-time."
          />
          <StepCard 
            number="03"
            title="Verify & Review"
            description="Confirm the solution meets your standards. Release payment and rate your expert to maintain our high-performance ecosystem."
          />
        </motion.div>
      </div>
    </section>
      
      {/* features */}
      <FeatureSection />

      {/* testimonial */}
      <TestimonialSection />

      {/* FAQ */}
      <FaqSection />

      {/* 3. Auth Section - Reveal on Scroll */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        id="auth" 
        className="py-12 md:py-20 bg-linear-to-b from-transparent to-white/50"
      >
         <div className="container mx-auto max-w-lg md:max-w-xl px-4">
            <AuthPage /> 
         </div>
      </motion.section>
      
      {/* Footer */}
      <Footer /> 
    </div>
  );
}

// Updated FeatureBadge to accept motion variants
function FeatureBadge({ icon, text, variants }: { icon: React.ReactNode; text: string; variants: any }) {
  return (
    <motion.div 
      variants={variants}
      whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
      className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full border border-slate-200 shadow-sm transition cursor-default"
    >
      <span className="text-indigo-600">{icon}</span>
      <span className="text-xs md:text-sm font-bold text-slate-700">{text}</span>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      whileHover={{ 
        y: -8, 
        borderColor: "rgba(79, 70, 229, 0.4)",
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
      }}
      className="relative p-10 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200 transition-colors group"
    >
      {/* Background Number Accent */}
      <div className="absolute top-6 right-8 text-6xl font-black text-slate-100 group-hover:text-indigo-50 transition-colors pointer-events-none">
        {number}
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
          <span className="text-white font-bold">{number}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
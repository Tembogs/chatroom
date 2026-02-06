"use client";
import { motion } from 'framer-motion';

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 ">
      
      {/* 1. The "Sun" - Large Warm Glow */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -right-24 w-125 h-125 bg-linear-to-br from-indigo-200 to-purple-200 rounded-full blur-[50px]"
      />

      {/* 2. The "Moon" - Large Cool Glow */}
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] -left-20 w-150 h-150 bg-linear-to-tr from-blue-100 to-indigo-100 rounded-full blur-[6px]"
      />

      {/* 3. Floating Glass Square */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-32 h-32 bg-purple-400/20 backdrop-blur-[2px] border border-white/10 rounded-3xl  md:block"
        animate={{ 
          y: [0, -40, 0], 
          rotate: [0, 20, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 4. Floating Glass Circle */}
      <motion.div
        className="absolute bottom-[25%] left-[10%] w-48 h-48 bg-indigo-400/20 backdrop-blur-[1px] border border-indigo-200/20 rounded-full  md:block"
        animate={{ 
          y: [0, 30, 0], 
          x: [0, 20, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* 5. Small Geometric Accent*/}
      <motion.div
        className="absolute top-1/2 left-1/3 w-16 h-16 border-t-2 border-l-2 border-indigo-500/10 bg-indigo-500/10 rounded-tl-3xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
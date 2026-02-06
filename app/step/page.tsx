import { motion } from 'framer-motion';
export default function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-indigo-500/5"
    >
      <div className="text-4xl font-black text-indigo-100 mb-4">{number}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
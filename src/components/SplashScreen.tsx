import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { RmkLogo } from './RmkLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden select-none font-sans"
    >
      {/* Background Animated Laser & Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* Sweeping Laser Light Beam */}
      <motion.div
        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 blur-xs pointer-events-none"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 max-w-2xl w-full px-6 text-center space-y-8">
        
        {/* Logos Container: RMK Crest Emblem + IEEE Day 2026 Logo */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          
          {/* RMK Official Logo Asset */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-slate-900 border border-slate-800 p-2.5 shadow-md flex items-center justify-center">
              <RmkLogo className="h-24 sm:h-28 w-auto" />
            </div>
            <div className="mt-2 text-[10px] font-mono font-medium text-slate-300 uppercase tracking-tight">
              R.M.K. ENGINEERING COLLEGE
            </div>
          </motion.div>

          {/* Dividing Neon Beam */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-[2px] h-16 bg-gradient-to-b from-blue-600 via-cyan-400 to-indigo-600 rounded-full"
          />

          {/* IEEE Day 2026 Logo Badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative group"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -inset-3 rounded-full bg-cyan-500/30 blur-md"
            />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border-2 border-cyan-500/80 p-3 shadow-2xl flex flex-col items-center justify-center font-mono">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
                IEEE
              </div>
              <span className="text-[10px] font-extrabold text-white mt-1">IEEE DAY</span>
              <span className="text-[9px] text-cyan-400 font-bold">2026</span>
            </div>
            <div className="mt-2 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-tight">
              STUDENT BRANCH STB61871
            </div>
          </motion.div>

        </div>

        {/* Institution & Event Titles Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-950/80 border border-blue-800 text-blue-300 px-3.5 py-1 rounded-full text-xs font-mono font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>R.M.K. ENGINEERING COLLEGE (AUTONOMOUS)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase font-sans drop-shadow-lg">
            QUIZ ODYSSEY
          </h1>

          <div className="flex items-center justify-center space-x-2 text-cyan-400 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
            <span>Think</span>
            <span className="text-slate-600">•</span>
            <span>Analyze</span>
            <span className="text-slate-600">•</span>
            <span>Solve</span>
          </div>
        </motion.div>

        {/* Loading Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2 font-mono text-xs pt-2"
        >
          <div className="flex justify-between text-slate-400 text-[11px]">
            <span className="flex items-center space-x-1.5 text-blue-300">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>INITIALIZING QUALIFIER PIPELINE...</span>
            </span>
            <span className="font-bold text-cyan-400 tabular-nums">{progress}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <motion.div
              className="bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>

        {/* Skip Intro CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={onComplete}
            className="text-[11px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
          >
            Skip Intro →
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
};

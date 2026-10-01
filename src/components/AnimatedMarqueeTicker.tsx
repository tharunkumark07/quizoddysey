import React from 'react';
import { motion } from 'motion/react';
import { Zap, Trophy, Calendar, Sparkles } from 'lucide-react';

export const AnimatedMarqueeTicker: React.FC = () => {
  const items = [
    { icon: Sparkles, text: "RMKEC STUDENT BRANCH PRESENTS QUIZ ODYSSEY 2026" },
    { icon: Trophy, text: "TOP 6 SHORTLISTED TEAMS ADVANCE TO OFFLINE FINALS" },
    { icon: Calendar, text: "FINALS DATE: 5TH OCT 2026 @ RMKEC AUDITORIUM" },
    { icon: Zap, text: "IEEE DAY 2026 · STB61871 · DEPARTMENT OF IT" },
  ];

  return (
    <div className="bg-blue-950/90 border-b border-blue-900 text-blue-200 overflow-hidden py-2 font-mono text-[11px] font-semibold tracking-wider uppercase flex items-center shadow-inner">
      <motion.div
        className="flex space-x-8 whitespace-nowrap shrink-0"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2 shrink-0">
              <Icon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{item.text}</span>
              <span className="text-blue-700 ml-4">•</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

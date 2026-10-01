import React from 'react';
import { motion } from 'motion/react';

interface GlowBorderCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowBorderCard: React.FC<GlowBorderCardProps> = ({
  children,
  className = '',
  glowColor = 'from-blue-500 via-cyan-400 to-indigo-600',
}) => {
  return (
    <div className={`relative rounded-lg p-[1px] overflow-hidden group ${className}`}>
      {/* Animated Glowing Gradient Border */}
      <motion.div
        className={`absolute -inset-[100%] bg-gradient-to-r ${glowColor} opacity-70 blur-xs group-hover:opacity-100 transition-opacity`}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Card Content Container */}
      <div className="relative bg-slate-900 rounded-lg h-full w-full z-10">
        {children}
      </div>
    </div>
  );
};

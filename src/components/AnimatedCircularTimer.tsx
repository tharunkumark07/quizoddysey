import React from 'react';
import { motion } from 'motion/react';
import { Clock, AlertCircle } from 'lucide-react';

interface AnimatedCircularTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  label?: string;
}

export const AnimatedCircularTimer: React.FC<AnimatedCircularTimerProps> = ({
  remainingSeconds,
  totalSeconds = 15,
  label = "QUESTION TIME",
}) => {
  const isPerQuestion = totalSeconds <= 60;
  const isLowTime = remainingSeconds <= (totalSeconds <= 10 ? 3 : 5);
  const timeStr = isPerQuestion 
    ? `${Math.ceil(remainingSeconds)}s`
    : `${Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:${(Math.floor(remainingSeconds) % 60).toString().padStart(2, '0')}`;

  const progress = Math.max(0, Math.min(1, remainingSeconds / totalSeconds));
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className={`flex items-center space-x-3 rounded-lg px-3 py-1.5 font-mono border transition-colors ${
      isLowTime 
        ? 'bg-rose-950/80 border-rose-600 shadow-rose-900/40 shadow-sm'
        : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Animated Circular SVG Ring */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
          {/* Background Ring */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx="22"
            cy="22"
            r={radius}
            className={isLowTime ? 'stroke-rose-500' : 'stroke-blue-400'}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </svg>
        {isLowTime ? (
          <AlertCircle className="w-3.5 h-3.5 absolute text-rose-400 animate-ping" />
        ) : (
          <Clock className="w-3.5 h-3.5 absolute text-blue-400" />
        )}
      </div>

      <div>
        <div className={`text-[10px] uppercase tracking-wider font-semibold ${
          isLowTime ? 'text-rose-300' : 'text-slate-400'
        }`}>
          {label}
        </div>
        <div className={`font-bold text-sm tabular-nums leading-tight ${
          isLowTime ? 'text-rose-400 animate-pulse' : 'text-white'
        }`}>
          {timeStr}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QuizResult } from '../types/quiz';
import { CheckCircle2, Clock, Check, X, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ResultViewProps {
  result: QuizResult;
  onReturnHome: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onReturnHome,
}) => {
  const finalScore = result.score ?? 0;
  const [displayScore, setDisplayScore] = useState(0);

  // Subtle number counting animation
  useEffect(() => {
    let start = 0;
    const duration = 1200; // 1.2s
    const steps = 30;
    const increment = finalScore / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= finalScore) {
        setDisplayScore(finalScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [finalScore]);

  const formattedTimestamp = new Date(result.submittedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const completionSeconds = result.completionTimeSeconds ?? 0;
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-950 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans text-slate-100 bg-tech-dots">
      
      <div className="max-w-[760px] w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-10 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* 1. Header: QUIZ COMPLETE */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-mono font-semibold text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>QUIZ ODYSSEY // ROUND 01</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            QUIZ COMPLETE
          </h1>

          <p className="text-sm font-sans text-slate-400 max-w-md mx-auto">
            Your examination responses have been encrypted and submitted to the evaluator console.
          </p>
        </motion.div>

        {/* 2. Dominant Animated Score Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-2 relative overflow-hidden"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold block">
            FINAL SCORE
          </span>

          <div className="font-display text-6xl sm:text-7xl font-extrabold text-white tracking-tight">
            <span className="text-blue-400 tabular-nums">{displayScore}</span>
            <span className="text-slate-600 text-3xl sm:text-4xl font-normal"> / 15</span>
          </div>

          <div className="font-mono text-xs text-blue-300 font-medium pt-1">
            CORRECT ANSWERS: {displayScore}
          </div>
        </motion.div>

        {/* 3. Performance Metrics Grid (Correct, Incorrect, Unanswered, Time) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs"
        >
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-[10px] uppercase">CORRECT</span>
            <div className="text-lg font-bold text-emerald-400">
              {result.correctCount ?? finalScore}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-center text-rose-400 mb-1">
              <X className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-[10px] uppercase">INCORRECT</span>
            <div className="text-lg font-bold text-rose-400">
              {result.incorrectCount ?? 0}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-[10px] uppercase">UNANSWERED</span>
            <div className="text-lg font-bold text-slate-300">
              {result.unansweredCount ?? 0}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-center text-cyan-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-[10px] uppercase">TOTAL TIME</span>
            <div className="text-lg font-bold text-cyan-400">
              {formatTime(completionSeconds)}
            </div>
          </div>
        </motion.div>

        {/* 4. Structured Entry Details */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-3 font-mono text-xs border-t border-slate-800 pt-6"
        >
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-400 uppercase">REGISTERED TEAM</span>
            <span className="font-display font-bold text-white text-sm">{result.teamName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-400 uppercase">TEAM MEMBERS</span>
            <span className="text-slate-200">{result.leaderName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-400 uppercase">INSTITUTION</span>
            <span className="text-slate-300">{result.college}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/80">
            <span className="text-slate-400 uppercase">REGISTRATION ID</span>
            <span className="text-blue-400 font-semibold">{result.teamId}</span>
          </div>
          {result.ieeeNumber && (
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400 uppercase">IEEE MEMBER / REG NO</span>
              <span className="text-white font-mono font-bold">{result.ieeeNumber}</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-slate-400 uppercase">TIMESTAMP</span>
            <span className="text-slate-400">{formattedTimestamp}</span>
          </div>
        </motion.div>

        {/* 5. Final Confirmation & Home Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-5 pt-2"
        >
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-1">
            <div className="flex items-center justify-center space-x-1.5 font-mono text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>SUBMISSION RECORDED PERMANENTLY</span>
            </div>
            <p className="text-xs text-slate-400">
              The top 6 qualifying teams will be officially announced on the competition scoreboard.
            </p>
          </div>

          <button
            onClick={onReturnHome}
            className="w-full h-13 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-slate-600 shadow-md cursor-pointer active:scale-[0.98]"
          >
            <span>Return to Event Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, CheckCircle2, XCircle, Play, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const InteractiveTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'puzzle'>('terminal');
  const [typedText, setTypeText] = useState('');
  const [puzzleAnswer, setPuzzleAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const fullPrompt = "> SYSTEM: QUIZ ODYSSEY v2026.1 ONLINE\n> ARCHITECTURE: IEEE SB STB61871\n> STATUS: READY FOR COMPETITION\n> MOTTO: THINK · ANALYZE · SOLVE";

  useEffect(() => {
    let index = 0;
    setTypeText('');
    const timer = setInterval(() => {
      if (index < fullPrompt.length) {
        setTypeText((prev) => prev + fullPrompt.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, []);

  const handlePuzzleSelect = (optionIdx: number) => {
    setPuzzleAnswer(optionIdx);
    // Correct answer is index 1 (Option B: 3)
    // 2 ^ 3 = 1, 1 ^ 2 = 3
    if (optionIdx === 1) {
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs shadow-xl">
      
      {/* Terminal Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-slate-400 font-bold ml-2 flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>QUIZ_ODYSSEY_CONSOLE.sh</span>
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            SYS LOGS
          </button>
          <button
            onClick={() => setActiveTab('puzzle')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
              activeTab === 'puzzle'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>PREVIEW PUZZLE</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 min-h-[160px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeTab === 'terminal' ? (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2 text-cyan-300 whitespace-pre-wrap leading-relaxed"
            >
              <span>{typedText}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-cyan-400 ml-1 align-middle"
              />
            </motion.div>
          ) : (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              <div className="text-slate-300">
                <span className="text-blue-400 font-bold">[LOGIC WARMUP]</span> What is the evaluated result of the Bitwise XOR expression <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">2 ^ 3 ^ 2</code>?
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { idx: 0, text: 'A. 0' },
                  { idx: 1, text: 'B. 3 (Correct)' },
                  { idx: 2, text: 'C. 2' },
                  { idx: 3, text: 'D. 7' },
                ].map((opt) => (
                  <button
                    key={opt.idx}
                    onClick={() => handlePuzzleSelect(opt.idx)}
                    className={`p-2 rounded text-left border transition-all cursor-pointer ${
                      puzzleAnswer === opt.idx
                        ? isAnswerCorrect
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-rose-950 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {isAnswerCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-2 rounded text-[11px] flex items-center space-x-2 ${
                    isAnswerCorrect
                      ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                  }`}
                >
                  {isAnswerCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>EXCELLENT! Bitwise XOR is commutative and associative: (2 ^ 2) ^ 3 = 0 ^ 3 = 3.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>INCORRECT. Hint: Note that X ^ X = 0 and 0 ^ Y = Y.</span>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-3 border-t border-slate-900 text-[10px] text-slate-500 flex justify-between">
          <span>RMKEC_IEEE_STB61871</span>
          <span className="text-cyan-400">LATENCY: 4ms</span>
        </div>
      </div>

    </div>
  );
};

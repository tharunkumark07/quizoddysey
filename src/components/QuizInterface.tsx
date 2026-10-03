import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicQuestion, QuizSessionState } from '../types/quiz';
import { ChevronRight, Send, ShieldAlert, Clock, CheckCircle2, AlertTriangle, Lock, ShieldCheck } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { AnimatedCircularTimer } from './AnimatedCircularTimer';
import { AiSecurityWarningModal } from './AiSecurityWarningModal';

interface QuizInterfaceProps {
  session: QuizSessionState;
  questions: PublicQuestion[];
  onSelectOption: (questionId: number, optionIndex: number) => void;
  onAdvanceQuestion?: (nextIndex: number) => void;
  onSubmitQuiz: () => void;
  onDisqualify: (reason: string) => void;
  isSubmitting: boolean;
}

const QUESTION_LIMIT_SECONDS = 10;

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  session,
  questions,
  onSelectOption,
  onAdvanceQuestion,
  onSubmitQuiz,
  onDisqualify,
  isSubmitting,
}) => {
  const [currentIndex, setCurrentIndex] = useState(session.currentIndex || 0);
  const [questionSecondsLeft, setQuestionSecondsLeft] = useState(QUESTION_LIMIT_SECONDS);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Anti-Cheat & AI Restriction States
  const [violationsCount, setViolationsCount] = useState(0);
  const [showAiWarningModal, setShowAiWarningModal] = useState(false);
  const [violationReason, setViolationReason] = useState('');

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || questions[0];

  const answeredCount = Object.keys(session.answers).length;

  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Strict forward-only advance handler (One-Way Progression)
  const handleAdvance = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setQuestionSecondsLeft(QUESTION_LIMIT_SECONDS);
      onAdvanceQuestion?.(nextIdx);
    } else {
      // Last question reached 0 -> trigger automatic final answer submission
      onSubmitQuiz();
    }
  }, [currentIndex, totalQuestions, onSubmitQuiz, onAdvanceQuestion]);

  // Overall session timeout check -> trigger automatic answer submission
  useEffect(() => {
    if (session.remainingSeconds <= 0 && !session.submitted && !isSubmitting) {
      onSubmitQuiz();
    }
  }, [session.remainingSeconds, session.submitted, isSubmitting, onSubmitQuiz]);

  // 10-second Countdown Effect for Current Question (Fluid 100ms ticks for smooth bar animation)
  useEffect(() => {
    // Pause timer if modal is open or submitting
    if (showConfirmModal || showAiWarningModal || isSubmitting) {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      return;
    }

    questionTimerRef.current = setInterval(() => {
      setQuestionSecondsLeft((prev) => {
        if (prev <= 0.1) {
          handleAdvance();
          return QUESTION_LIMIT_SECONDS;
        }
        return Math.max(0, +(prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [currentIndex, showConfirmModal, showAiWarningModal, isSubmitting, handleAdvance]);

  // Anti-Cheat & AI Detection Handler
  const triggerAntiCheatViolation = useCallback((reason: string) => {
    if (isSubmitting) return;

    if (violationsCount === 0) {
      // First strike -> Issue strong Warning
      setViolationsCount(1);
      setViolationReason(reason);
      setShowAiWarningModal(true);
    } else {
      // Second strike -> Instant Disqualification
      setViolationsCount(2);
      setShowAiWarningModal(false);
      onDisqualify("Disqualified due to multiple AI assistance and tab-navigation violations.");
    }
  }, [violationsCount, isSubmitting, onDisqualify]);

  // Security Event Listeners (Tab change, window blur, copy/paste, DevTools)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitting && !showAiWarningModal) {
        triggerAntiCheatViolation(
          "Tab or window navigation detected. Switching away to external AI tools or websites is prohibited."
        );
      }
    };

    const handleWindowBlur = () => {
      if (!isSubmitting && !showConfirmModal && !showAiWarningModal) {
        triggerAntiCheatViolation(
          "Window focus lost. Navigating to external AI tools, browsers, or applications is prohibited."
        );
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerAntiCheatViolation(
        "Copying question content is prohibited to prevent external AI generation."
      );
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerAntiCheatViolation(
        "Pasting content into the examination interface is prohibited."
      );
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Developer shortcuts block
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        triggerAntiCheatViolation("Developer inspection tools are prohibited during competition.");
        return;
      }

      // Keyboard shortcuts for options (1-4) or forward advance (Enter/Space)
      if (showConfirmModal || showAiWarningModal || isSubmitting) return;

      if (['1', '2', '3', '4'].includes(e.key) && currentQuestion) {
        const optionIdx = parseInt(e.key, 10) - 1;
        onSelectOption(currentQuestion.id, optionIdx);
      } else if (e.key === 'Enter') {
        handleAdvance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    currentIndex,
    totalQuestions,
    showConfirmModal,
    showAiWarningModal,
    isSubmitting,
    currentQuestion,
    onSelectOption,
    handleAdvance,
    triggerAntiCheatViolation,
  ]);

  if (!currentQuestion) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono text-sm text-slate-400">
        Loading examination modules...
      </div>
    );
  }

  const selectedOptionIndex = session.answers[currentQuestion.id];
  const optionPrefixes = ['A', 'B', 'C', 'D'];

  const timerProgress = (questionSecondsLeft / QUESTION_LIMIT_SECONDS) * 100;
  const isUrgent = questionSecondsLeft <= 3.0;
  const timerUrgencyState: 'calm' | 'caution' | 'critical' =
    questionSecondsLeft <= 3.0 ? 'critical' : questionSecondsLeft <= 6.0 ? 'caution' : 'calm';
  const totalCompletionPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="max-w-[1240px] mx-auto space-y-6">
        
        {/* TOP LEVEL: EVENT, OVERALL PROGRESS & 10-SECOND TIMER HEADER */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-5 shadow-lg">
          
          {/* LEFT: Qualifier & AI Security Shield Tag */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="font-semibold text-white tracking-wider uppercase">ROUND 01</span>
            <span className="text-slate-600">•</span>
            <span className="font-semibold text-blue-400">QUIZ ODYSSEY</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI PROCTOR ACTIVE</span>
            </div>
          </div>

          {/* CENTER: Question Progress Pill */}
          <div className="flex items-center space-x-3">
            <div className="font-mono text-xs font-bold text-blue-300 bg-blue-950/80 px-3.5 py-1.5 rounded-lg border border-blue-800/60">
              QUESTION {String(currentIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
            </div>
            <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-400">
              <span>{answeredCount} answered · Strict Sequential Protocol</span>
            </div>
          </div>

          {/* RIGHT: 10s Per-Question Timer & Submit */}
          <div className="flex items-center space-x-4">
            <AnimatedCircularTimer
              remainingSeconds={questionSecondsLeft}
              totalSeconds={QUESTION_LIMIT_SECONDS}
              label="10s TIMER"
            />

            <button
              onClick={() => setShowConfirmModal(true)}
              className="h-10 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center space-x-2 shadow-md shadow-blue-600/20 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finish Quiz</span>
            </button>
          </div>

        </div>

        {/* Overall Completion Progress Bar across Header */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full"
            style={{ width: `${totalCompletionPercent}%` }}
          />
        </div>

        {/* PROMINENT 10-SECOND QUESTION COUNTDOWN PROGRESS BAR BANNER */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-xl ${
          timerUrgencyState === 'critical'
            ? 'bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border-rose-600 shadow-rose-900/40'
            : timerUrgencyState === 'caution'
            ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-amber-600/80 shadow-amber-900/30'
            : 'bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/50 border-slate-800 shadow-slate-950/60'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl border transition-colors ${
                timerUrgencyState === 'critical'
                  ? 'bg-rose-950 border-rose-600 text-rose-400 animate-pulse'
                  : timerUrgencyState === 'caution'
                  ? 'bg-amber-950 border-amber-600 text-amber-400'
                  : 'bg-emerald-950 border-emerald-700 text-emerald-400'
              }`}>
                {timerUrgencyState === 'critical' ? (
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-extrabold text-white uppercase tracking-wider">
                    QUESTION {currentIndex + 1} OF {totalQuestions}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                    timerUrgencyState === 'critical'
                      ? 'bg-rose-950 text-rose-200 border-rose-600 animate-pulse'
                      : timerUrgencyState === 'caution'
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}>
                    {timerUrgencyState === 'critical'
                      ? 'WARNING · EXPIRING SOON'
                      : timerUrgencyState === 'caution'
                      ? 'CAUTION · TIME ELAPSING'
                      : 'CALM · 10S ACTIVE'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {currentIndex < totalQuestions - 1
                    ? '10-second rapid timer • One-way progression • Auto-advances at 0.0s'
                    : 'Final challenge • Auto-submits examination when timer expires'}
                </p>
              </div>
            </div>

            {/* Digital Time Readout */}
            <div className="flex items-baseline space-x-2 font-mono">
              <span className="text-xs text-slate-400 uppercase font-semibold">REMAINING:</span>
              <span className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight transition-colors ${
                timerUrgencyState === 'critical'
                  ? 'text-rose-400 animate-pulse'
                  : timerUrgencyState === 'caution'
                  ? 'text-amber-300'
                  : 'text-emerald-400'
              }`}>
                {questionSecondsLeft.toFixed(1)}s
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 10.0s</span>
            </div>
          </div>

          {/* High-Impact Visual Progress Bar with Continuous Fluid Color Transition from emerald-400 to rose-500 */}
          <div className="w-full bg-slate-950/95 h-4 sm:h-5 rounded-full p-1 border border-slate-800/90 relative overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-100 ease-linear ${
                timerUrgencyState === 'critical'
                  ? 'bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.85)] animate-pulse'
                  : timerUrgencyState === 'caution'
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
              }`}
              style={{ width: `${(questionSecondsLeft / QUESTION_LIMIT_SECONDS) * 100}%` }}
            />
          </div>

          {/* Tick Marks for Precision Feedback */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-1 pt-1">
            <span>0.0s (Auto-advance)</span>
            <span>2.5s</span>
            <span>5.0s (Halfway)</span>
            <span>7.5s</span>
            <span>10.0s (Start)</span>
          </div>
        </div>

        {/* MIDDLE LEVEL: MAIN QUESTION & TIMELINE PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Question Content Area (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-xl">
            
            {/* Top Accent Glowing Line Running Across the Question Card */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-slate-950">
              <div
                className={`h-full transition-all duration-100 ease-linear ${
                  timerUrgencyState === 'critical'
                    ? 'bg-rose-500 shadow-rose-500/60 shadow-md'
                    : timerUrgencyState === 'caution'
                    ? 'bg-amber-400 shadow-amber-500/50 shadow-md'
                    : 'bg-emerald-400 shadow-emerald-500/50 shadow-md'
                }`}
                style={{ width: `${timerProgress}%` }}
              />
            </div>

            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 pt-1">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs uppercase font-medium text-slate-400 tracking-wider">
                  DOMAIN: <span className="text-blue-400 font-bold">{currentQuestion.category}</span>
                </span>
                {isUrgent && (
                  <span className="font-mono text-[11px] text-rose-400 bg-rose-950 border border-rose-800 px-2.5 py-0.5 rounded-md font-bold animate-pulse">
                    {questionSecondsLeft.toFixed(1)}s REMAINING
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">One-Way Progression</span>
              </div>
            </div>

            {/* Question Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="space-y-6"
              >
                <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3.5 pt-2">
                  {currentQuestion.options.map((optText, optIdx) => {
                    const isSelected = selectedOptionIndex === optIdx;
                    const cleanText = optText.replace(/^[A-D]\.\s*/, '');

                    return (
                      <motion.button
                        key={optIdx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: optIdx * 0.04, duration: 0.15 }}
                        onClick={() => onSelectOption(currentQuestion.id, optIdx)}
                        className={`w-full text-left min-h-[60px] px-5 py-4 rounded-xl border transition-all duration-150 flex items-center space-x-4 cursor-pointer group ${
                          isSelected
                            ? 'bg-blue-950/50 border-blue-500 text-white font-medium ring-1 ring-blue-500/60 shadow-lg shadow-blue-950/30'
                            : 'bg-slate-950/80 hover:bg-slate-800/80 text-slate-200 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Fixed-Width Letter Box */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                        }`}>
                          {optionPrefixes[optIdx]}
                        </div>

                        {/* Option Text */}
                        <div className="text-sm sm:text-base font-sans leading-normal flex-1">
                          {cleanText}
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* BOTTOM LEVEL: FORWARD-ONLY PROGRESSION ACTION */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 font-sans">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>10s auto-advancing</span>
                <span className="text-slate-600">•</span>
                <span className={`font-bold ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-blue-400'}`}>
                  {questionSecondsLeft.toFixed(1)}s
                </span>
              </div>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleAdvance}
                  className="group h-12 px-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                >
                  <span>Submit &amp; Next Challenge</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="h-12 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center space-x-2 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                >
                  <span>Finish &amp; Submit</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Read-Only Sequential Progress Timeline (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
                <span className="font-bold text-white uppercase tracking-wider">PROGRESS TIMELINE</span>
                <span className="text-slate-400">Question {currentIndex + 1} of {totalQuestions}</span>
              </div>

              {/* Sequential Non-Clickable Timeline Grid */}
              <div className="grid grid-cols-5 gap-2.5 font-mono text-xs select-none">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isCompleted = idx < currentIndex;
                  const isUpcoming = idx > currentIndex;

                  if (isCurrent) {
                    return (
                      <div
                        key={q.id}
                        className="relative h-11 rounded-xl border flex flex-col items-center justify-center bg-blue-600 border-blue-400 text-white font-bold ring-2 ring-blue-500/50 shadow-lg shadow-blue-600/30"
                      >
                        <span className="text-xs">{String(idx + 1).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase tracking-tighter opacity-90">ACTIVE</span>
                      </div>
                    );
                  }

                  if (isCompleted) {
                    return (
                      <div
                        key={q.id}
                        className="relative h-11 rounded-xl border flex flex-col items-center justify-center bg-emerald-950/50 border-emerald-800/80 text-emerald-400 font-medium opacity-90"
                      >
                        <div className="flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-xs">{String(idx + 1).padStart(2, '0')}</span>
                        </div>
                        <span className="text-[8px] uppercase tracking-tighter text-emerald-500">LOCKED</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={q.id}
                      className="relative h-11 rounded-xl border flex flex-col items-center justify-center bg-slate-950/60 border-slate-800/80 text-slate-600 opacity-60"
                    >
                      <div className="flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5 text-slate-600" />
                        <span className="text-xs">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <span className="text-[8px] uppercase tracking-tighter text-slate-600">WAITING</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress States Info */}
              <div className="border-t border-slate-800 pt-3 space-y-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600 ring-1 ring-blue-400"></span>
                  <span className="text-slate-200">Current Question (10s Countdown)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800"></span>
                  <span>Passed / Completed (Locked)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded bg-slate-950 border border-slate-800"></span>
                  <span>Upcoming Challenge (Locked)</span>
                </div>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl text-[11px] font-mono text-blue-300 leading-relaxed">
                ℹ️ <strong>Strict One-Way Rule:</strong> Questions appear exactly once. You cannot return to previous questions once timer expires or next is pressed.
              </div>

            </div>

            {/* Anti-AI Security & Rules Box */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 font-mono text-xs space-y-2.5 text-slate-300">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center space-x-1.5 text-blue-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>ANTI-AI PROCTOR</span>
                </span>
                <span className={violationsCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
                  {violationsCount === 0 ? '0 STRIKES' : `${violationsCount} / 2 STRIKES`}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1.5">
                <p>• 10s per question limit</p>
                <p>• One-way sequential flow (No Backtracking)</p>
                <p>• Switching tabs triggers Strike 1 warning</p>
                <p>• 2nd violation = Instant disqualification</p>
              </div>
            </div>

            {/* Team Session Details */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 font-mono text-xs space-y-1.5 text-slate-300">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">REGISTERED TEAM</div>
              <div className="font-display font-bold text-white text-base">{session.teamName}</div>
              <div className="text-slate-400 text-[11px]">{session.college}</div>
              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-blue-400">ID: {session.teamId}</span>
                {session.ieeeNumber && (
                  <span className="text-slate-400">IEEE: <strong className="text-white font-mono">{session.ieeeNumber}</strong></span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          onSubmitQuiz();
        }}
        answeredCount={answeredCount}
        unansweredCount={totalQuestions - answeredCount}
        totalQuestions={totalQuestions}
        isSubmitting={isSubmitting}
      />

      {/* Anti-AI Strike Warning Modal */}
      <AiSecurityWarningModal
        isOpen={showAiWarningModal}
        violationReason={violationReason}
        onAcknowledge={() => setShowAiWarningModal(false)}
      />

    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { QuizInterface } from './components/QuizInterface';
import { ResultView } from './components/ResultView';
import { OrganizerView } from './components/OrganizerView';
import { AppViewMode, PublicQuestion, QuizSessionState, QuizResult, TeamRegistration } from './types/quiz';
import { SplashScreen } from './components/SplashScreen';
import { DisqualifiedBannerModal } from './components/DisqualifiedBannerModal';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<AppViewMode>('landing');
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [sessionState, setSessionState] = useState<QuizSessionState | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Disqualification Modal State
  const [showDisqualifiedModal, setShowDisqualifiedModal] = useState(false);
  const [disqualifiedInfo, setDisqualifiedInfo] = useState<{
    teamName?: string;
    teamId?: string;
    reason?: string;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch Questions on Mount
  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/quiz/questions');
      if (!res.ok) throw new Error("Failed to load quiz questions");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error("Error loading questions:", err);
      setError("Unable to load question bank. Please check your network connection.");
    }
  };

  // 2. Restore Session from LocalStorage & Server on initial load
  useEffect(() => {
    fetchQuestions();

    const savedSessionId = localStorage.getItem('TQ_ACTIVE_SESSION');
    if (savedSessionId) {
      // Pre-load from local draft for instantaneous paint
      let localDraftAnswers: Record<number, number> = {};
      let localDraftMarked: Record<number, boolean> = {};
      let localDraftIndex = 0;
      try {
        const rawDraft = localStorage.getItem(`TQ_DRAFT_${savedSessionId}`);
        if (rawDraft) {
          const parsed = JSON.parse(rawDraft);
          if (parsed.answers && typeof parsed.answers === 'object') {
            localDraftAnswers = parsed.answers;
          }
          if (parsed.markedForReview && typeof parsed.markedForReview === 'object') {
            localDraftMarked = parsed.markedForReview;
          }
          if (typeof parsed.currentIndex === 'number') {
            localDraftIndex = parsed.currentIndex;
          }
        }
      } catch {}

      fetch(`/api/quiz/session/${savedSessionId}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Session expired or not found");
        })
        .then((data) => {
          if (data.isDisqualified) {
            localStorage.removeItem('TQ_ACTIVE_SESSION');
            setDisqualifiedInfo({
              teamName: data.teamName,
              teamId: data.teamId,
              reason: data.disqualificationReason,
            });
            setShowDisqualifiedModal(true);
            setCurrentView('landing');
          } else if (data.submitted) {
            const finalResult: QuizResult = {
              sessionId: data.sessionId,
              teamName: data.teamName,
              leaderName: data.leaderName,
              college: data.college,
              ieeeNumber: data.ieeeNumber || data.result?.ieeeNumber,
              teamId: data.teamId,
              submittedAt: data.submittedAt || Date.now(),
              score: data.result?.score ?? data.score ?? 0,
              correctCount: data.result?.correctCount ?? data.correctCount ?? 0,
              incorrectCount: data.result?.incorrectCount ?? data.incorrectCount ?? 0,
              unansweredCount: data.result?.unansweredCount ?? data.unansweredCount ?? 0,
              completionTimeSeconds: data.result?.completionTimeSeconds ?? data.completionTimeSeconds ?? 0,
            };
            setQuizResult(finalResult);
            setCurrentView('result');
          } else {
            // Merge server saved answers with any instantaneous local answers
            const mergedAnswers = {
              ...localDraftAnswers,
              ...(data.answers || {}),
            };
            const mergedMarked = {
              ...localDraftMarked,
              ...(data.markedForReview || {}),
            };

            setSessionState({
              sessionId: data.sessionId,
              teamName: data.teamName,
              leaderName: data.leaderName,
              college: data.college,
              ieeeNumber: data.ieeeNumber || '',
              teamId: data.teamId,
              startTime: data.startTime,
              durationSeconds: data.durationSeconds,
              remainingSeconds: data.remainingSeconds,
              perQuestionSeconds: data.perQuestionSeconds || 10,
              currentIndex: typeof data.currentIndex === 'number' ? data.currentIndex : localDraftIndex,
              answers: mergedAnswers,
              markedForReview: mergedMarked,
              submitted: false,
            });
            setCurrentView('quiz');
          }
        })
        .catch(async () => {
          // Automatic recovery: check if user has local completed result or draft
          try {
            const rawResult = localStorage.getItem(`TQ_RESULT_${savedSessionId}`);
            if (rawResult) {
              const parsedResult = JSON.parse(rawResult);
              await fetch('/api/quiz/sync-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedResult),
              });
              setQuizResult(parsedResult);
              setCurrentView('result');
              return;
            }
          } catch {}
          localStorage.removeItem('TQ_ACTIVE_SESSION');
        });
    }
  }, []);

  // 3. Start Quiz Session
  const handleStartQuiz = async (teamInfo: TeamRegistration) => {
    setIsLoading(true);
    setError(null);
    setShowDisqualifiedModal(false);
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamInfo),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to start quiz session");
      }

      const data = await res.json();
      const newSession: QuizSessionState = {
        sessionId: data.sessionId,
        teamName: data.teamName,
        leaderName: data.leaderName,
        college: data.college,
        ieeeNumber: data.ieeeNumber || teamInfo.ieeeNumber,
        teamId: data.teamId,
        startTime: data.startTime,
        durationSeconds: data.durationSeconds,
        remainingSeconds: data.durationSeconds,
        perQuestionSeconds: data.perQuestionSeconds || 10,
        answers: {},
        markedForReview: {},
        submitted: false,
      };

      setSessionState(newSession);
      localStorage.setItem('TQ_ACTIVE_SESSION', data.sessionId);
      localStorage.setItem(`TQ_DRAFT_${data.sessionId}`, JSON.stringify({
        sessionId: data.sessionId,
        answers: {},
        markedForReview: {},
        updatedAt: Date.now(),
      }));

      // Ensure questions are loaded
      if (questions.length === 0) {
        await fetchQuestions();
      }

      setCurrentView('quiz');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred starting the quiz");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Timer Countdown Effect for Global Quiz Fallback
  useEffect(() => {
    if (currentView === 'quiz' && sessionState && !sessionState.submitted) {
      timerRef.current = setInterval(() => {
        setSessionState((prev) => {
          if (!prev) return null;
          if (prev.remainingSeconds <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            handleFinalSubmit(prev.answers, prev.sessionId);
            return { ...prev, remainingSeconds: 0 };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentView, sessionState?.submitted, sessionState?.sessionId]);

  // 5. Save Draft Answer Choice (Instant Local + Server Sync)
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (!sessionState) return;

    const updatedAnswers = { ...sessionState.answers, [questionId]: optionIndex };
    setSessionState((prev) => prev ? { ...prev, answers: updatedAnswers } : null);

    // 1. Instant local persistence for zero-loss reload survival
    try {
      localStorage.setItem(`TQ_DRAFT_${sessionState.sessionId}`, JSON.stringify({
        sessionId: sessionState.sessionId,
        answers: updatedAnswers,
        markedForReview: sessionState.markedForReview,
        currentIndex: sessionState.currentIndex ?? 0,
        updatedAt: Date.now(),
      }));
    } catch {}

    // 2. Asynchronously sync to backend persistent database
    fetch('/api/quiz/save-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionState.sessionId,
        answers: updatedAnswers,
        markedForReview: sessionState.markedForReview,
        currentIndex: sessionState.currentIndex ?? 0,
      }),
    }).catch(() => {});
  };

  // 6. Advance Question Handler (Forward-Only)
  const handleAdvanceQuestion = (nextIndex: number) => {
    if (!sessionState) return;

    setSessionState((prev) => prev ? { ...prev, currentIndex: nextIndex } : null);

    try {
      localStorage.setItem(`TQ_DRAFT_${sessionState.sessionId}`, JSON.stringify({
        sessionId: sessionState.sessionId,
        answers: sessionState.answers,
        markedForReview: sessionState.markedForReview,
        currentIndex: nextIndex,
        updatedAt: Date.now(),
      }));
    } catch {}

    fetch('/api/quiz/save-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionState.sessionId,
        answers: sessionState.answers,
        markedForReview: sessionState.markedForReview,
        currentIndex: nextIndex,
      }),
    }).catch(() => {});
  };

  // 7. Toggle Mark for Review (Instant Local + Server Sync)
  const handleToggleMarkForReview = (questionId: number) => {
    if (!sessionState) return;
    const isMarked = !sessionState.markedForReview[questionId];
    const updatedMarked = {
      ...sessionState.markedForReview,
      [questionId]: isMarked,
    };

    setSessionState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        markedForReview: updatedMarked,
      };
    });

    // 1. Instant local persistence
    try {
      localStorage.setItem(`TQ_DRAFT_${sessionState.sessionId}`, JSON.stringify({
        sessionId: sessionState.sessionId,
        answers: sessionState.answers,
        markedForReview: updatedMarked,
        updatedAt: Date.now(),
      }));
    } catch {}

    // 2. Asynchronously sync to backend persistent database
    fetch('/api/quiz/save-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionState.sessionId,
        answers: sessionState.answers,
        markedForReview: updatedMarked,
      }),
    }).catch(() => {});
  };

  // 7. Anti-Cheat Disqualification Handler
  const handleDisqualify = async (reason: string) => {
    if (!sessionState) return;
    const sId = sessionState.sessionId;
    const tName = sessionState.teamName;
    const tId = sessionState.teamId;

    try {
      await fetch('/api/quiz/disqualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sId,
          reason,
          violationsCount: 2,
        }),
      });
    } catch (e) {
      console.error("Disqualify error:", e);
    }

    localStorage.removeItem('TQ_ACTIVE_SESSION');
    setSessionState(null);
    setDisqualifiedInfo({
      teamName: tName,
      teamId: tId,
      reason,
    });
    setShowDisqualifiedModal(true);
    setCurrentView('landing');
  };

  // 8. Final Quiz Submission
  const handleFinalSubmit = async (
    answersToSubmit?: Record<number, number>,
    sessionIdToSubmit?: string
  ) => {
    const sId = sessionIdToSubmit || sessionState?.sessionId;
    const finalAns = answersToSubmit || sessionState?.answers || {};

    if (!sId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sId,
          answers: finalAns,
        }),
      });

      if (!res.ok) throw new Error("Submission failed on server");

      const data = await res.json();

      const resultObj: QuizResult = {
        sessionId: data.sessionId,
        teamName: data.teamName,
        leaderName: data.leaderName,
        college: data.college,
        ieeeNumber: data.ieeeNumber || sessionState?.ieeeNumber,
        teamId: data.teamId,
        submittedAt: data.submittedAt || Date.now(),
        score: data.score,
        correctCount: data.correctCount,
        incorrectCount: data.incorrectCount,
        unansweredCount: data.unansweredCount,
        completionTimeSeconds: data.completionTimeSeconds,
      };

      try {
        localStorage.setItem(`TQ_RESULT_${data.sessionId}`, JSON.stringify(resultObj));
      } catch {}

      setQuizResult(resultObj);
      if (sessionState) {
        setSessionState((prev) => prev ? { ...prev, submitted: true } : null);
      }
      setCurrentView('result');
    } catch (err: any) {
      console.error("Submission error:", err);
      alert("Failed to record submission. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      
      {/* Flashy Entrance Animation */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Universal Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        teamName={sessionState?.teamName}
        remainingSeconds={sessionState?.remainingSeconds}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onStartQuiz={handleStartQuiz}
            isLoading={isLoading}
            error={error}
          />
        )}

        {currentView === 'quiz' && sessionState && (
          <QuizInterface
            session={sessionState}
            questions={questions}
            onSelectOption={handleSelectOption}
            onAdvanceQuestion={handleAdvanceQuestion}
            onSubmitQuiz={() => handleFinalSubmit()}
            onDisqualify={handleDisqualify}
            isSubmitting={isSubmitting}
          />
        )}

        {currentView === 'result' && quizResult && (
          <ResultView
            result={quizResult}
            onReturnHome={() => {
              localStorage.removeItem('TQ_ACTIVE_SESSION');
              setSessionState(null);
              setQuizResult(null);
              setCurrentView('landing');
            }}
          />
        )}

        {currentView === 'organizer' && (
          <OrganizerView
            onBackToQualifier={() => setCurrentView('landing')}
          />
        )}
      </main>

      {/* Disqualification Banner & Modal */}
      <DisqualifiedBannerModal
        isOpen={showDisqualifiedModal}
        teamName={disqualifiedInfo?.teamName}
        teamId={disqualifiedInfo?.teamId}
        reason={disqualifiedInfo?.reason}
        onClose={() => setShowDisqualifiedModal(false)}
      />

      {/* Universal Technical Footer */}
      <footer className="bg-slate-900/90 text-slate-400 border-t border-slate-800 py-6 px-4 sm:px-6 font-mono text-xs">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">QUIZ ODYSSEY 2026 // R.M.K. ENGINEERING COLLEGE</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            IEEE STUDENT BRANCH STB61871 · 10S PER QUESTION PROTOCOL
          </div>
        </div>
      </footer>

    </div>
  );
}

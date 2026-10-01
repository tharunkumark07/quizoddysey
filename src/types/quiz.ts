export interface PublicQuestion {
  id: number;
  category: string;
  question: string;
  options: [string, string, string, string];
}

export interface TeamRegistration {
  teamName: string;
  leaderName: string;
  college: string;
  teamId?: string;
}

export interface QuizSessionState {
  sessionId: string;
  teamName: string;
  leaderName: string;
  college: string;
  teamId: string;
  startTime: number;
  durationSeconds: number;
  remainingSeconds: number;
  perQuestionSeconds: number; // 10 seconds per question
  currentIndex?: number;
  answers: Record<number, number>; // questionId -> selectedOptionIndex (0-3)
  markedForReview: Record<number, boolean>;
  submitted: boolean;
  violationsCount?: number;
  isDisqualified?: boolean;
}

export interface QuizResult {
  sessionId: string;
  teamName: string;
  leaderName: string;
  college: string;
  teamId: string;
  submittedAt: number;
  score?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
  completionTimeSeconds?: number;
  isDisqualified?: boolean;
}

export interface LeaderboardTeam {
  rank: number;
  sessionId: string;
  teamName: string;
  leaderName: string;
  college: string;
  teamId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  completionTimeSeconds: number;
  submittedAt: number;
  isQualified: boolean;
  isDisqualified?: boolean;
  disqualificationReason?: string;
}

export type AppViewMode = 'landing' | 'quiz' | 'result' | 'organizer';

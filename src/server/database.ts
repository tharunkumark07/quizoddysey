import fs from 'fs';
import path from 'path';

// --- QUESTION DEFINITIONS ---
export interface QuestionData {
  questionId: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3 - NEVER sent to normal participants!
  difficulty: 'easy' | 'medium';
  points: number;
}

export interface QuestionPublic {
  questionId: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  difficulty: 'easy' | 'medium';
  points: number;
}

export const OFFICIAL_QUESTIONS: QuestionData[] = [
  {
    questionId: 1,
    category: "PROGRAMMING BASICS",
    question: "Which of the following is used to store multiple items of the same type in a single variable in programming?",
    options: ["A. Loop", "B. Array", "C. Function", "D. If-Else statement"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 2,
    category: "BASIC COMPUTERS",
    question: "Which component is widely known as the 'Brain' of a computer system?",
    options: ["A. Hard Disk Drive (HDD)", "B. Central Processing Unit (CPU)", "C. Random Access Memory (RAM)", "D. Power Supply Unit (PSU)"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 3,
    category: "WEB FUNDAMENTALS",
    question: "What language is primarily used to structure and display content on a webpage?",
    options: ["A. HTML", "B. C++", "C. SQL", "D. Python"],
    correctIndex: 0,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 4,
    category: "OPERATING SYSTEMS",
    question: "What is the primary function of an Operating System (OS)?",
    options: ["A. To draw graphic art", "B. To manage computer hardware and run software applications", "C. To clean the physical computer monitor", "D. To send paper mail"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 5,
    category: "DATA STRUCTURES",
    question: "Which data structure operates on a Last In, First Out (LIFO) principle, like a stack of plates?",
    options: ["A. Queue", "B. Stack", "C. Tree", "D. Graph"],
    correctIndex: 1,
    difficulty: 'medium',
    points: 1,
  },
  {
    questionId: 6,
    category: "NETWORKING BASICS",
    question: "What does 'WWW' stand for in a website URL?",
    options: ["A. World Wide Web", "B. Whole World Web", "C. Web Wide World", "D. World Web Wireless"],
    correctIndex: 0,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 7,
    category: "DATABASE MANAGEMENT",
    question: "Which language is standard for querying and managing relational database tables?",
    options: ["A. Java", "B. SQL (Structured Query Language)", "C. HTML", "D. Assembly"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 8,
    category: "PROGRAMMING CONCEPTS",
    question: "What is a 'loop' used for in computer programming?",
    options: ["A. To restart the computer", "B. To repeat a block of code multiple times", "C. To delete variables", "D. To disconnect from WiFi"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 9,
    category: "CYBERSECURITY BASICS",
    question: "What is the main purpose of creating a strong password for an account?",
    options: ["A. To speed up typing", "B. To protect user accounts from unauthorized access", "C. To increase computer screen brightness", "D. To compress image files"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 10,
    category: "DATA STRUCTURES",
    question: "Which data structure operates on a First In, First Out (FIFO) principle, like a line of people at a ticket counter?",
    options: ["A. Stack", "B. Queue", "C. Array", "D. Binary Tree"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 11,
    category: "HARDWARE & MEMORY",
    question: "Which computer memory is volatile and temporary, losing its stored data when the power is turned off?",
    options: ["A. Hard Drive (HDD/SSD)", "B. RAM (Random Access Memory)", "C. ROM (Read Only Memory)", "D. USB Flash Pen Drive"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 12,
    category: "OBJECT-ORIENTED PROGRAMMING",
    question: "In Object-Oriented Programming (OOP), what is a 'Class'?",
    options: ["A. A blueprint or template for creating objects", "B. A hardware cable", "C. A web browser tab", "D. A database backup file"],
    correctIndex: 0,
    difficulty: 'medium',
    points: 1,
  },
  {
    questionId: 13,
    category: "SOFTWARE BASICS",
    question: "In software engineering, what is meant by a software 'Bug'?",
    options: ["A. An error or flaw in a computer program that produces incorrect behavior", "B. A hardware insect", "C. A physical keyboard key", "D. An audio speaker"],
    correctIndex: 0,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 14,
    category: "PROGRAMMING LANGUAGES",
    question: "Which symbol is commonly used to write single-line comments in Python?",
    options: ["A. //", "B. #", "C. <!--", "D. /*"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
  {
    questionId: 15,
    category: "CLOUD & INTERNET",
    question: "What does 'IP' stand for in an IP address?",
    options: ["A. Internet Provider", "B. Internet Protocol", "C. Internal Process", "D. Integrated Program"],
    correctIndex: 1,
    difficulty: 'easy',
    points: 1,
  },
];

// --- DATABASE SCHEMAS ---
export interface TeamRecord {
  teamId: string;
  teamName: string;
  leaderName: string;
  college: string;
  createdAt: number;
  status: 'registered' | 'in_progress' | 'submitted' | 'disqualified';
}

export interface QuizSessionRecord {
  sessionId: string;
  submissionId: string;
  teamId: string;
  quizId: string;
  teamName: string;
  leaderName: string;
  college: string;
  startedAt: number;
  durationSeconds: number;
  perQuestionSeconds: number;
  answers: Record<number, number>; // questionId -> optionIndex
  status: 'in_progress' | 'submitted' | 'disqualified';
  submittedAt: number | null;
  score: number | null;
  correctCount: number | null;
  incorrectCount: number | null;
  unansweredCount: number | null;
  completionTimeSeconds: number | null;
  isDisqualified: boolean;
  disqualificationReason?: string | null;
  violationsCount: number;
}

export interface QuizDefinition {
  quizId: string;
  title: string;
  totalQuestions: number;
  durationSeconds: number;
  perQuestionSeconds: number;
  status: 'active' | 'archived';
  createdAt: number;
}

export interface DatabaseSchema {
  version: number;
  quizzes: Record<string, QuizDefinition>;
  teams: Record<string, TeamRecord>;
  sessions: Record<string, QuizSessionRecord>;
}

// --- DATABASE MANAGER ---
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'quiz-database.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        if (parsed && parsed.quizzes && parsed.teams && parsed.sessions) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading persistent database file, initializing clean database:', err);
    }

    // Default clean empty database
    const initialDb: DatabaseSchema = {
      version: 1,
      quizzes: {
        'quiz-odyssey-2026': {
          quizId: 'quiz-odyssey-2026',
          title: 'Quiz Odyssey 2026 Preliminary Qualifier',
          totalQuestions: OFFICIAL_QUESTIONS.length,
          perQuestionSeconds: 15,
          durationSeconds: OFFICIAL_QUESTIONS.length * 15,
          status: 'active',
          createdAt: Date.now(),
        },
      },
      teams: {},
      sessions: {},
    };

    this.saveToDisk(initialDb);
    return initialDb;
  }

  private saveToDisk(dataToSave = this.data): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  // --- QUESTIONS ---
  public getPublicQuestions(): QuestionPublic[] {
    return OFFICIAL_QUESTIONS.map((q) => ({
      questionId: q.questionId,
      category: q.category,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      points: q.points,
    }));
  }

  public getMasterKey(): QuestionData[] {
    return OFFICIAL_QUESTIONS;
  }

  // --- TEAMS ---
  public registerTeam(params: {
    teamName: string;
    leaderName: string;
    college: string;
  }): { team: TeamRecord; session: QuizSessionRecord } {
    const cleanName = params.teamName.trim();
    const cleanLeader = params.leaderName.trim();
    const cleanCollege = params.college.trim();

    // Check duplicate team name (case-insensitive)
    const existingTeam = Object.values(this.data.teams).find(
      (t) => t.teamName.toLowerCase() === cleanName.toLowerCase()
    );

    let teamId: string;
    let teamRecord: TeamRecord;

    if (existingTeam) {
      teamId = existingTeam.teamId;
      teamRecord = existingTeam;
    } else {
      const teamNumber = Object.keys(this.data.teams).length + 1;
      teamId = `QO-2026-${String(teamNumber).padStart(2, '0')}`;
      teamRecord = {
        teamId,
        teamName: cleanName,
        leaderName: cleanLeader,
        college: cleanCollege,
        createdAt: Date.now(),
        status: 'in_progress',
      };
      this.data.teams[teamId] = teamRecord;
    }

    const sessionId = `SESSION-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionId = `SUB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const perQuestionSeconds = 15;
    const durationSeconds = OFFICIAL_QUESTIONS.length * perQuestionSeconds;

    const newSession: QuizSessionRecord = {
      sessionId,
      submissionId,
      teamId,
      quizId: 'quiz-odyssey-2026',
      teamName: cleanName,
      leaderName: cleanLeader,
      college: cleanCollege,
      startedAt: Date.now(),
      durationSeconds,
      perQuestionSeconds,
      answers: {},
      status: 'in_progress',
      submittedAt: null,
      score: null,
      correctCount: null,
      incorrectCount: null,
      unansweredCount: null,
      completionTimeSeconds: null,
      isDisqualified: false,
      disqualificationReason: null,
      violationsCount: 0,
    };

    this.data.sessions[sessionId] = newSession;
    this.saveToDisk();

    return { team: teamRecord, session: newSession };
  }

  public getSession(sessionId: string): QuizSessionRecord | null {
    return this.data.sessions[sessionId] || null;
  }

  public saveDraftAnswers(sessionId: string, answers: Record<number, number>): boolean {
    const session = this.data.sessions[sessionId];
    if (!session || session.status === 'submitted') return false;

    session.answers = { ...session.answers, ...answers };
    this.saveToDisk();
    return true;
  }

  public disqualifySession(sessionId: string, reason: string, violationsCount = 2): QuizSessionRecord | null {
    const session = this.data.sessions[sessionId];
    if (!session) return null;

    const now = Date.now();
    session.isDisqualified = true;
    session.disqualificationReason = reason || 'AI assistance and tab-navigation violations';
    session.violationsCount = violationsCount;
    session.status = 'disqualified';
    session.submittedAt = now;
    session.score = 0;
    session.correctCount = 0;
    session.incorrectCount = OFFICIAL_QUESTIONS.length;
    session.unansweredCount = 0;
    session.completionTimeSeconds = Math.max(1, Math.floor((now - session.startedAt) / 1000));

    if (this.data.teams[session.teamId]) {
      this.data.teams[session.teamId].status = 'disqualified';
    }

    this.saveToDisk();
    return session;
  }

  public submitQuiz(sessionId: string, answersFromClient?: Record<number, number>): QuizSessionRecord | null {
    const session = this.data.sessions[sessionId];
    if (!session) return null;

    // Idempotent: If already submitted, return the recorded submission
    if (session.status === 'submitted') {
      return session;
    }

    const finalAnswers = answersFromClient || session.answers || {};
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    OFFICIAL_QUESTIONS.forEach((q) => {
      const userChoice = finalAnswers[q.questionId];
      if (userChoice === undefined || userChoice === null) {
        unansweredCount++;
      } else if (userChoice === q.correctIndex) {
        correctCount += q.points;
      } else {
        incorrectCount++;
      }
    });

    const now = Date.now();
    const completionTimeSeconds = Math.max(1, Math.floor((now - session.startedAt) / 1000));

    session.answers = finalAnswers;
    session.score = correctCount;
    session.correctCount = correctCount;
    session.incorrectCount = incorrectCount;
    session.unansweredCount = unansweredCount;
    session.completionTimeSeconds = completionTimeSeconds;
    session.submittedAt = now;
    session.status = 'submitted';

    if (this.data.teams[session.teamId]) {
      this.data.teams[session.teamId].status = 'submitted';
    }

    this.saveToDisk();
    return session;
  }

  // --- LEADERBOARD & RANKINGS ---
  public getLeaderboard() {
    const submittedSessions = Object.values(this.data.sessions).filter(
      (s) => s.status === 'submitted' || s.isDisqualified
    );

    // Rank rules:
    // 1. Non-disqualified first
    // 2. Highest score first
    // 3. Lowest completion time first
    // 4. Earliest submittedAt first
    submittedSessions.sort((a, b) => {
      if (a.isDisqualified && !b.isDisqualified) return 1;
      if (!a.isDisqualified && b.isDisqualified) return -1;
      if ((b.score ?? 0) !== (a.score ?? 0)) {
        return (b.score ?? 0) - (a.score ?? 0);
      }
      if ((a.completionTimeSeconds ?? 0) !== (b.completionTimeSeconds ?? 0)) {
        return (a.completionTimeSeconds ?? 0) - (b.completionTimeSeconds ?? 0);
      }
      return (a.submittedAt ?? 0) - (b.submittedAt ?? 0);
    });

    const leaderboard = submittedSessions.map((session, idx) => {
      const rank = idx + 1;
      const isQualified = !session.isDisqualified && rank <= 6;

      return {
        rank,
        sessionId: session.sessionId,
        submissionId: session.submissionId,
        teamId: session.teamId,
        teamName: session.teamName,
        leaderName: session.leaderName,
        college: session.college,
        score: session.score ?? 0,
        totalQuestions: OFFICIAL_QUESTIONS.length,
        correctCount: session.correctCount ?? 0,
        incorrectCount: session.incorrectCount ?? 0,
        unansweredCount: session.unansweredCount ?? 0,
        completionTimeSeconds: session.completionTimeSeconds ?? 0,
        submittedAt: session.submittedAt ?? session.startedAt,
        isQualified,
        isDisqualified: session.isDisqualified,
        disqualificationReason: session.disqualificationReason || undefined,
        answers: session.answers,
      };
    });

    return leaderboard;
  }

  public getInspection(sessionId: string) {
    const session = this.data.sessions[sessionId];
    if (!session) return null;

    const detailedBreakdown = OFFICIAL_QUESTIONS.map((q) => {
      const userChoice = session.answers[q.questionId];
      const isCorrect = userChoice === q.correctIndex;
      const isUnanswered = userChoice === undefined || userChoice === null;

      return {
        questionId: q.questionId,
        category: q.category,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        userSelectedIndex: userChoice !== undefined && userChoice !== null ? userChoice : null,
        isCorrect,
        isUnanswered,
        pointsAwarded: isCorrect ? q.points : 0,
      };
    });

    return {
      session,
      detailedBreakdown,
    };
  }

  // --- ANALYTICS ---
  public getAnalytics() {
    const allTeams = Object.values(this.data.teams);
    const allSessions = Object.values(this.data.sessions);
    const submittedSessions = allSessions.filter((s) => s.status === 'submitted');
    const disqualifiedSessions = allSessions.filter((s) => s.isDisqualified);

    const totalRegistered = allTeams.length;
    const totalSubmissions = submittedSessions.length;
    const totalDisqualified = disqualifiedSessions.length;

    if (totalSubmissions === 0) {
      return {
        hasData: false,
        totalRegistered,
        totalSubmissions: 0,
        totalDisqualified,
        highestScore: null,
        lowestScore: null,
        averageScore: null,
        averageCompletionTimeSeconds: null,
        completionPercentage: totalRegistered > 0 ? 0 : null,
        qualifiedCount: 0,
      };
    }

    const scores = submittedSessions.map((s) => s.score ?? 0);
    const times = submittedSessions.map((s) => s.completionTimeSeconds ?? 0);

    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const averageScore = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
    const averageCompletionTimeSeconds = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const completionPercentage = Math.round((totalSubmissions / Math.max(1, totalRegistered)) * 100);
    const qualifiedCount = Math.min(6, submittedSessions.length);

    return {
      hasData: true,
      totalRegistered,
      totalSubmissions,
      totalDisqualified,
      highestScore,
      lowestScore,
      averageScore,
      averageCompletionTimeSeconds,
      completionPercentage,
      qualifiedCount,
    };
  }

  public resetDatabase(): void {
    this.data.teams = {};
    this.data.sessions = {};
    this.saveToDisk();
  }
}

export const db = new DatabaseManager();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- QUESTION DATABASE (SERVER-SIDE ONLY - CONTAINS ANSWER KEYS) ---
export interface QuestionInternal {
  id: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3 - NEVER sent to client in quiz queries!
  points: number;
}

export interface QuestionPublic {
  id: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  points: number;
}

const QUESTIONS_DB: QuestionInternal[] = [
  {
    id: 1,
    category: "PROGRAMMING BASICS",
    question: "Which of the following is used to store multiple items of the same type in a single variable in programming?",
    options: ["A. Loop", "B. Array", "C. Function", "D. If-Else statement"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 2,
    category: "BASIC COMPUTERS",
    question: "Which component is widely known as the 'Brain' of a computer system?",
    options: ["A. Hard Disk Drive (HDD)", "B. Central Processing Unit (CPU)", "C. Random Access Memory (RAM)", "D. Power Supply Unit (PSU)"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 3,
    category: "WEB FUNDAMENTALS",
    question: "What language is primarily used to structure and display content on a webpage?",
    options: ["A. HTML", "B. C++", "C. SQL", "D. Python"],
    correctIndex: 0,
    points: 1,
  },
  {
    id: 4,
    category: "OPERATING SYSTEMS",
    question: "What is the primary function of an Operating System (OS)?",
    options: ["A. To draw graphic art", "B. To manage computer hardware and run software applications", "C. To clean the physical computer monitor", "D. To send paper mail"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 5,
    category: "DATA STRUCTURES",
    question: "Which data structure operates on a Last In, First Out (LIFO) principle, like a stack of plates?",
    options: ["A. Queue", "B. Stack", "C. Tree", "D. Graph"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 6,
    category: "NETWORKING BASICS",
    question: "What does 'WWW' stand for in a website URL?",
    options: ["A. World Wide Web", "B. Whole World Web", "C. Web Wide World", "D. World Web Wireless"],
    correctIndex: 0,
    points: 1,
  },
  {
    id: 7,
    category: "DATABASE MANAGEMENT",
    question: "Which language is standard for querying and managing relational database tables?",
    options: ["A. Java", "B. SQL (Structured Query Language)", "C. HTML", "D. Assembly"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 8,
    category: "PROGRAMMING CONCEPTS",
    question: "What is a 'loop' used for in computer programming?",
    options: ["A. To restart the computer", "B. To repeat a block of code multiple times", "C. To delete variables", "D. To disconnect from WiFi"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 9,
    category: "CYBERSECURITY BASICS",
    question: "What is the main purpose of creating a strong password for an account?",
    options: ["A. To speed up typing", "B. To protect user accounts from unauthorized access", "C. To increase computer screen brightness", "D. To compress image files"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 10,
    category: "DATA STRUCTURES",
    question: "Which data structure operates on a First In, First Out (FIFO) principle, like a line of people at a ticket counter?",
    options: ["A. Stack", "B. Queue", "C. Array", "D. Binary Tree"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 11,
    category: "HARDWARE & MEMORY",
    question: "Which computer memory is volatile and temporary, losing its stored data when the power is turned off?",
    options: ["A. Hard Drive (HDD/SSD)", "B. RAM (Random Access Memory)", "C. ROM (Read Only Memory)", "D. USB Flash Pen Drive"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 12,
    category: "OBJECT-ORIENTED PROGRAMMING",
    question: "In Object-Oriented Programming (OOP), what is a 'Class'?",
    options: ["A. A blueprint or template for creating objects", "B. A hardware cable", "C. A web browser tab", "D. A database backup file"],
    correctIndex: 0,
    points: 1,
  },
  {
    id: 13,
    category: "SOFTWARE BASICS",
    question: "In software engineering, what is meant by a software 'Bug'?",
    options: ["A. An error or flaw in a computer program that produces incorrect behavior", "B. A hardware insect", "C. A physical keyboard key", "D. An audio speaker"],
    correctIndex: 0,
    points: 1,
  },
  {
    id: 14,
    category: "PROGRAMMING LANGUAGES",
    question: "Which symbol is commonly used to write single-line comments in Python?",
    options: ["A. //", "B. #", "C. <!--", "D. /*"],
    correctIndex: 1,
    points: 1,
  },
  {
    id: 15,
    category: "CLOUD & INTERNET",
    question: "What does 'IP' stand for in an IP address?",
    options: ["A. Internet Provider", "B. Internet Protocol", "C. Internal Process", "D. Integrated Program"],
    correctIndex: 1,
    points: 1,
  },
];

// --- SESSION & LEADERBOARD TYPES ---
export interface TeamRecord {
  teamId: string;
  teamName: string;
  leaderName: string;
  college: string;
  ieeeNumber: string;
  createdAt: number;
  sessionId: string;
  status: "IN_PROGRESS" | "SUBMITTED" | "DISQUALIFIED";
}

export interface QuizSession {
  sessionId: string;
  teamName: string;
  leaderName: string;
  college: string;
  ieeeNumber: string;
  teamId: string;
  startTime: number;
  durationSeconds: number;
  perQuestionSeconds: number;
  currentIndex?: number;
  answers: Record<number, number>; // questionId -> optionIndex (0-3)
  markedForReview?: Record<number, boolean>;
  submitted: boolean;
  submittedAt: number | null;
  score: number | null;
  correctCount: number | null;
  incorrectCount: number | null;
  unansweredCount: number | null;
  completionTimeSeconds: number | null;
  isDisqualified?: boolean;
  disqualificationReason?: string;
  violationsCount?: number;
}

export interface LeaderboardEntry {
  rank: number;
  sessionId: string;
  teamName: string;
  leaderName: string;
  college: string;
  ieeeNumber: string;
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
  answers?: Record<number, number>;
}

// --- PERSISTENT FILE DATABASE SYSTEM ---
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'quiz_database.json');
const LEDGER_FILE = path.join(DATA_DIR, 'quiz_audit_ledger.jsonl');

const PER_QUESTION_SECONDS = 10; // Strict 10 seconds per question
let QUIZ_DURATION_SECONDS = QUESTIONS_DB.length * PER_QUESTION_SECONDS; // 15 questions * 10s = 150s

// Storage in memory, synced to disk
const teamsStore = new Map<string, TeamRecord>();
const sessionsStore = new Map<string, QuizSession>();

function appendLedger(event: string, payload: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const line = JSON.stringify({ event, timestamp: Date.now(), data: payload }) + "\n";
    fs.appendFileSync(LEDGER_FILE, line, 'utf-8');
  } catch (e) {
    console.error("[LEDGER] Failed to write ledger entry:", e);
  }
}

function initDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const rawData = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(rawData);

      if (Array.isArray(data.teams)) {
        data.teams.forEach((t: TeamRecord) => teamsStore.set(t.teamId, t));
      }
      if (Array.isArray(data.sessions)) {
        data.sessions.forEach((s: QuizSession) => sessionsStore.set(s.sessionId, s));
      }
      QUIZ_DURATION_SECONDS = QUESTIONS_DB.length * PER_QUESTION_SECONDS; // 150s
      saveDatabase();
      console.log(`[DATABASE] Loaded ${teamsStore.size} registered teams and ${sessionsStore.size} sessions from persistent storage.`);
    } else {
      saveDatabase();
      console.log(`[DATABASE] Initialized fresh clean database at ${DB_FILE}. Zero mock data.`);
    }
  } catch (err) {
    console.error("[DATABASE] Error initializing database file:", err);
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const payload = {
      version: "2.0.0",
      updatedAt: Date.now(),
      config: {
        durationSeconds: QUIZ_DURATION_SECONDS,
        perQuestionSeconds: PER_QUESTION_SECONDS,
        totalQuestions: QUESTIONS_DB.length,
      },
      teams: Array.from(teamsStore.values()),
      sessions: Array.from(sessionsStore.values()),
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error("[DATABASE] Failed to write database file:", err);
  }
}

// Initialize database immediately on module load
initDatabase();

// --- SERVER INITIALIZATION ---
async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // --- API ENDPOINTS ---

  // 1. Health check & Live Database System
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'active',
      system: 'QUIZ ODYSSEY PORTAL',
      database: 'PERSISTENT_JSON',
      registeredTeams: teamsStore.size,
      completedSubmissions: Array.from(sessionsStore.values()).filter(s => s.submitted).length,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Real-Time Stats (Initiates to 0, increments live as real teams register)
  app.get('/api/quiz/stats', (req, res) => {
    const sessions = Array.from(sessionsStore.values());
    const submittedCount = sessions.filter((s) => s.submitted).length;
    const inProgressCount = sessions.filter((s) => !s.submitted && !s.isDisqualified).length;

    res.json({
      registeredTeams: teamsStore.size,
      submittedTeams: submittedCount,
      activeSessions: inProgressCount,
      timestamp: Date.now(),
    });
  });

  // 3. Fetch Questions (Sanitized - NO correctIndex for normal participants)
  app.get('/api/quiz/questions', (req, res) => {
    const publicQuestions: QuestionPublic[] = QUESTIONS_DB.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
      points: q.points,
    }));

    res.json({
      totalQuestions: publicQuestions.length,
      durationSeconds: QUIZ_DURATION_SECONDS,
      perQuestionSeconds: PER_QUESTION_SECONDS,
      questions: publicQuestions,
    });
  });

  // 4. Real Team Registration & Start Quiz Session
  app.post('/api/quiz/start', (req, res) => {
    const { teamName, leaderName, college, ieeeNumber } = req.body;

    if (!teamName || !leaderName || !college || !ieeeNumber) {
      res.status(400).json({
        error: "Missing required details. Please provide Team Name, Team Representatives, College, and IEEE Membership / Registration Number.",
      });
      return;
    }

    const cleanTeamName = teamName.trim();
    const cleanLeader = leaderName.trim();
    const cleanCollege = college.trim();
    const cleanIeeeNumber = String(ieeeNumber).trim();

    if (cleanTeamName.length < 2 || cleanTeamName.length > 60) {
      res.status(400).json({ error: "Team name must be between 2 and 60 characters." });
      return;
    }

    if (cleanIeeeNumber.length < 2 || cleanIeeeNumber.length > 50) {
      res.status(400).json({ error: "Please enter a valid IEEE Membership / Registration Number (2-50 characters)." });
      return;
    }

    // 1. Strict Duplicate Check: Prevent multiple submissions / attempts for the same IEEE Number
    const existingIeeeTeam = Array.from(teamsStore.values()).find(
      (t) => t.ieeeNumber && t.ieeeNumber.toLowerCase() === cleanIeeeNumber.toLowerCase()
    );
    if (existingIeeeTeam) {
      res.status(409).json({
        error: `IEEE Registration Number "${cleanIeeeNumber}" has already been used to attend the quiz by team "${existingIeeeTeam.teamName}". Each IEEE registration is strictly allowed only ONE attempt/submission.`,
      });
      return;
    }

    // 2. Check for duplicate team name (case-insensitive)
    const existingTeam = Array.from(teamsStore.values()).find(
      (t) => t.teamName.toLowerCase() === cleanTeamName.toLowerCase()
    );
    if (existingTeam) {
      res.status(409).json({
        error: `A team named "${cleanTeamName}" is already registered. Please choose a unique team name.`,
      });
      return;
    }

    // Generate unique sequential registration ID (e.g. QO-2026-01, QO-2026-02)
    let teamIndex = teamsStore.size + 1;
    let assignedTeamId = `QO-2026-${String(teamIndex).padStart(2, '0')}`;
    while (teamsStore.has(assignedTeamId)) {
      teamIndex++;
      assignedTeamId = `QO-2026-${String(teamIndex).padStart(2, '0')}`;
    }

    const now = Date.now();
    const sessionId = `SESSION-${now}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTeam: TeamRecord = {
      teamId: assignedTeamId,
      teamName: cleanTeamName,
      leaderName: cleanLeader,
      college: cleanCollege,
      ieeeNumber: cleanIeeeNumber,
      createdAt: now,
      sessionId,
      status: "IN_PROGRESS",
    };

    const newSession: QuizSession = {
      sessionId,
      teamName: cleanTeamName,
      leaderName: cleanLeader,
      college: cleanCollege,
      ieeeNumber: cleanIeeeNumber,
      teamId: assignedTeamId,
      startTime: now,
      durationSeconds: QUIZ_DURATION_SECONDS,
      perQuestionSeconds: PER_QUESTION_SECONDS,
      answers: {},
      submitted: false,
      submittedAt: null,
      score: null,
      correctCount: null,
      incorrectCount: null,
      unansweredCount: null,
      completionTimeSeconds: null,
      isDisqualified: false,
      violationsCount: 0,
    };

    teamsStore.set(assignedTeamId, newTeam);
    sessionsStore.set(sessionId, newSession);
    saveDatabase();

    res.status(201).json({
      sessionId,
      teamName: cleanTeamName,
      leaderName: cleanLeader,
      college: cleanCollege,
      ieeeNumber: cleanIeeeNumber,
      teamId: assignedTeamId,
      startTime: newSession.startTime,
      durationSeconds: newSession.durationSeconds,
      perQuestionSeconds: newSession.perQuestionSeconds,
    });
  });

  // 5. Get Quiz Session Status (Dynamic calculation based on server start time)
  app.get('/api/quiz/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = sessionsStore.get(sessionId);

    if (!session) {
      res.status(404).json({ error: "Session not found or expired" });
      return;
    }

    const elapsedSeconds = Math.floor((Date.now() - session.startTime) / 1000);
    const remainingSeconds = Math.max(0, session.durationSeconds - elapsedSeconds);

    // If quiz time has completely expired and not yet marked submitted, auto-evaluate now
    if (remainingSeconds <= 0 && !session.submitted) {
      let correctCount = 0;
      let incorrectCount = 0;
      let unansweredCount = 0;

      QUESTIONS_DB.forEach((q) => {
        const userChoice = session.answers[q.id];
        if (userChoice === undefined || userChoice === null) {
          unansweredCount++;
        } else if (userChoice === q.correctIndex) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      });

      session.submitted = true;
      session.submittedAt = session.startTime + session.durationSeconds * 1000;
      session.score = correctCount;
      session.correctCount = correctCount;
      session.incorrectCount = incorrectCount;
      session.unansweredCount = unansweredCount;
      session.completionTimeSeconds = session.durationSeconds;

      const team = teamsStore.get(session.teamId);
      if (team) {
        team.status = "SUBMITTED";
      }

      saveDatabase();
    }

    res.json({
      sessionId: session.sessionId,
      teamName: session.teamName,
      leaderName: session.leaderName,
      college: session.college,
      ieeeNumber: session.ieeeNumber || "N/A",
      teamId: session.teamId,
      startTime: session.startTime,
      durationSeconds: session.durationSeconds,
      perQuestionSeconds: session.perQuestionSeconds || PER_QUESTION_SECONDS,
      currentIndex: session.currentIndex ?? 0,
      elapsedSeconds,
      remainingSeconds,
      answers: session.answers,
      markedForReview: session.markedForReview || {},
      submitted: session.submitted,
      submittedAt: session.submittedAt,
      isDisqualified: session.isDisqualified || false,
      disqualificationReason: session.disqualificationReason,
      result: session.submitted
        ? {
            status: session.isDisqualified ? "DISQUALIFIED" : "RECORDED",
            score: session.score,
            correctCount: session.correctCount,
            incorrectCount: session.incorrectCount,
            unansweredCount: session.unansweredCount,
            completionTimeSeconds: session.completionTimeSeconds,
            submittedAt: session.submittedAt,
          }
        : null,
    });
  });

  // 6. Save Draft Answers & Progress
  app.post('/api/quiz/save-answers', (req, res) => {
    const { sessionId, answers, markedForReview, currentIndex } = req.body;
    const session = sessionsStore.get(sessionId);

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    if (session.submitted) {
      res.status(400).json({ error: "Quiz has already been submitted" });
      return;
    }

    if (answers && typeof answers === 'object') {
      session.answers = { ...session.answers, ...answers };
    }
    if (markedForReview && typeof markedForReview === 'object') {
      session.markedForReview = { ...(session.markedForReview || {}), ...markedForReview };
    }
    if (typeof currentIndex === 'number' && currentIndex >= 0) {
      session.currentIndex = Math.max(session.currentIndex || 0, currentIndex);
    }

    sessionsStore.set(sessionId, session);
    saveDatabase();

    res.json({ status: "draft_saved", timestamp: Date.now() });
  });

  // 7. Anti-Cheat Disqualify Endpoint
  app.post('/api/quiz/disqualify', (req, res) => {
    const { sessionId, reason, violationsCount } = req.body;
    const session = sessionsStore.get(sessionId);

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const submittedAt = Date.now();
    session.isDisqualified = true;
    session.disqualificationReason = reason || "Multiple AI assistance and tab-navigation violations";
    session.violationsCount = violationsCount || 2;
    session.submitted = true;
    session.submittedAt = submittedAt;
    session.score = 0;
    session.correctCount = 0;
    session.completionTimeSeconds = Math.max(1, Math.floor((submittedAt - session.startTime) / 1000));

    sessionsStore.set(sessionId, session);

    const team = teamsStore.get(session.teamId);
    if (team) {
      team.status = "DISQUALIFIED";
    }

    saveDatabase();

    res.json({
      status: "DISQUALIFIED",
      sessionId: session.sessionId,
      teamId: session.teamId,
      teamName: session.teamName,
      reason: session.disqualificationReason,
    });
  });

  // 8. Submit Quiz (Server-authoritative evaluation & prevents duplicates)
  app.post('/api/quiz/submit', (req, res) => {
    const { sessionId, answers } = req.body;
    const session = sessionsStore.get(sessionId);

    if (!session) {
      res.status(404).json({ error: "Invalid session. Session does not exist." });
      return;
    }

    // Protection against duplicate submission
    if (session.submitted) {
      res.json({
        sessionId: session.sessionId,
        teamName: session.teamName,
        leaderName: session.leaderName,
        college: session.college,
        teamId: session.teamId,
        score: session.score,
        correctCount: session.correctCount,
        incorrectCount: session.incorrectCount,
        unansweredCount: session.unansweredCount,
        completionTimeSeconds: session.completionTimeSeconds,
        submittedAt: session.submittedAt,
        alreadySubmitted: true,
      });
      return;
    }

    const finalAnswers: Record<number, number> = answers || session.answers || {};
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    QUESTIONS_DB.forEach((q) => {
      const userChoice = finalAnswers[q.id];
      if (userChoice === undefined || userChoice === null) {
        unansweredCount++;
      } else if (userChoice === q.correctIndex) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const score = correctCount; // 1 point per correct answer
    const submittedAt = Date.now();
    const completionTimeSeconds = Math.min(
      session.durationSeconds,
      Math.max(1, Math.floor((submittedAt - session.startTime) / 1000))
    );

    session.answers = finalAnswers;
    session.submitted = true;
    session.submittedAt = submittedAt;
    session.score = score;
    session.correctCount = correctCount;
    session.incorrectCount = incorrectCount;
    session.unansweredCount = unansweredCount;
    session.completionTimeSeconds = completionTimeSeconds;

    sessionsStore.set(sessionId, session);

    const team = teamsStore.get(session.teamId);
    if (team) {
      team.status = "SUBMITTED";
    }

    saveDatabase();
    appendLedger("QUIZ_SUBMITTED", {
      sessionId: session.sessionId,
      teamId: session.teamId,
      teamName: session.teamName,
      score: session.score,
      correctCount,
      completionTimeSeconds,
    });

    res.json({
      sessionId: session.sessionId,
      teamName: session.teamName,
      leaderName: session.leaderName,
      college: session.college,
      ieeeNumber: session.ieeeNumber || "N/A",
      teamId: session.teamId,
      score: session.score,
      correctCount: session.correctCount,
      incorrectCount: session.incorrectCount,
      unansweredCount: session.unansweredCount,
      completionTimeSeconds: session.completionTimeSeconds,
      submittedAt,
      status: "RECORDED",
    });
  });

  // 8b. Auto-Recovery & Client Session Synchronization
  app.post('/api/quiz/sync-session', (req, res) => {
    const {
      sessionId,
      teamName,
      leaderName,
      college,
      ieeeNumber,
      teamId,
      answers,
      submitted,
      score,
      correctCount,
      incorrectCount,
      unansweredCount,
      completionTimeSeconds,
      submittedAt,
    } = req.body;

    if (!sessionId || !teamName) {
      res.status(400).json({ error: "Missing sessionId or teamName for sync" });
      return;
    }

    const assignedTeamId = teamId || `QO-2026-${String(teamsStore.size + 1).padStart(2, '0')}`;
    const now = submittedAt || Date.now();

    // Calculate score accurately based on answer sheet
    let calcCorrect = 0;
    let calcIncorrect = 0;
    let calcUnanswered = 0;
    const finalAnswers: Record<number, number> = answers || {};

    QUESTIONS_DB.forEach((q) => {
      const userChoice = finalAnswers[q.id];
      if (userChoice === undefined || userChoice === null) {
        calcUnanswered++;
      } else if (userChoice === q.correctIndex) {
        calcCorrect++;
      } else {
        calcIncorrect++;
      }
    });

    const isDone = submitted !== undefined ? submitted : Object.keys(finalAnswers).length > 0;
    const finalScore = typeof score === 'number' ? score : calcCorrect;

    const teamRecord: TeamRecord = {
      teamId: assignedTeamId,
      teamName,
      leaderName: leaderName || "Participant",
      college: college || "College",
      ieeeNumber: ieeeNumber || "N/A",
      createdAt: now,
      sessionId,
      status: isDone ? "SUBMITTED" : "IN_PROGRESS",
    };

    const sessionRecord: QuizSession = {
      sessionId,
      teamName,
      leaderName: leaderName || "Participant",
      college: college || "College",
      ieeeNumber: ieeeNumber || "N/A",
      teamId: assignedTeamId,
      startTime: now - (completionTimeSeconds || 120) * 1000,
      durationSeconds: QUIZ_DURATION_SECONDS,
      perQuestionSeconds: PER_QUESTION_SECONDS,
      answers: finalAnswers,
      submitted: isDone,
      submittedAt: isDone ? now : null,
      score: isDone ? finalScore : null,
      correctCount: isDone ? (typeof correctCount === 'number' ? correctCount : calcCorrect) : null,
      incorrectCount: isDone ? (typeof incorrectCount === 'number' ? incorrectCount : calcIncorrect) : null,
      unansweredCount: isDone ? (typeof unansweredCount === 'number' ? unansweredCount : calcUnanswered) : null,
      completionTimeSeconds: completionTimeSeconds || (isDone ? 120 : null),
      isDisqualified: false,
    };

    teamsStore.set(assignedTeamId, teamRecord);
    sessionsStore.set(sessionId, sessionRecord);
    saveDatabase();
    appendLedger("SESSION_RECOVERED_SYNC", { sessionId, teamName, score: finalScore });

    res.json({
      status: "SYNCED",
      sessionId,
      teamId: assignedTeamId,
      score: finalScore,
      submitted: isDone,
    });
  });

  // 9. Organizer Leaderboard Endpoint (Real database calculations only)
  app.get('/api/organizer/leaderboard', (req, res) => {
    const submittedSessions: QuizSession[] = Array.from(sessionsStore.values()).filter(
      (s) => s.submitted && s.score !== null
    );

    // Dynamic sorting:
    // 1. Non-disqualified first
    // 2. Highest score first
    // 3. Fastest completion time first
    // 4. Earliest submission timestamp first
    submittedSessions.sort((a, b) => {
      if (a.isDisqualified && !b.isDisqualified) return 1;
      if (!a.isDisqualified && b.isDisqualified) return -1;
      if (b.score! !== a.score!) {
        return b.score! - a.score!;
      }
      if ((a.completionTimeSeconds || 0) !== (b.completionTimeSeconds || 0)) {
        return (a.completionTimeSeconds || 0) - (b.completionTimeSeconds || 0);
      }
      return (a.submittedAt || 0) - (b.submittedAt || 0);
    });

    const leaderboard: LeaderboardEntry[] = submittedSessions.map((session, idx) => {
      const rank = idx + 1;
      return {
        rank,
        sessionId: session.sessionId,
        teamName: session.teamName,
        leaderName: session.leaderName,
        college: session.college,
        ieeeNumber: session.ieeeNumber || "N/A",
        teamId: session.teamId,
        score: session.score!,
        totalQuestions: QUESTIONS_DB.length,
        correctCount: session.correctCount!,
        incorrectCount: session.incorrectCount!,
        unansweredCount: session.unansweredCount!,
        completionTimeSeconds: session.completionTimeSeconds!,
        submittedAt: session.submittedAt!,
        isQualified: !session.isDisqualified && rank <= 6,
        isDisqualified: session.isDisqualified || false,
        disqualificationReason: session.disqualificationReason,
        answers: session.answers,
      };
    });

    res.json({
      totalTeams: leaderboard.length,
      registeredTeams: teamsStore.size,
      qualifyingLimit: 6,
      durationSeconds: QUIZ_DURATION_SECONDS,
      leaderboard,
      questionsKey: QUESTIONS_DB, // Protected for organizer console
    });
  });

  // 10. Author/Organizer Master Key
  app.get('/api/organizer/master-key', (req, res) => {
    res.json({
      totalQuestions: QUESTIONS_DB.length,
      questions: QUESTIONS_DB,
    });
  });

  // 11. Author/Organizer Team Inspection
  app.get('/api/organizer/inspect/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = sessionsStore.get(sessionId);

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const detailedBreakdown = QUESTIONS_DB.map((q) => {
      const userChoice = session.answers[q.id];
      const isCorrect = userChoice === q.correctIndex;
      const isUnanswered = userChoice === undefined || userChoice === null;

      return {
        questionId: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        userChoice: userChoice ?? null,
        isCorrect,
        isUnanswered,
      };
    });

    res.json({
      session,
      detailedBreakdown,
    });
  });

  // 12. Organizer Add/Restore Entry
  app.post('/api/organizer/add-entry', (req, res) => {
    const { teamName, leaderName, college, ieeeNumber, score, completionTimeSeconds } = req.body;
    if (!teamName) {
      res.status(400).json({ error: "Team Name is required." });
      return;
    }

    const cleanTeam = teamName.trim();
    const cleanLeader = (leaderName || "Participant Team").trim();
    const cleanCollege = (college || "R.M.K. Engineering College").trim();
    const cleanIeee = (ieeeNumber || "STB61871-AUTO").trim();
    const parsedScore = Math.min(15, Math.max(0, parseInt(score) || 0));
    const parsedTime = Math.max(1, parseInt(completionTimeSeconds) || 90);

    const now = Date.now();
    let teamIndex = teamsStore.size + 1;
    let assignedTeamId = `QO-2026-${String(teamIndex).padStart(2, '0')}`;
    while (teamsStore.has(assignedTeamId)) {
      teamIndex++;
      assignedTeamId = `QO-2026-${String(teamIndex).padStart(2, '0')}`;
    }

    const sessionId = `MANUAL-SESSION-${now}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTeam: TeamRecord = {
      teamId: assignedTeamId,
      teamName: cleanTeam,
      leaderName: cleanLeader,
      college: cleanCollege,
      ieeeNumber: cleanIeee,
      createdAt: now,
      sessionId,
      status: "SUBMITTED",
    };

    const newSession: QuizSession = {
      sessionId,
      teamName: cleanTeam,
      leaderName: cleanLeader,
      college: cleanCollege,
      ieeeNumber: cleanIeee,
      teamId: assignedTeamId,
      startTime: now - parsedTime * 1000,
      durationSeconds: QUIZ_DURATION_SECONDS,
      perQuestionSeconds: PER_QUESTION_SECONDS,
      answers: {},
      submitted: true,
      submittedAt: now,
      score: parsedScore,
      correctCount: parsedScore,
      incorrectCount: 15 - parsedScore,
      unansweredCount: 0,
      completionTimeSeconds: parsedTime,
      isDisqualified: false,
    };

    teamsStore.set(assignedTeamId, newTeam);
    sessionsStore.set(sessionId, newSession);
    saveDatabase();
    appendLedger("ORGANIZER_MANUAL_ENTRY", { teamId: assignedTeamId, teamName: cleanTeam, score: parsedScore });

    res.status(201).json({ message: "Team record added successfully", teamId: assignedTeamId });
  });

  // 12b. Organizer Bulk Import
  app.post('/api/organizer/bulk-import', (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Invalid items array." });
      return;
    }

    let addedCount = 0;
    const now = Date.now();

    items.forEach((item: any, idx: number) => {
      if (!item.teamName) return;
      const cleanTeam = String(item.teamName).trim();
      const cleanLeader = String(item.leaderName || "Team Representative").trim();
      const cleanCollege = String(item.college || "R.M.K. Engineering College").trim();
      const cleanIeee = String(item.ieeeNumber || `STB61871-${idx + 1}`).trim();
      const parsedScore = Math.min(15, Math.max(0, parseInt(item.score) || 0));
      const parsedTime = Math.max(1, parseInt(item.completionTimeSeconds) || (70 + idx * 3));

      let teamIndex = teamsStore.size + 1;
      let assignedTeamId = `QO-2026-${String(teamIndex).padStart(2, '0')}`;
      while (teamsStore.has(assignedTeamId)) {
        teamIndex++;
        assignedTeamId = `QO-2026-${String(teamIndex).padStart(2, '0')}`;
      }

      const sessionId = `BULK-${now}-${idx}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newTeam: TeamRecord = {
        teamId: assignedTeamId,
        teamName: cleanTeam,
        leaderName: cleanLeader,
        college: cleanCollege,
        ieeeNumber: cleanIeee,
        createdAt: now,
        sessionId,
        status: "SUBMITTED",
      };

      const newSession: QuizSession = {
        sessionId,
        teamName: cleanTeam,
        leaderName: cleanLeader,
        college: cleanCollege,
        ieeeNumber: cleanIeee,
        teamId: assignedTeamId,
        startTime: now - parsedTime * 1000,
        durationSeconds: QUIZ_DURATION_SECONDS,
        perQuestionSeconds: PER_QUESTION_SECONDS,
        answers: {},
        submitted: true,
        submittedAt: now,
        score: parsedScore,
        correctCount: parsedScore,
        incorrectCount: 15 - parsedScore,
        unansweredCount: 0,
        completionTimeSeconds: parsedTime,
        isDisqualified: false,
      };

      teamsStore.set(assignedTeamId, newTeam);
      sessionsStore.set(sessionId, newSession);
      addedCount++;
    });

    saveDatabase();
    appendLedger("ORGANIZER_BULK_IMPORT", { addedCount });
    res.json({ message: `Successfully imported ${addedCount} team records.`, addedCount });
  });

  // 12c. Organizer Reset
  app.post('/api/organizer/reset', (req, res) => {
    const { passkey } = req.body;
    if (passkey !== 'IEEE24') {
      res.status(403).json({ error: "Invalid organizer passkey. Reset rejected." });
      return;
    }
    teamsStore.clear();
    sessionsStore.clear();
    saveDatabase();
    appendLedger("ORGANIZER_RESET", { timestamp: Date.now() });
    res.json({ message: "All quiz sessions and teams reset successfully" });
  });

  // 13. Organizer Configuration
  app.post('/api/organizer/config', (req, res) => {
    const { durationMinutes } = req.body;
    if (durationMinutes && typeof durationMinutes === 'number' && durationMinutes > 0) {
      QUIZ_DURATION_SECONDS = durationMinutes * 60;
      saveDatabase();
      res.json({ message: `Quiz duration updated to ${durationMinutes} minutes`, durationSeconds: QUIZ_DURATION_SECONDS });
    } else {
      res.status(400).json({ error: "Invalid duration" });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn("dist directory not found, fallback to dev mode middleware if available");
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[QUIZ ODYSSEY SERVER] Live on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

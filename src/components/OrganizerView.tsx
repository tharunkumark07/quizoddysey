import React, { useState, useEffect } from 'react';
import { LeaderboardTeam } from '../types/quiz';
import { Trophy, RefreshCw, Download, Search, Award, Clock, Users, CheckCircle, Key, Eye, AlertCircle } from 'lucide-react';

interface OrganizerViewProps {
  onBackToQualifier: () => void;
}

interface QuestionKey {
  id: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

interface TeamInspectionDetail {
  questionId: number;
  category: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  userChoice: number | null;
  isCorrect: boolean;
  isUnanswered: boolean;
}

export const OrganizerView: React.FC<OrganizerViewProps> = ({ onBackToQualifier }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
  const [registeredTeamsCount, setRegisteredTeamsCount] = useState<number>(0);
  const [questionsKey, setQuestionsKey] = useState<QuestionKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQualifyingOnly, setFilterQualifyingOnly] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<LeaderboardTeam | null>(null);
  const [teamInspection, setTeamInspection] = useState<TeamInspectionDetail[] | null>(null);
  const [isInspectingLoading, setIsInspectingLoading] = useState(false);
  const [showMasterKeyModal, setShowMasterKeyModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/organizer/leaderboard');
      if (!res.ok) throw new Error("Failed to fetch leaderboard data");
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
      setRegisteredTeamsCount(typeof data.registeredTeams === 'number' ? data.registeredTeams : 0);
      if (data.questionsKey) {
        setQuestionsKey(data.questionsKey);
      }
    } catch (err: any) {
      setError(err.message || "Network error loading leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Live update leaderboard every 8 seconds
    const interval = setInterval(fetchLeaderboard, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleInspectTeam = async (team: LeaderboardTeam) => {
    setSelectedTeam(team);
    setIsInspectingLoading(true);
    setTeamInspection(null);

    try {
      const res = await fetch(`/api/organizer/inspect/${team.sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setTeamInspection(data.detailedBreakdown || []);
      }
    } catch (err) {
      console.error("Failed to fetch detailed team breakdown:", err);
    } finally {
      setIsInspectingLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Confirm reset? This will wipe all real team registrations and submissions.")) return;
    try {
      const res = await fetch('/api/organizer/reset', { method: 'POST' });
      if (res.ok) {
        setActionSuccess("All quiz sessions and teams reset successfully");
        setTimeout(() => setActionSuccess(null), 3000);
        fetchLeaderboard();
      }
    } catch (e) {
      setError("Failed to reset sessions");
    }
  };

  const handleExportCSV = () => {
    if (leaderboard.length === 0) return;
    const headers = ["Rank", "Team Name", "Leader Name", "College", "Team ID", "Score", "Accuracy (%)", "Time Taken (s)", "Timestamp", "Status"];
    const rows = leaderboard.map((t) => [
      t.rank,
      `"${t.teamName.replace(/"/g, '""')}"`,
      `"${t.leaderName.replace(/"/g, '""')}"`,
      `"${t.college.replace(/"/g, '""')}"`,
      t.teamId,
      `${t.score}/${t.totalQuestions}`,
      Math.round((t.score / t.totalQuestions) * 100),
      t.completionTimeSeconds,
      new Date(t.submittedAt).toISOString(),
      t.isDisqualified ? "DISQUALIFIED" : t.isQualified ? "QUALIFIED" : "NOT QUALIFIED",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quiz_odyssey_rankings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTeams = leaderboard.filter((team) => {
    const matchesSearch =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.teamId.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterQualifyingOnly) {
      return matchesSearch && team.isQualified;
    }
    return matchesSearch;
  });

  const totalSubmissions = leaderboard.length;
  const topScore = totalSubmissions > 0 ? leaderboard[0].score : null;
  const avgScore = totalSubmissions > 0
    ? (leaderboard.reduce((acc, t) => acc + t.score, 0) / totalSubmissions).toFixed(1)
    : null;

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans bg-tech-dots">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="font-mono text-xs font-semibold text-blue-400 uppercase tracking-widest block mb-1">
              ORGANIZER EVALUATION CONSOLE
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Qualifier Scoreboard &amp; Rankings
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              R.M.K. Engineering College · IEEE Student Branch STB61871 · Live Competition Console
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <button
              onClick={() => setShowMasterKeyModal(true)}
              className="h-10 px-4 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 font-medium transition-all hover:bg-blue-900 flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Master Key</span>
            </button>

            <button
              onClick={fetchLeaderboard}
              className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={totalSubmissions === 0}
              className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleReset}
              className="h-10 px-3.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition-colors cursor-pointer"
              title="Reset all registrations and submissions"
            >
              Reset All
            </button>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono rounded-xl">
            ✓ {actionSuccess}
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Dynamic Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-slate-500 block text-[10px] uppercase">REGISTERED TEAMS</span>
            <span className="text-2xl font-extrabold text-white block mt-1 tabular-nums">
              {registeredTeamsCount}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-slate-500 block text-[10px] uppercase">TOTAL SUBMISSIONS</span>
            <span className="text-2xl font-extrabold text-white block mt-1 tabular-nums">
              {totalSubmissions}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-slate-500 block text-[10px] uppercase">HIGHEST SCORE</span>
            <span className="text-2xl font-extrabold text-cyan-400 block mt-1">
              {topScore !== null ? `${topScore} / 15` : <span className="text-slate-500 text-sm font-sans font-normal">No submissions yet</span>}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <span className="text-slate-500 block text-[10px] uppercase">AVERAGE SCORE</span>
            <span className="text-2xl font-extrabold text-white block mt-1">
              {avgScore !== null ? `${avgScore} / 15` : <span className="text-slate-500 text-sm font-sans font-normal">No submissions yet</span>}
            </span>
          </div>

        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Team, Member, Institution, or ID..."
              className="w-full h-10 pl-10 pr-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <label className="flex items-center space-x-2 cursor-pointer text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={filterQualifyingOnly}
              onChange={(e) => setFilterQualifyingOnly(e.target.checked)}
              className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0"
            />
            <span>Show Top 6 Qualified Only</span>
          </label>
        </div>

        {/* Live Dynamic Scoreboard Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {isLoading && totalSubmissions === 0 ? (
            <div className="p-16 text-center font-mono text-xs text-slate-400 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-400" />
              <p>Connecting to database...</p>
            </div>
          ) : totalSubmissions === 0 ? (
            /* Genuine Clean Empty State - ZERO FAKE DATA */
            <div className="p-16 text-center text-slate-400 space-y-3 font-mono">
              <div className="inline-flex p-4 rounded-2xl bg-slate-950 border border-slate-800 text-blue-400 mb-1">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">NO SUBMISSIONS YET</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {registeredTeamsCount > 0
                  ? `${registeredTeamsCount} team${registeredTeamsCount === 1 ? '' : 's'} registered and currently taking the qualifier. Real-time scores will populate automatically as participants complete the test.`
                  : "No student teams have registered or submitted responses yet. Live rankings will populate in real-time as participants finish."}
              </p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 space-y-1 font-mono">
              <p>No teams match search query "{searchQuery}".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs sm:text-sm">
                
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <th className="py-3.5 px-5 font-semibold w-16 text-center">RANK</th>
                    <th className="py-3.5 px-5 font-semibold">TEAM &amp; PARTICIPANTS</th>
                    <th className="py-3.5 px-5 font-semibold hidden md:table-cell">INSTITUTION</th>
                    <th className="py-3.5 px-5 font-semibold text-center w-24">SCORE</th>
                    <th className="py-3.5 px-5 font-semibold text-center w-24 font-mono">TIME</th>
                    <th className="py-3.5 px-5 font-semibold text-center w-36">STATUS</th>
                    <th className="py-3.5 px-5 font-semibold text-right w-24">ACTIONS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredTeams.map((team) => (
                    <tr 
                      key={team.sessionId}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        team.isDisqualified
                          ? 'bg-rose-950/20 border-l-2 border-rose-500'
                          : team.isQualified
                          ? 'bg-blue-950/20 border-l-2 border-emerald-500'
                          : ''
                      }`}
                    >
                      {/* Narrow Rank Column */}
                      <td className="py-4 px-5 font-mono font-bold text-center text-slate-300">
                        #{team.rank}
                      </td>

                      {/* Team Info */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-white">{team.teamName}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {team.leaderName} <span className="text-slate-600">·</span> <span className="text-blue-400">{team.teamId}</span>
                        </div>
                      </td>

                      {/* College */}
                      <td className="py-4 px-5 hidden md:table-cell text-slate-300">
                        {team.college}
                      </td>

                      {/* Score */}
                      <td className="py-4 px-5 text-center font-mono font-bold text-white text-sm">
                        {team.score} / {team.totalQuestions}
                      </td>

                      {/* Time */}
                      <td className="py-4 px-5 text-center font-mono text-slate-400">
                        {formatTime(team.completionTimeSeconds)}
                      </td>

                      {/* Qualification / Disqualification Status */}
                      <td className="py-4 px-5 text-center">
                        {team.isDisqualified ? (
                          <span className="font-mono text-[10px] font-bold text-rose-400 bg-rose-950 border border-rose-800 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                            DISQUALIFIED (AI)
                          </span>
                        ) : team.isQualified ? (
                          <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                            QUALIFIED (TOP 6)
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-slate-500 uppercase">
                            NOT QUALIFIED
                          </span>
                        )}
                      </td>

                      {/* Inspect Button */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleInspectTeam(team)}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium underline cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* Selected Team Inspection Drawer */}
        {selectedTeam && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 text-xs font-sans shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">OFFICIAL SUBMISSION INSPECTION</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedTeam.teamName} ({selectedTeam.teamId})</h3>
                <p className="text-slate-400 text-xs font-mono">{selectedTeam.leaderName} · {selectedTeam.college}</p>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg cursor-pointer font-mono text-xs transition-colors"
              >
                Close ×
              </button>
            </div>

            {isInspectingLoading ? (
              <div className="p-8 text-center text-slate-400 font-mono">Loading answer matrix...</div>
            ) : teamInspection ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {teamInspection.map((item, idx) => {
                  const optPrefixes = ['A', 'B', 'C', 'D'];

                  return (
                    <div 
                      key={item.questionId}
                      className={`p-4 rounded-xl border font-mono text-xs ${
                        item.isCorrect
                          ? 'bg-emerald-950/20 border-emerald-900/60'
                          : item.isUnanswered
                          ? 'bg-slate-950 border-slate-800'
                          : 'bg-rose-950/20 border-rose-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1.5 font-sans">
                        <span className="font-bold text-white">Q{idx + 1}. {item.question}</span>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          item.isCorrect 
                            ? 'text-emerald-400 bg-emerald-950 border border-emerald-800' 
                            : item.isUnanswered 
                            ? 'text-slate-400 bg-slate-800' 
                            : 'text-rose-400 bg-rose-950 border border-rose-800'
                        }`}>
                          {item.isCorrect ? 'CORRECT (+1)' : item.isUnanswered ? 'UNANSWERED (0)' : 'INCORRECT (0)'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono space-y-0.5 pt-1">
                        <div>
                          Team Selected: <span className="text-white font-semibold">
                            {item.userChoice !== null ? `${optPrefixes[item.userChoice]}. ${item.options[item.userChoice]}` : 'None'}
                          </span>
                        </div>
                        <div>
                          Master Key: <span className="text-emerald-400 font-semibold">
                            {optPrefixes[item.correctIndex]}. {item.options[item.correctIndex]}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}

        {/* Master Key Modal for Author/Organizer */}
        {showMasterKeyModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Master Answer Key</h3>
                  <p className="text-xs text-slate-400 font-mono">15 Questions · Standard 1 Point Per Question</p>
                </div>
                <button
                  onClick={() => setShowMasterKeyModal(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg cursor-pointer font-mono text-xs transition-colors"
                >
                  Close ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs font-mono">
                {questionsKey.map((q, idx) => {
                  const optPrefixes = ['A', 'B', 'C', 'D'];
                  return (
                    <div key={q.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="font-sans font-semibold text-white">Q{idx + 1}. {q.question}</div>
                      <div className="text-[11px] text-slate-400">Domain: {q.category}</div>
                      <div className="text-emerald-400 font-bold pt-1">
                        Answer: {optPrefixes[q.correctIndex]}. {q.options[q.correctIndex]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

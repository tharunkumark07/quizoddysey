import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export const LiveParticipantCounter: React.FC = () => {
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [submittedCount, setSubmittedCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchLiveStats = async () => {
      try {
        const res = await fetch('/api/quiz/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setRegisteredCount(typeof data.registeredTeams === 'number' ? data.registeredTeams : 0);
            setSubmittedCount(typeof data.submittedTeams === 'number' ? data.submittedTeams : 0);
          }
        }
      } catch (e) {
        // Network fallback
      }
    };

    fetchLiveStats();
    // Poll live count every 3 seconds to keep real-time sync as participants register
    const interval = setInterval(fetchLiveStats, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between font-mono text-xs"
    >
      <div className="flex items-center space-x-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>
        <div>
          <div className="text-white font-bold flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>LIVE COMPETITION PORTAL</span>
          </div>
          <p className="text-[10px] text-slate-400">
            {submittedCount > 0
              ? `${submittedCount} submitted to evaluation console`
              : "Real-time registration active"}
          </p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-lg text-right">
        <span className="text-[10px] text-slate-400 block uppercase">LIVE TEAMS</span>
        <span className="text-base font-extrabold text-cyan-300 tabular-nums">
          {registeredCount} TEAMS
        </span>
      </div>
    </motion.div>
  );
};

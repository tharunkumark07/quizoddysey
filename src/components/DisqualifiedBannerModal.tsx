import React from 'react';
import { Ban, AlertOctagon, X, Home } from 'lucide-react';

interface DisqualifiedBannerModalProps {
  isOpen: boolean;
  teamName?: string;
  teamId?: string;
  reason?: string;
  onClose: () => void;
}

export const DisqualifiedBannerModal: React.FC<DisqualifiedBannerModalProps> = ({
  isOpen,
  teamName,
  teamId,
  reason,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden">
        
        {/* Red Warning Accent Top Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-rose-600" />

        {/* Header with Alert Octagon */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex p-3 rounded-full bg-rose-950/80 border-2 border-rose-600 text-rose-500 mb-1">
            <AlertOctagon className="w-10 h-10 animate-pulse" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-rose-400 block">
            OFFICIAL DISQUALIFICATION NOTICE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Team Disqualified
          </h2>
          {teamName && (
            <p className="text-sm font-semibold text-slate-300 font-mono">
              {teamName} {teamId ? `(${teamId})` : ''}
            </p>
          )}
        </div>

        {/* Violation Reason Box */}
        <div className="bg-slate-950 border border-rose-900/80 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-mono text-rose-400 font-bold uppercase text-[11px]">
            <Ban className="w-4 h-4 text-rose-500" />
            <span>DISQUALIFICATION CAUSE:</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">
            {reason || "Multiple AI assistance and tab-navigation violations detected during the live examination."}
          </p>
        </div>

        {/* Explanation */}
        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            As stated in the competition rules, participants are strictly forbidden from using external AI tools, switching tabs, or navigating away from the quiz portal.
          </p>
          <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg text-rose-300 text-[11px] font-mono">
            ⚠️ All recorded answers for this session have been nullified. This incident has been logged with timestamps in the Organizer Incident Console.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-slate-700"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Acknowledge &amp; Return to Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};

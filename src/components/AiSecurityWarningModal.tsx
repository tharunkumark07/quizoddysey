import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, Ban, EyeOff } from 'lucide-react';

interface AiSecurityWarningModalProps {
  isOpen: boolean;
  violationReason: string;
  onAcknowledge: () => void;
}

export const AiSecurityWarningModal: React.FC<AiSecurityWarningModalProps> = ({
  isOpen,
  violationReason,
  onAcknowledge,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 font-sans relative overflow-hidden">
        
        {/* Top Warning Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse" />

        {/* Warning Icon & Heading */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-400 flex items-center justify-center shrink-0 shadow-lg">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[11px] font-bold uppercase text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                SECURITY VIOLATION [1 / 2]
              </span>
              <span className="font-mono text-[11px] text-amber-400 font-semibold uppercase">
                FIRST WARNING
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5 tracking-tight">
              AI & Navigation Violation Detected
            </h2>
          </div>
        </div>

        {/* Detected Reason Block */}
        <div className="bg-slate-950 border border-rose-900/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 font-mono text-xs text-rose-300 font-semibold">
            <EyeOff className="w-4 h-4 text-rose-400" />
            <span>INCIDENT DETECTED:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {violationReason || "Window focus lost / Tab navigation / Prohibited clipboard access detected."}
          </p>
        </div>

        {/* Strict Anti-AI Rules Notice */}
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-amber-950/30 border-l-2 border-amber-500 rounded-r-lg space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-300">
              <Ban className="w-3.5 h-3.5" />
              <span>STRICT COMPETITION POLICY:</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Quiz Odyssey is an AI-restricted competition. External AI tools (ChatGPT, Claude, Gemini, Copilot), tab switching, and copying question content are strictly prohibited.
            </p>
          </div>

          <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg text-rose-200 text-xs font-semibold">
            ⚠️ FINAL WARNING: If you navigate away, switch tabs, or use AI tools again, your team will be immediately DISQUALIFIED and redirected to Home.
          </div>
        </div>

        {/* Acknowledge Button */}
        <div className="pt-2">
          <button
            onClick={onAcknowledge}
            className="w-full h-12 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:shadow-rose-600/30"
          >
            <span>I Understand &amp; Agree to Comply (Return to Quiz)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

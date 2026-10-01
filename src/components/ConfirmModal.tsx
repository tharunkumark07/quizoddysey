import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  isSubmitting: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  unansweredCount,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Submit Technical Qualifier Quiz?
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                FINAL SUBMISSION CONFIRMATION
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Please verify your response summary below before confirming. Once submitted, your choices are recorded permanently and cannot be modified.
          </p>

          <div className="grid grid-cols-2 gap-3 bg-slate-950 border border-slate-800 p-3 rounded font-mono text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400">Answered Questions</span>
              <span className="text-lg font-bold text-emerald-400">{answeredCount} / {totalQuestions}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400">Unanswered</span>
              <span className={`text-lg font-bold ${unansweredCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {unansweredCount}
              </span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="p-2.5 bg-amber-950/80 border border-amber-800 rounded text-[11px] text-amber-200 font-mono">
              <strong>Notice:</strong> You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Unanswered questions receive 0 points.
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 pt-3 border-t border-slate-800 font-mono text-xs">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold transition-colors border border-slate-700 cursor-pointer"
          >
            Return to Questions
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase tracking-wider transition-colors border border-blue-500 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isSubmitting ? 'Recording...' : 'Confirm Submit'}
          </button>
        </div>

      </div>
    </div>
  );
};

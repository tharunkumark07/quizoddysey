import React, { useState } from 'react';
import { Lock, Key, FileText, ShieldAlert, X } from 'lucide-react';
import { AppViewMode } from '../types/quiz';
import { RmkLogo } from './RmkLogo';

interface HeaderProps {
  currentView: AppViewMode;
  onNavigate: (view: AppViewMode) => void;
  teamName?: string;
  remainingSeconds?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  teamName,
  remainingSeconds,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOrganizerClick = () => {
    if (currentView === 'organizer') {
      onNavigate('landing');
      return;
    }
    if (sessionStorage.getItem('TQ_ORGANIZER_AUTHENTICATED') === 'true') {
      onNavigate('organizer');
    } else {
      setPasskeyInput('');
      setAuthError(null);
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passkeyInput.trim().toUpperCase();
    if (cleanPass === 'IEEE24') {
      sessionStorage.setItem('TQ_ORGANIZER_AUTHENTICATED', 'true');
      setShowAuthModal(false);
      onNavigate('organizer');
    } else {
      setAuthError("Invalid Organizer Passkey. Access restricted.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* LEFT: Branding & Institutional Identifier */}
          <div className="flex items-center space-x-3 shrink-0">
            <button 
              onClick={() => currentView !== 'quiz' && onNavigate('landing')} 
              className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
            >
              <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0 flex items-center justify-center">
                <RmkLogo className="h-8 w-auto" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold tracking-tight text-sm sm:text-base text-slate-100 font-sans">
                    R.M.K. Engineering College
                  </span>
                  <span className="hidden md:inline font-mono text-[10px] uppercase text-blue-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800/60 font-medium">
                    STB61871
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 font-normal">
                  Quiz Odyssey <span className="text-slate-600">·</span> IEEE Day 2026
                </div>
              </div>
            </button>
          </div>

          {/* CENTER: Active Quiz Progress / Status */}
          {currentView === 'quiz' && remainingSeconds !== undefined && (
            <div className="hidden sm:flex items-center space-x-3 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-md font-mono text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-slate-400 text-[11px] uppercase tracking-wider font-medium">QUALIFIER ACTIVE</span>
              <span className="text-slate-600">|</span>
              <span className={`font-semibold tabular-nums ${remainingSeconds < 180 ? 'text-amber-400 animate-pulse' : 'text-blue-300'}`}>
                {formatTimer(remainingSeconds)}
              </span>
            </div>
          )}

          {/* RIGHT: Team & Console Access */}
          <div className="flex items-center space-x-3 shrink-0">
            {currentView === 'quiz' && teamName && (
              <div className="hidden lg:flex items-center space-x-1.5 text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
                <span className="text-slate-500 uppercase">TEAM</span>
                <span className="font-medium text-slate-200 max-w-[130px] truncate">{teamName}</span>
              </div>
            )}

            {currentView !== 'organizer' ? (
              <button
                onClick={handleOrganizerClick}
                className="flex items-center space-x-1.5 text-xs font-sans px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium transition-colors cursor-pointer"
                title="Organizer Login & Results Console"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Organizer Console</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('landing')}
                className="flex items-center space-x-1.5 text-xs font-sans px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Qualifier Home</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Organizer Passkey Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100 font-sans">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <Key className="w-4 h-4 text-blue-400" />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Organizer Portal Passkey
                  </h3>
                  <p className="text-xs text-slate-400">
                    Restricted access for competition directors & judges
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  ENTER ORGANIZER PASSKEY
                </label>
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter secret passkey"
                  className="w-full h-11 text-sm px-4 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono tracking-widest"
                  autoFocus
                  required
                />
              </div>

              <div className="flex space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Authenticate
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

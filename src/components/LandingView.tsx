import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TeamRegistration } from '../types/quiz';
import { ArrowRight, Sparkles, Shield, Clock, Award, Terminal, Code, Cpu, ChevronDown } from 'lucide-react';
import { NeuralCircuitCanvas } from './NeuralCircuitCanvas';
import { InteractiveSubjectCard } from './InteractiveSubjectCard';
import { AnimatedMarqueeTicker } from './AnimatedMarqueeTicker';
import { LiveParticipantCounter } from './LiveParticipantCounter';
import { RmkLogo } from './RmkLogo';

interface LandingViewProps {
  onStartQuiz: (info: TeamRegistration) => void;
  isLoading: boolean;
  error?: string | null;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartQuiz,
  isLoading,
  error,
}) => {
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [member2Name, setMember2Name] = useState('');
  const [college, setCollege] = useState('R.M.K. Engineering College');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setFormError("Please enter your team name");
      return;
    }
    if (!leaderName.trim()) {
      setFormError("Please enter team leader / representative name");
      return;
    }
    if (!member2Name.trim()) {
      setFormError("Please enter Member 2 name (Team size: 2 Members)");
      return;
    }
    if (!college.trim()) {
      setFormError("Please enter your college / institution name");
      return;
    }

    setFormError(null);
    onStartQuiz({
      teamName: teamName.trim(),
      leaderName: `${leaderName.trim()} & ${member2Name.trim()}`,
      college: college.trim(),
    });
  };

  const scrollToRegistration = () => {
    document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-slate-950 text-slate-100 overflow-hidden font-sans bg-tech-dots">
      
      {/* Top Ticker */}
      <div className="w-full relative z-20">
        <AnimatedMarqueeTicker />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24 sm:space-y-36">
        <NeuralCircuitCanvas />

        {/* ============================================================== */}
        {/* --- SECTION 1: STRONG VISUAL EVENT HERO --- */}
        {/* ============================================================== */}
        <section className="relative pt-6 sm:pt-10 space-y-12">
          
          {/* Subtle Ambient Decorative Gradient (Soft, not AI-slop) */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Staggered Hero Composition */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Left / Main Column: Editorial Typography & Event Copy */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 space-y-8 text-center lg:text-left"
            >
              
              {/* 1. Small Event Label */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-mono font-medium text-blue-300"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>IEEE DAY 2026 // ANNUAL TECHNICAL SYMPOSIUM</span>
              </motion.div>

              {/* 2. Large Event Title & Big Headlines */}
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase"
                >
                  THE PRELIMINARY QUALIFIER ROUND
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white leading-[1.05]"
                >
                  THINK FAST.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                    CODE SMART.
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="font-display font-bold text-2xl sm:text-3xl text-slate-300 tracking-wide pt-1"
                >
                  QUIZ ODYSSEY // <span className="text-blue-400">15 QUESTIONS. ONE SHOT.</span>
                </motion.div>
              </div>

              {/* 3. Short Energetic Description */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans"
              >
                15 questions. 10 seconds per challenge. Active anti-AI proctoring. Only the top 6 teams with sharp technical intuition will advance to the live stage finals at the RMKEC Auditorium.
              </motion.p>

              {/* 4. Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <button
                  onClick={scrollToRegistration}
                  className="group relative h-13 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center space-x-2.5 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                >
                  <span>START QUALIFIER</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                </button>

                <button
                  onClick={() => document.getElementById('rules-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-13 px-6 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Rules &amp; Format</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
              </motion.div>

              {/* Technical Metadata Row */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-3 text-xs font-mono text-slate-400"
              >
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>MODE: 2-MEMBER TEAMS</span>
                </div>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>10 SEC / QUESTION</span>
                </div>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>AI PROCTORING</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Column: Prominent College Crest Emblem & Floating Technical Symbols */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center"
            >
              
              {/* Background Geometric Grid Accent */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent rounded-3xl border border-slate-800/80 -z-10 p-8 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-tech-grid opacity-30" />
              </div>

              {/* Floating Technical Symbols (Subtle, purposeful college tech-fest feel) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -left-3 sm:-left-6 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono font-semibold text-blue-400 shadow-xl flex items-center space-x-1.5 z-20"
              >
                <Code className="w-3.5 h-3.5 text-blue-400" />
                <span>{`{ 15 QUESTIONS }`}</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-3 -left-2 sm:-left-4 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono font-semibold text-cyan-400 shadow-xl flex items-center space-x-1.5 z-20"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>LAT 13.35° N // RMKEC</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-3 -right-2 sm:-right-4 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono font-semibold text-emerald-400 shadow-xl flex items-center space-x-1.5 z-20"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>TOP 6 ADVANCE</span>
              </motion.div>

              {/* Centerpiece: Authoritative College Crest Logo Asset Display */}
              <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5">
                <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl flex items-center justify-center group transition-transform duration-300 hover:scale-[1.02]">
                  <RmkLogo className="h-32 sm:h-44 w-auto drop-shadow-md" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
                    R.M.K. Engineering College
                  </h3>
                  <p className="text-xs text-slate-400 font-sans max-w-xs leading-normal">
                    Autonomous Institution · Anna University Affiliated · NAAC A+ Grade &amp; NBA Accredited
                  </p>
                  <div className="pt-1 font-mono text-[11px] text-blue-400 font-semibold tracking-wider uppercase">
                    IEEE STUDENT BRANCH STB61871
                  </div>
                </div>
              </div>

            </motion.div>

          </div>

        </section>

        {/* ============================================================== */}
        {/* --- SECTION 2: EXAMINATION RULES & FORMAT GRID --- */}
        {/* ============================================================== */}
        <section id="rules-section" className="space-y-8 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-blue-400 font-semibold block">
                COMPETITION BLUEPRINT
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
                Rules &amp; Examination Protocol
              </h2>
            </div>
            <div className="font-mono text-xs text-slate-400">
              ROUND // 01 PRELIMINARY
            </div>
          </div>

          {/* Spacious 4-Card Format Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Rule 1: 10s Per Question */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <div className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
                10 SEC / QUESTION
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Strict 10s One-Way Timer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Questions appear once in strict order. Answers auto-advance on expiration with no backtracking.
              </p>
            </motion.div>

            {/* Rule 2: AI Restriction */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <div className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider">
                AI RESTRICTED
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Automated Proctoring
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tab switching or using external AI tools triggers a warning. Second violation = instant disqualification.
              </p>
            </motion.div>

            {/* Rule 3: 15 Questions */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                15 QUESTIONS
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Core Computing MCQs
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard scoring (1 point per correct answer). No negative marks. Speed decides tiebreakers.
              </p>
            </motion.div>

            {/* Rule 4: Top 6 Qualify */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                04
              </div>
              <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                TOP 6 TEAMS
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                Advance to Finals
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The top 6 highest-scoring teams qualify for the live grand finale stage at RMKEC Auditorium.
              </p>
            </motion.div>

          </div>

        </section>

        {/* ============================================================== */}
        {/* --- SECTION 3: TECHNICAL SYLLABUS & CURATED DOMAINS --- */}
        {/* ============================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold block">
                TECHNICAL SYLLABUS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
                Core Domains Tested
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Click any domain below to inspect sample topics and conceptual areas covered in Round 1.
            </p>
          </div>

          <InteractiveSubjectCard />
        </section>

        {/* ============================================================== */}
        {/* --- SECTION 4: SPACIOUS TEAM REGISTRATION --- */}
        {/* ============================================================== */}
        <section id="registration-section" className="space-y-8 scroll-mt-24">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-blue-400 font-semibold block">
                QUALIFIER GATEWAY
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
                Ready, Team?
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ENTER YOUR DETAILS TO INITIATE EXAMINATION SESSION
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Form Column (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl">
              
              <div className="space-y-2">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Team Registration
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Enter your details below. Each team consists of 2 members. Once launched, the 10-second per-question countdown begins immediately.
                </p>
              </div>

              {formError && (
                <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-mono">
                  {formError}
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl font-mono">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Team Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    TEAM NAME *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Quantum Bytes / Team Matrix"
                    className="w-full h-13 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* 2. Team Leader (Member 1) & Member 2 in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                      TEAM LEADER (MEMBER 1) *
                    </label>
                    <input
                      type="text"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      placeholder="e.g. Karthik Raja"
                      className="w-full h-13 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                      TEAM MEMBER 2 *
                    </label>
                    <input
                      type="text"
                      value={member2Name}
                      onChange={(e) => setMember2Name(e.target.value)}
                      placeholder="e.g. Vignesh S"
                      className="w-full h-13 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 3. College / Institution */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                    COLLEGE / INSTITUTION *
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. R.M.K. Engineering College"
                    className="w-full h-13 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 font-sans text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Submit CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLoading ? "INITIALIZING SESSION..." : "START QUALIFIER QUIZ"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-center text-slate-500 pt-1">
                  15 QUESTIONS · 10 SECONDS PER CHALLENGE · ANTI-AI PROCTORING ACTIVE
                </div>

              </form>

            </div>

            {/* Right Information Column (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Live Participation Counter Widget */}
              <LiveParticipantCounter />

              {/* Event Hosts & Faculty Advisory Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 font-mono text-xs text-blue-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>ORGANIZING COMMITTEE</span>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-500 block text-[10px] font-mono uppercase">CONVENOR &amp; ADVISOR</span>
                    <h4 className="text-white font-semibold text-sm">Dr. R. Poornima</h4>
                    <p className="text-slate-400 text-[11px]">Associate Professor · Dept. of IT · IEEE CS Student Advisor</p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3">
                    <span className="text-slate-500 block text-[10px] font-mono uppercase">STUDENT CHAIR</span>
                    <h4 className="text-white font-semibold text-sm">Seshwar B</h4>
                    <p className="text-slate-400 text-[11px]">Vice Chair · IEEE Student Branch (STB61871)</p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3">
                    <span className="text-slate-500 block text-[10px] font-mono uppercase">VENUE &amp; FINALS STAGE</span>
                    <p className="text-slate-300 text-xs mt-0.5">
                      R.M.K. Engineering College Auditorium &amp; IT Computing Lab
                    </p>
                  </div>
                </div>

              </div>

              {/* Proctoring Reminder Notice */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 space-y-2 font-mono">
                <div className="text-rose-400 font-bold flex items-center space-x-1.5 text-[11px]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>STRICT COMPETITION WARNING:</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Navigating away from the quiz tab or using external AI assistants is detected automatically. Strike 1 issues a warning; Strike 2 leads to instant disqualification.
                </p>
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

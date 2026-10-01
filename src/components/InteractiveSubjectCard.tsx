import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Cpu, Database, Binary, Zap, Bot, Brain } from 'lucide-react';

interface SubjectInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  badge: string;
  sampleTopic: string;
}

export const InteractiveSubjectCard: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>('ds');

  const subjects: SubjectInfo[] = [
    {
      id: 'alg',
      name: 'Algorithms',
      icon: Binary,
      description: 'Efficiency, Big-O notation, sorting, searching, recursion, and dynamic programming fundamentals.',
      badge: 'TIME & SPACE COMPLEXITY',
      sampleTopic: 'QuickSort, MergeSort, Binary Search',
    },
    {
      id: 'ds',
      name: 'Data Structures',
      icon: Database,
      description: 'Arrays, Stacks, Queues, Linked Lists, Trees, Graphs, and Hash Tables memory operations.',
      badge: 'LIFO & FIFO CONCEPTS',
      sampleTopic: 'Stack Push/Pop, Queue Enqueue/Dequeue',
    },
    {
      id: 'circuits',
      name: 'Circuits',
      icon: Zap,
      description: 'Digital logic gates (AND, OR, XOR, NOT), Boolean algebra, flip-flops, and combinational circuits.',
      badge: 'LOGIC GATES & BOOLEAN ALGEBRA',
      sampleTopic: 'XOR Truth Tables, Karnaugh Maps',
    },
    {
      id: 'prog',
      name: 'Programming',
      icon: Code,
      description: 'Syntax, control flow, functions, loops, and OOP pillars (Encapsulation, Inheritance, Polymorphism).',
      badge: 'PYTHON & C++ FUNDAMENTALS',
      sampleTopic: 'Scope, Recursion, Object Blueprinting',
    },
    {
      id: 'robotics',
      name: 'Robotics',
      icon: Bot,
      description: 'Sensors, microcontrollers, motor drivers, feedback loops, and basic automation logic.',
      badge: 'AUTOMATION & ACTUATORS',
      sampleTopic: 'PWM Control, Sensor Interfaces',
    },
    {
      id: 'aiml',
      name: 'AI & ML',
      icon: Brain,
      description: 'Machine learning fundamentals, neural networks, feature vectors, supervised vs unsupervised learning.',
      badge: 'INTELLIGENT SYSTEMS',
      sampleTopic: 'Neural Nodes, Model Training Concepts',
    },
    {
      id: 'embedded',
      name: 'Embedded Systems',
      icon: Cpu,
      description: 'Microprocessors (Arduino, Raspberry Pi), GPIO pins, interrupts, and real-time computing.',
      badge: 'HARDWARE INTERFACING',
      sampleTopic: 'GPIO Control, Serial Communication',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 font-sans text-xs">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider block">TECHNICAL DOMAIN EXPLORER</span>
          <h3 className="text-sm font-semibold text-white font-sans mt-0.5">Core Syllabus Subjects</h3>
        </div>
        <span className="font-mono text-xs text-blue-400">
          7 Domains
        </span>
      </div>

      {/* Grid of Subject Interactive Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {subjects.map((s) => {
          const Icon = s.icon;
          const isSelected = selectedSubject === s.id;

          return (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white font-semibold'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] truncate w-full">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Expandable Subject Details */}
      <AnimatePresence mode="wait">
        {selectedSubject && (
          <motion.div
            key={selectedSubject}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 text-slate-300 text-xs"
          >
            {(() => {
              const active = subjects.find((s) => s.id === selectedSubject);
              if (!active) return null;

              return (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-white text-sm">
                      {active.name} <span className="text-slate-600">·</span> <span className="font-mono text-xs text-blue-400 font-normal">{active.badge}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
                      {active.description}
                    </p>
                  </div>

                  <div className="font-mono text-xs text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4 shrink-0">
                    <span className="text-[10px] uppercase text-slate-500 block">KEY CONCEPTS</span>
                    <span className="text-slate-200 font-medium">{active.sampleTopic}</span>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

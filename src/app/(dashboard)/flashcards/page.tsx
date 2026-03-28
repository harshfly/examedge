'use client';

import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import { Filter, RotateCw, Check, X, Info } from "lucide-react";
import { useDataStore } from "@/store/useDataStore";
import { useSemesterContext } from "@/hooks/useSemesterContext";
import ComingSoon from "@/components/ui/ComingSoon";
import Link from "next/link";

export default function FlashcardsEngine() {
  const { flashcards } = useDataStore();
  const { semesterSubjects, isLive, semRoman } = useSemesterContext();
  const [deckActive, setDeckActive] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | 'all'>('all');

  // Reset progress when switching subjects
  useEffect(() => {
    setCurrentCard(0);
    setIsFlipped(false);
  }, [selectedSubjectId]);

  const semFlashcards = flashcards.filter(f => semesterSubjects.some(s => s.id === f.subjectId));
  const cards = selectedSubjectId === 'all' 
    ? semFlashcards 
    : semFlashcards.filter(card => card.subjectId === selectedSubjectId);

  const currentSubject = semesterSubjects.find(s => s.id === (cards[currentCard]?.subjectId || (selectedSubjectId !== 'all' ? selectedSubjectId : ''))) || semesterSubjects[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (rating: 'easy' | 'medium' | 'hard') => {
    // In real app, calculate Spaced Repetition (SuperMemo-2 algorithm)
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    } else {
      alert("Deck Complete!");
      setDeckActive(false);
      setCurrentCard(0);
      setIsFlipped(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-base)]">
      <Navbar />
      {!isLive ? <ComingSoon /> : (
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        {!deckActive && (
          <div className="hidden md:block w-[260px] flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] p-5 overflow-y-auto">
            <h3 className="text-[14px] font-bold mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Decks</h3>
            <div className="mb-6 space-y-2">
              <button 
                type="button"
                onClick={() => setSelectedSubjectId('all')}
                className={`w-full text-left px-4 py-3 rounded-[var(--r-md)] border text-[13px] transition-all flex items-center justify-between
                  ${selectedSubjectId === 'all' ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-white shadow-lg' : 'border-[var(--border)] bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'}
                `}
              >
                <span>All Subjects</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--glass-light)] font-bold">{semFlashcards.length}</span>
              </button>
              {semesterSubjects.map(sub => {
                const subCount = semFlashcards.filter(f => f.subjectId === sub.id).length;
                return (
                  <button 
                    key={sub.id} 
                    type="button"
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`w-full text-left px-4 py-3 rounded-[var(--r-md)] border text-[13px] transition-all flex items-center justify-between group
                      ${selectedSubjectId === sub.id ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-white shadow-lg' : 'border-[var(--border)] bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }}></span>
                      {sub.name}
                    </div>
                    {subCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                        ${selectedSubjectId === sub.id ? 'bg-white text-[var(--accent)]' : 'bg-[var(--glass-light)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}
                      `}>
                        {subCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Interface */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8 relative">
          
          {cards.length === 0 ? (
            <div className="text-center max-w-[400px]">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-overlay)] border border-[var(--border)] flex items-center justify-center text-[24px] mx-auto mb-6">
                📭
              </div>
              <h2 className="text-[20px] font-bold mb-2 text-[var(--text-primary)]">No Flashcards Yet</h2>
              <p className="text-[14px] text-[var(--text-secondary)] mb-8">
                {selectedSubjectId === 'all' 
                  ? "There are no flashcards in the database. Go to the Admin Panel to add some!" 
                  : `No flashcards have been added for ${currentSubject?.name || 'this subject'} yet.`}
              </p>
              <Link href="/admin/flashcards" className="btn-secondary text-[13px]">
                Add Flashcards
              </Link>
            </div>
          ) : !deckActive ? (
            <div className="text-center max-w-[500px]">
              <div className="w-20 h-20 rounded-[20px] bg-[#6c63ff20] border border-[#6c63ff50] flex items-center justify-center text-[32px] mx-auto mb-6 transform rotate-3">
                🃏
              </div>
              <h1 className="h1 mb-2">Spaced Repetition</h1>
              <p className="body-lg text-[var(--text-secondary)] mb-8">Master concepts using active recall algorithms optimized for long-term retention.</p>
              
              <div className="bg-[var(--bg-overlay)] border border-[var(--border)] rounded-[var(--r-lg)] p-6 mb-8 text-left flex gap-4">
                <Info className="w-6 h-6 text-[#38bdf8] flex-shrink-0" />
                <div className="text-[13px] text-[var(--text-primary)]">
                  You have <strong className="text-white">{cards.length} cards</strong> {selectedSubjectId === 'all' ? 'available' : `due for review today in ${currentSubject?.name}`}. Reviewing them will improve your memory decay curve.
                </div>
              </div>

              <button 
                onClick={() => setDeckActive(true)} 
                disabled={cards.length === 0}
                className="btn-primary min-w-[200px] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Review Session
              </button>
            </div>
          ) : (
            <div className="w-full max-w-[600px] flex flex-col items-center">
              
              <div className="w-full flex justify-between text-[12px] text-[var(--text-muted)] font-bold mb-6">
                <span>CARD {currentCard + 1} OF {cards.length}</span>
                <button onClick={() => setDeckActive(false)} className="hover:text-[var(--text-primary)] hover:underline">Exit Deck</button>
              </div>

              {/* FLIP CARD IMPLEMENTATION */}
              <div 
                className="w-full h-[350px] md:h-[400px] perspective-1000 mb-8 cursor-pointer"
                onClick={handleFlip}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* FRONT */}
                  <div className={`absolute inset-0 backface-hidden bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-[var(--border)] rounded-[var(--r-2xl)] p-10 flex flex-col items-center justify-center shadow-[var(--shadow-lg)] group hover:border-[#6c63ff50]`}>
                    <div className="absolute top-5 right-5 text-[10px] font-bold px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]">FRONT</div>
                    <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-6 border border-current" style={{ color: currentSubject?.color || '#6c63ff', backgroundColor: `${currentSubject?.color || '#6c63ff'}15` }}>
                      {currentSubject?.shortName || 'SUB'}
                    </div>
                    <h2 className="text-[24px] font-['Syne'] font-extrabold text-center leading-tight">
                      {cards[currentCard]?.front || 'No Card Selected'}
                    </h2>
                    <div className="absolute bottom-6 text-[12px] text-[var(--text-muted)] flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <RotateCw className="w-3.5 h-3.5" /> Click to reveal
                    </div>
                  </div>

                  {/* BACK */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#1a1a2e] to-[#121220] border border-[#6c63ff50] rounded-[var(--r-2xl)] p-10 flex flex-col shadow-[var(--shadow-accent)]`}>
                    <div className="absolute top-5 right-5 text-[10px] font-bold px-2 py-1 rounded bg-[#6c63ff20] text-[#6c63ff]">BACK</div>
                    <h3 className="text-[13px] font-bold text-[var(--text-muted)] mb-4 border-b border-[rgba(255,255,255,0.1)] pb-3">Answer:</h3>
                    
                    <div className="text-[16px] leading-[1.8] text-[#e0e0f0] whitespace-pre-line flex-1 overflow-y-auto pr-2">
                      {cards[currentCard]?.back || 'No Answer'}
                    </div>
                  </div>

                </div>
              </div>

              {/* RATE DIFFICULTY (Only shows if flipped) */}
              <div className={`w-full flex flex-col md:flex-row gap-3 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <button onClick={() => handleDifficulty('hard')} className="flex-1 bg-[var(--bg-overlay)] border border-[var(--border)] hover:border-[#f43f5e] hover:bg-[#f43f5e10] p-3 rounded-xl flex flex-row md:flex-col items-center justify-center gap-3 md:gap-1 transition-colors">
                  <span className="text-[13px] font-bold text-[#f43f5e]">Hard</span>
                  <span className="text-[10px] text-[var(--text-muted)]">1 min</span>
                </button>
                <button onClick={() => handleDifficulty('medium')} className="flex-1 bg-[var(--bg-overlay)] border border-[var(--border)] hover:border-[#f59e0b] hover:bg-[#f59e0b10] p-3 rounded-xl flex flex-row md:flex-col items-center justify-center gap-3 md:gap-1 transition-colors">
                  <span className="text-[13px] font-bold text-[#f59e0b]">Good</span>
                  <span className="text-[10px] text-[var(--text-muted)]">10 mins</span>
                </button>
                <button onClick={() => handleDifficulty('easy')} className="flex-1 bg-[var(--bg-overlay)] border border-[var(--border)] hover:border-[#10b981] hover:bg-[#10b98110] p-3 rounded-xl flex flex-row md:flex-col items-center justify-center gap-3 md:gap-1 transition-colors">
                  <span className="text-[13px] font-bold text-[#10b981]">Easy</span>
                  <span className="text-[10px] text-[var(--text-muted)]">4 days</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
      )}
    </div>
  );
}

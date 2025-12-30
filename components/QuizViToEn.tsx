import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Flashcard } from '../types';
import Header from './common/Header';

const CHUNK_SIZE = 10;

// FIX: Made the function specific to Flashcard[] to resolve a type inference issue in the TSX compiler.
function shuffleArray(array: Flashcard[]): Flashcard[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const normalizeAnswer = (word: string) => {
    return word.split('(')[0].trim().toLowerCase().replace(/[.,!?;:"'-]/g, '');
};

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const QuizViToEn: React.FC<{ vocabulary: Flashcard[]; onBackToMenu: () => void }> = ({ vocabulary, onBackToMenu }) => {
  // Session State
  const [chunks, setChunks] = useState<Flashcard[][]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [queue, setQueue] = useState<Flashcard[]>([]); // Current round queue
  
  // Current Card State
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<'INPUT' | 'FEEDBACK_CORRECT' | 'REWRITE'>('INPUT');
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const currentCard = queue.length > 0 ? queue[0] : null;

  const speak = useCallback((word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const wordToSpeak = word.split('(')[0].trim();
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Initialize Quiz
  useEffect(() => {
    const shuffled = shuffleArray(vocabulary);
    const chunked: Flashcard[][] = [];
    for(let i=0; i<shuffled.length; i+=CHUNK_SIZE) {
        chunked.push(shuffled.slice(i, i+CHUNK_SIZE));
    }
    setChunks(chunked);
    if (chunked.length > 0) {
        setQueue(chunked[0]);
        setCurrentChunkIndex(0);
        setPhase('INPUT');
    } else {
        setIsFinished(true);
    }
  }, [vocabulary]);

  // Auto-focus input when phase or card changes
  useEffect(() => {
      if (inputRef.current) {
          inputRef.current.focus();
      }
  }, [phase, currentCard]);

  const handleInputSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentCard) return;

      const cleanInput = normalizeAnswer(userInput);
      const cleanTarget = normalizeAnswer(currentCard.word);

      if (cleanInput === cleanTarget) {
          // Correct on first try
          speak(currentCard.word);
          setPhase('FEEDBACK_CORRECT');
      } else {
          // Incorrect -> Force Rewrite
          speak(currentCard.word);
          setPhase('REWRITE');
          setUserInput(''); // Clear for rewrite
      }
  };

  const handleRewriteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentCard) return;

      const cleanInput = normalizeAnswer(userInput);
      const cleanTarget = normalizeAnswer(currentCard.word);

      if (cleanInput === cleanTarget) {
          // Correctly Rewritten -> Push to back of queue to review later
          const failedCard = queue[0];
          // Remove from head, add to tail
          setQueue(prev => [...prev.slice(1), failedCard]);
          
          // Reset for next card
          setPhase('INPUT');
          setUserInput('');
      } else {
          // Visual shake effect or alert could go here
          // For now, simple alert
          alert('Chưa chính xác. Hãy gõ lại đúng chính tả từng ký tự.');
      }
  };

  const handleNextCorrect = () => {
      // Remove current card from queue (Success)
      const newQueue = queue.slice(1);
      
      if (newQueue.length === 0) {
          // Chunk finished
          if (currentChunkIndex < chunks.length - 1) {
              const nextIndex = currentChunkIndex + 1;
              setCurrentChunkIndex(nextIndex);
              setQueue(chunks[nextIndex]);
          } else {
              setIsFinished(true);
          }
      } else {
          setQueue(newQueue);
      }
      
      setPhase('INPUT');
      setUserInput('');
  };

  const restartQuiz = () => {
    const shuffled = shuffleArray(vocabulary);
    const chunked: Flashcard[][] = [];
    for(let i=0; i<shuffled.length; i+=CHUNK_SIZE) {
        chunked.push(shuffled.slice(i, i+CHUNK_SIZE));
    }
    setChunks(chunked);
    setQueue(chunked[0]);
    setCurrentChunkIndex(0);
    setPhase('INPUT');
    setIsFinished(false);
    setUserInput('');
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center text-center">
        <Header title="Kết quả Quiz" onBackToMenu={onBackToMenu} />
        <div className="p-8 bg-white rounded-xl shadow-lg animate-fade-in-up">
          <h2 className="text-3xl font-bold text-slate-700">Tuyệt vời!</h2>
          <p className="text-xl text-slate-500 mt-4">Bạn đã thuộc hết tất cả các từ trong danh sách.</p>
          <div className="mt-8 text-6xl">🎉</div>
          <div className="flex gap-4 mt-8">
            <button onClick={restartQuiz} className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors">
              Học lại
            </button>
            <button onClick={onBackToMenu} className="px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
              Menu Chính
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col items-center w-full pb-12">
      <Header title="Quiz: Nghĩa sang Từ" onBackToMenu={onBackToMenu} />
      
      <div className="w-full max-w-lg px-4">
         {/* Progress Info */}
        <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
             <span>Vòng {currentChunkIndex + 1} / {chunks.length}</span>
             <span>Hàng chờ: {queue.length} từ</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
            <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.max(5, ((CHUNK_SIZE - queue.length) / CHUNK_SIZE) * 100)}%` }}
            ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg text-center mb-8">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Nghĩa tiếng Việt</p>
            <p className="text-3xl md:text-4xl font-bold text-slate-800 animate-fade-in">{currentCard.meaning}</p>
        </div>

        {/* Interaction Area */}
        {phase === 'INPUT' && (
             <form onSubmit={handleInputSubmit} className="w-full">
                <input 
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Gõ từ tiếng Anh..."
                  className="w-full text-center text-2xl p-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all bg-white text-slate-800 placeholder-slate-400 font-medium"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                />
                <button type="submit" className="mt-4 w-full py-4 bg-amber-500 text-white font-bold rounded-xl shadow-md hover:bg-amber-600 transition-colors text-xl">
                  Kiểm tra
                </button>
            </form>
        )}

        {phase === 'FEEDBACK_CORRECT' && (
            <div className="w-full animate-fade-in-up">
                <div className="p-6 bg-emerald-100 text-emerald-800 rounded-xl text-center mb-4 border border-emerald-200 shadow-sm">
                    <p className="font-bold text-2xl mb-2">Chính xác! 🎉</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xl font-semibold">{currentCard.word}</span>
                        <button 
                            onClick={() => speak(currentCard.word)}
                            className="p-1 rounded-full hover:bg-emerald-200 transition-colors"
                        >
                            <SpeakerIcon className="text-emerald-700 h-6 w-6" />
                        </button>
                    </div>
                </div>
                <button 
                    onClick={handleNextCorrect} 
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors text-xl focus:outline-none focus:ring-4 focus:ring-emerald-300"
                    ref={(btn) => btn?.focus()}
                >
                    Tiếp tục
                </button>
            </div>
        )}

        {phase === 'REWRITE' && (
            <div className="w-full animate-fade-in-up">
                 <div className="p-6 bg-red-50 text-red-800 rounded-xl text-center mb-6 border border-red-200 shadow-sm">
                    <p className="font-bold text-xl mb-2">Chưa chính xác</p>
                    <p className="text-sm text-slate-500 mb-1">Đáp án đúng là:</p> 
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold text-red-600 tracking-wide">{currentCard.word}</span>
                        <button 
                            onClick={() => speak(currentCard.word)}
                            className="p-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                            <SpeakerIcon className="text-red-600 h-6 w-6" />
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{currentCard.pronunciation}</p>
                </div>

                <form onSubmit={handleRewriteSubmit}>
                    <p className="text-slate-600 mb-2 font-medium ml-1">Hãy gõ lại từ đúng để ghi nhớ:</p>
                    <input 
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Gõ lại từ đúng ở đây..."
                      className="w-full text-center text-xl p-4 border-2 border-red-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all bg-white text-slate-800 placeholder-slate-400"
                      autoCapitalize="none"
                      autoComplete="off"
                    />
                     <button type="submit" className="mt-4 w-full py-4 bg-slate-700 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-colors text-lg">
                      Kiểm tra & Học lại sau
                    </button>
                </form>
            </div>
        )}

      </div>
    </div>
  );
};

export default QuizViToEn;


import React from 'react';
import { GameMode } from '../types';
import Header from './common/Header';

interface VocabularyMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const QuestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const KeyboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h4a2 2 0 002-2M8 5a2 2 0 012-2h4a2 2 0 012 2m-8 5h.01M12 10h.01M16 10h.01M9 16H8v-2h1v2zm2 0h-1v-2h1v2zm2 0h-1v-2h1v2zm2 0h-1v-2h1v2z" /></svg>
);

const VocabularyMenu: React.FC<VocabularyMenuProps> = ({ onSelectMode, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title="Từ Vựng" onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <div className="grid grid-cols-1 gap-6 w-full">
          <button
            onClick={() => onSelectMode(GameMode.FLASHCARD_MENU)}
            className="flex items-center justify-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-sky-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <BookIcon />
            <div>
              <h2 className="text-xl font-semibold text-sky-600">Flashcards</h2>
              <p className="text-slate-500">Học từ mới và ý nghĩa.</p>
            </div>
          </button>
          <button
            onClick={() => onSelectMode(GameMode.QUIZ_EN_TO_VI)}
            className="flex items-center justify-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <QuestionIcon />
            <div>
              <h2 className="text-xl font-semibold text-emerald-600">Quiz: Từ sang Nghĩa</h2>
              <p className="text-slate-500">Chọn nghĩa tiếng Việt đúng.</p>
            </div>
          </button>
          <button
            onClick={() => onSelectMode(GameMode.QUIZ_VI_TO_EN)}
            className="flex items-center justify-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-amber-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <KeyboardIcon />
            <div>
              <h2 className="text-xl font-semibold text-amber-600">Quiz: Nghĩa sang Từ</h2>
              <p className="text-slate-500">Gõ từ tiếng Anh tương ứng.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocabularyMenu;

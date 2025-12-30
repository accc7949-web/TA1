

import React from 'react';
import { GameMode } from '../types';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);


const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-700">English Learning Hub</h1>
        <p className="text-lg text-slate-500 mt-2">Chọn kỹ năng bạn muốn ôn tập</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button
          // FIX: GameMode.VOCABULARY_MENU does not exist. The vocabulary learning flow now starts with classroom selection.
          onClick={() => onSelectMode(GameMode.CLASSROOM_SELECTION)}
          className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:bg-sky-50 transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-sky-200"
        >
          <BookIcon />
          <h2 className="text-3xl font-bold text-slate-700">Từ Vựng</h2>
          <p className="text-slate-500 mt-2 text-center">Flashcards, Trắc nghiệm từ & nghĩa</p>
        </button>

        <button
          onClick={() => onSelectMode(GameMode.GRAMMAR_DASHBOARD)}
          className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200"
        >
          <PencilIcon />
          <h2 className="text-3xl font-bold text-slate-700">Ngữ Pháp</h2>
          <p className="text-slate-500 mt-2 text-center">Lý thuyết & Bài tập AI</p>
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
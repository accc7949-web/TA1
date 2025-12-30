
import React from 'react';
import { GameMode } from '../types';
import Header from './common/Header';

interface GrammarDashboardProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const AcademicCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
);

const GrammarDashboard: React.FC<GrammarDashboardProps> = ({ onSelectMode, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title="Ngữ Pháp & Luyện thi" onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <div className="grid grid-cols-1 gap-6 w-full">
          <button
            onClick={() => onSelectMode(GameMode.GRAMMAR_THEORY_SELECTION)}
            className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <BookOpenIcon />
            <div>
              <h2 className="text-xl font-semibold text-indigo-700">Ôn tập Lý thuyết</h2>
              <p className="text-slate-500">Cơ bản & Nâng cao theo chuyên đề.</p>
            </div>
          </button>
          
          <button
            onClick={() => onSelectMode(GameMode.GRAMMAR_PRACTICE_SELECTION)}
            className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-pink-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <BrainIcon />
            <div>
              <h2 className="text-xl font-semibold text-pink-700">Bài tập Ngữ pháp (AI)</h2>
              <p className="text-slate-500">Trắc nghiệm ngắn theo từng chủ điểm.</p>
            </div>
          </button>

          <button
            onClick={() => onSelectMode(GameMode.EXAM_PREP_MENU)}
            className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1 border-2 border-orange-100"
          >
            <AcademicCapIcon />
            <div>
              <h2 className="text-xl font-semibold text-orange-700">Luyện thi TN THPT 2025</h2>
              <p className="text-slate-500">Đọc điền, Sắp xếp câu, Đọc hiểu (Format mới).</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrammarDashboard;

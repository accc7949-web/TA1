



import React from 'react';
import { GameMode } from '../types';
import Header from './common/Header';

interface FlashcardMenuProps {
  setGameMode: (mode: GameMode) => void;
  onBackToMenu: () => void;
}

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const QuestionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const KeyboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h4a2 2 0 002-2M8 5a2 2 0 012-2h4a2 2 0 012 2m-8 5h.01M12 10h.01M16 10h.01M9 16H8v-2h1v2zm2 0h-1v-2h1v2zm2 0h-1v-2h1v2zm2 0h-1v-2h1v2z" /></svg>
);

const SentenceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);


const FlashcardMenu: React.FC<FlashcardMenuProps> = ({ setGameMode, onBackToMenu }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title="Học Từ Vựng" onBackToMenu={onBackToMenu} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-lg pb-16">
        <div className="w-full space-y-4">
            <button
                onClick={() => setGameMode(GameMode.FLASHCARDS)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-sky-50 transition-all duration-300 transform hover:-translate-y-1 w-full"
            >
                <BookOpenIcon />
                <div>
                    <h2 className="text-xl font-semibold text-sky-600">Học Flashcards</h2>
                    <p className="text-slate-500 text-sm">Học theo các lượt để ghi nhớ.</p>
                </div>
            </button>

            <button
                onClick={() => setGameMode(GameMode.VOCAB_SENTENCE_PRACTICE)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-teal-50 transition-all duration-300 transform hover:-translate-y-1 w-full"
            >
                <SentenceIcon />
                <div>
                    <h2 className="text-xl font-semibold text-teal-600">Luyện Đặt Câu</h2>
                    <p className="text-slate-500 text-sm">Dịch câu Việt-Anh dùng từ đã học.</p>
                </div>
            </button>
            
            <button
                onClick={() => setGameMode(GameMode.FLASHCARD_VIEW_ALL)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 w-full"
            >
                <EyeIcon />
                <div>
                    <h2 className="text-xl font-semibold text-indigo-600">Xem toàn bộ</h2>
                    <p className="text-slate-500 text-sm">Lướt qua danh sách tất cả các từ.</p>
                </div>
            </button>
            
            <div className="relative text-center my-2">
                <hr className="border-slate-200" />
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-50 px-2 text-sm text-slate-400 font-medium">Trắc nghiệm</span>
            </div>

            <button
                onClick={() => setGameMode(GameMode.QUIZ_EN_TO_VI)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 w-full"
            >
                <QuestionIcon />
                <div>
                    <h2 className="text-xl font-semibold text-emerald-600">Quiz (Anh → Việt)</h2>
                    <p className="text-slate-500 text-sm">Chọn nghĩa tiếng Việt đúng.</p>
                </div>
            </button>

            <button
                onClick={() => setGameMode(GameMode.QUIZ_VI_TO_EN)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-amber-50 transition-all duration-300 transform hover:-translate-y-1 w-full"
            >
                <KeyboardIcon />
                <div>
                    <h2 className="text-xl font-semibold text-amber-600">Quiz (Việt → Anh)</h2>
                    <p className="text-slate-500 text-sm">Gõ từ tiếng Anh tương ứng.</p>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMenu;
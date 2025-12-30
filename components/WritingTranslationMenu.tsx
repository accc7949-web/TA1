
import React from 'react';
import { GameMode } from '../types';
import Header from './common/Header';

interface WritingTranslationMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

const TranslateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
);

const PencilAltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const WritingTranslationMenu: React.FC<WritingTranslationMenuProps> = ({ onSelectMode, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title="Luyện Viết & Dịch" onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-2xl pb-16 px-4">
        
        <p className="text-slate-500 mb-8 text-center max-w-lg">
            Nâng cao kỹ năng bằng cách áp dụng từ vựng vào ngữ cảnh thực tế. AI sẽ chấm điểm và sửa lỗi cho bạn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Luyện Dịch */}
            <button 
                onClick={() => onSelectMode(GameMode.TRANSLATION_PRACTICE)}
                className="flex flex-col p-6 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-cyan-200 hover:bg-cyan-50 transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="flex items-center mb-4">
                    <div className="bg-cyan-100 p-3 rounded-full">
                        <TranslateIcon />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-cyan-800 mb-2">Luyện Dịch (Anh → Việt)</h3>
                <p className="text-slate-600 text-sm">
                    AI tạo đoạn văn tiếng Anh theo chủ đề hoặc Flashcards của bạn. Nhiệm vụ của bạn là dịch sát nghĩa sang tiếng Việt.
                </p>
            </button>

            {/* Luyện Viết */}
            <button 
                onClick={() => onSelectMode(GameMode.WRITING_PRACTICE)}
                className="flex flex-col p-6 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="flex items-center mb-4">
                     <div className="bg-emerald-100 p-3 rounded-full">
                        <PencilAltIcon />
                     </div>
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">Luyện Viết</h3>
                <p className="text-slate-600 text-sm">
                    3 chế độ: Viết đoạn văn, Dịch (Việt → Anh), hoặc Điền từ vào chỗ trống. AI sẽ sửa ngữ pháp và gợi ý từ vựng hay.
                </p>
            </button>
        </div>
      </div>
    </div>
  );
};

export default WritingTranslationMenu;

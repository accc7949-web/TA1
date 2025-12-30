
import React, { useState } from 'react';
import { DifficultyLevel, PracticeType } from '../types';
import Header from './common/Header';

interface GrammarDifficultySelectionProps {
  onSelectParams: (level: DifficultyLevel, count: number, type: PracticeType) => void;
  onBack: () => void;
  topicTitle: string;
}

const StarIcon = ({ filled, colorClass = "text-yellow-400" }: { filled: boolean, colorClass?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${filled ? colorClass : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

const GrammarDifficultySelection: React.FC<GrammarDifficultySelectionProps> = ({ onSelectParams, onBack, topicTitle }) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [practiceType, setPracticeType] = useState<PracticeType>('MULTIPLE_CHOICE');

  const handleLevelSelect = (level: DifficultyLevel) => {
      onSelectParams(level, questionCount, practiceType);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title="Thiết lập luyện tập" onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16 px-4">
        <h2 className="text-xl text-slate-600 mb-2 text-center">Chủ đề: <span className="font-bold text-blue-600">{topicTitle}</span></h2>
        
        {/* Chọn loại bài tập */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-md mb-6 border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 text-center">1. Chọn dạng bài tập</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    onClick={() => setPracticeType('MULTIPLE_CHOICE')}
                    className={`p-3 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-2 ${practiceType === 'MULTIPLE_CHOICE' ? 'bg-blue-50 text-blue-700 border-blue-500 shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}
                >
                    <CheckIcon />
                    <span className="text-xs">Trắc nghiệm</span>
                </button>
                <button
                    onClick={() => setPracticeType('ERROR_CORRECTION')}
                    className={`p-3 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-2 ${practiceType === 'ERROR_CORRECTION' ? 'bg-red-50 text-red-700 border-red-500 shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:border-red-200'}`}
                >
                    <SearchIcon />
                    <span className="text-xs">Tìm lỗi sai</span>
                </button>
                <button
                    onClick={() => setPracticeType('EXPLAIN_DIFFERENCE')}
                    className={`p-3 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-2 ${practiceType === 'EXPLAIN_DIFFERENCE' ? 'bg-purple-50 text-purple-700 border-purple-500 shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:border-purple-200'}`}
                >
                    <BulbIcon />
                    <span className="text-xs">Tư duy Ngữ cảnh</span>
                </button>
            </div>
             <p className="text-xs text-slate-400 mt-3 text-center italic min-h-[2.5em]">
                {practiceType === 'MULTIPLE_CHOICE' 
                    ? "Chọn đáp án đúng (A, B, C, D) để hoàn thành câu." 
                    : practiceType === 'ERROR_CORRECTION'
                        ? "Click vào từ bị sai trong câu và sửa lại cho đúng."
                        : "Chọn câu phù hợp với tình huống thực tế (Reality Check)."}
            </p>
        </div>

        {/* Chọn số lượng câu hỏi */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-md mb-8 border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 text-center">2. Số lượng câu hỏi</h3>
            <div className="flex gap-3">
                {[5, 10, 15].map(count => (
                    <button
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${questionCount === count ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}
                    >
                        {count} câu
                    </button>
                ))}
            </div>
        </div>

        <h3 className="font-bold text-slate-700 mb-4">3. Chọn trình độ</h3>
        <div className="grid grid-cols-1 gap-4 w-full">
          
          {/* VERY EASY */}
          <button
            onClick={() => handleLevelSelect('Very Easy')}
            className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-green-50 border-2 border-transparent hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex mb-1">
                <StarIcon filled={true} colorClass="text-green-500" />
                <StarIcon filled={false} />
                <StarIcon filled={false} />
                <StarIcon filled={false} />
            </div>
            <h3 className="text-lg font-bold text-green-600">Rất Dễ (Very Easy)</h3>
            <p className="text-slate-500 text-xs text-center mt-1">Câu đơn, dấu hiệu rõ ràng (A1).</p>
          </button>

          {/* EASY */}
          <button
            onClick={() => handleLevelSelect('Easy')}
            className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-teal-50 border-2 border-transparent hover:border-teal-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex mb-1">
                <StarIcon filled={true} colorClass="text-teal-500" />
                <StarIcon filled={true} colorClass="text-teal-500" />
                <StarIcon filled={false} />
                <StarIcon filled={false} />
            </div>
            <h3 className="text-lg font-bold text-teal-600">Dễ (Easy)</h3>
            <p className="text-slate-500 text-xs text-center mt-1">Câu ghép đơn giản, giao tiếp hàng ngày (A2).</p>
          </button>

          {/* MEDIUM */}
          <button
            onClick={() => handleLevelSelect('Medium')}
            className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-yellow-50 border-2 border-transparent hover:border-yellow-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex mb-1">
                <StarIcon filled={true} colorClass="text-yellow-500" />
                <StarIcon filled={true} colorClass="text-yellow-500" />
                <StarIcon filled={true} colorClass="text-yellow-500" />
                <StarIcon filled={false} />
            </div>
            <h3 className="text-lg font-bold text-yellow-600">Trung bình (Medium)</h3>
            <p className="text-slate-500 text-xs text-center mt-1">Câu phức, dựa vào ngữ cảnh (B1).</p>
          </button>

          {/* HARD */}
          <button
            onClick={() => handleLevelSelect('Hard')}
            className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-red-50 border-2 border-transparent hover:border-red-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex mb-1">
                <StarIcon filled={true} colorClass="text-red-500" />
                <StarIcon filled={true} colorClass="text-red-500" />
                <StarIcon filled={true} colorClass="text-red-500" />
                <StarIcon filled={true} colorClass="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-red-600">Khó (Hard)</h3>
            <p className="text-slate-500 text-xs text-center mt-1">Nâng cao, ngoại lệ, học thuật (B2/C1).</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrammarDifficultySelection;

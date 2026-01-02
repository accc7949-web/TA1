import React from 'react';
import Header from './common/Header';
import { CustomVocabUnit } from '../types';

interface CustomModuleSelectionProps {
  customUnit: CustomVocabUnit;
  onSelectModule: (moduleName: string, moduleWords: any[]) => void;
  onBack: () => void;
}

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CustomModuleSelection: React.FC<CustomModuleSelectionProps> = ({ customUnit, onSelectModule, onBack }) => {
  const getTotalWords = () => {
    return customUnit.modules.reduce((sum, module) => sum + module.words.length, 0);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={`${customUnit.name} - Chọn Học Phần`} onBackToMenu={onBack} />
      
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-2xl px-4 pb-16">
        {/* Info Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <BookOpenIcon />
            <h2 className="text-2xl font-bold text-slate-800 ml-3">{customUnit.name}</h2>
          </div>
          <p className="text-slate-500">
            Tổng cộng <span className="font-bold text-blue-600">{getTotalWords()}</span> từ vựng, chia thành <span className="font-bold text-blue-600">{customUnit.modules.length}</span> học phần
          </p>
        </div>

        {/* Module List */}
        <div className="grid grid-cols-1 gap-3 w-full">
          {customUnit.modules.length > 0 ? (
            customUnit.modules.map((module, index) => (
              <button
                key={module.id}
                onClick={() => onSelectModule(module.name, module.words || [])}
                className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-md hover:shadow-lg hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1 border border-slate-100"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-xl font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-800">{module.name}</h3>
                    <p className="text-sm text-slate-500">
                      {module.words?.length || 0} từ vựng {module.isAIGenerated && '✨ AI'}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon />
              </button>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Chưa có học phần nào. Vui lòng tạo học phần trước.</p>
            </div>
          )}
        </div>

        {/* Learning Tip */}
        {customUnit.modules.length > 0 && (
          <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-2xl text-center text-sm text-purple-800">
            💡 Mỗi học phần giúp bạn học tập hiệu quả hơn. Hãy hoàn thành từng phần trước khi chuyển sang phần tiếp theo!
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModuleSelection;

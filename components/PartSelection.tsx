import React from 'react';
import { Flashcard, VocabularyCategory } from '../types';
import Header from './common/Header';

interface PartSelectionProps {
  category: VocabularyCategory;
  onSelectPart: (words: Flashcard[]) => void;
  onBack: () => void;
}

const CollectionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const DocumentTextIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const PartSelection: React.FC<PartSelectionProps> = ({ category, onSelectPart, onBack }) => {
    const allWords = category.parts.flatMap(p => p.words);
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={`Chủ đề: ${category.name}`} onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <h2 className="text-2xl font-semibold text-slate-600 mb-8">Chọn một học phần</h2>
        <div className="grid grid-cols-1 gap-6 w-full">
            <button
                onClick={() => onSelectPart(allWords)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1"
            >
                <CollectionIcon />
                <div>
                    <h2 className="text-xl font-semibold text-purple-600">Tất cả các học phần</h2>
                    <p className="text-slate-500">{allWords.length} từ</p>
                </div>
            </button>
            <hr/>
            {category.parts.map(part => (
                <button
                key={part.name}
                onClick={() => onSelectPart(part.words)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-cyan-50 transition-all duration-300 transform hover:-translate-y-1"
                >
                <DocumentTextIcon />
                <div>
                    <h2 className="text-xl font-semibold text-cyan-600">{part.name}</h2>
                    <p className="text-slate-500">{part.words.length} từ</p>
                </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PartSelection;
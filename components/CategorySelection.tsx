import React from 'react';
import { CATEGORIES } from '../constants';
import { VocabularyCategory } from '../types';
import Header from './common/Header';

interface CategorySelectionProps {
  onSelectCategory: (category: VocabularyCategory) => void;
  onBack: () => void;
}

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const CategorySelection: React.FC<CategorySelectionProps> = ({ onSelectCategory, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title="Chọn nhóm từ vựng" onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <div className="grid grid-cols-1 gap-6 w-full">
          {CATEGORIES.map(category => {
            const wordCount = category.parts.reduce((sum, part) => sum + part.words.length, 0);
            return (
                <button
                key={category.name}
                onClick={() => onSelectCategory(category)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-teal-50 transition-all duration-300 transform hover:-translate-y-1"
                >
                <FolderIcon />
                <div>
                    <h2 className="text-xl font-semibold text-teal-600">{category.name}</h2>
                    <p className="text-slate-500">{wordCount} từ</p>
                </div>
                </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
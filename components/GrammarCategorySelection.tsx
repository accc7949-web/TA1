
import React from 'react';
import { GRAMMAR_CATEGORIES } from '../constants';
import { GrammarCategory } from '../types';
import Header from './common/Header';

interface GrammarCategorySelectionProps {
  onSelectCategory: (category: GrammarCategory) => void;
  onBack: () => void;
  title?: string;
}

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
);

const GrammarCategorySelection: React.FC<GrammarCategorySelectionProps> = ({ onSelectCategory, onBack, title = "Chọn nhóm ngữ pháp" }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={title} onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <div className="grid grid-cols-1 gap-6 w-full">
          {GRAMMAR_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-sky-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <FolderIcon />
              <div>
                <h2 className="text-xl font-bold text-sky-700">{category.name}</h2>
                <p className="text-slate-500 mt-1">{category.description}</p>
                <p className="text-xs text-sky-400 font-semibold mt-2 uppercase tracking-wide">{category.topics.length} bài học</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrammarCategorySelection;

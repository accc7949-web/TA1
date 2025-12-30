import React from 'react';
import { RelatedWord } from '../../types';
import InteractiveText from './InteractiveText';

interface WordDefinitionModalProps {
  wordData: RelatedWord;
  onClose: () => void;
  showDetail: (word: string) => void;
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WordDefinitionModal: React.FC<WordDefinitionModalProps> = ({ wordData, onClose, showDetail }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <XIcon />
        </button>
        <h2 id="word-title" className="text-3xl font-bold text-slate-800 capitalize">
          <button onClick={() => showDetail(wordData.word)} className="hover:text-sky-600 transition-colors">
            {wordData.word}
          </button>
          <span className="text-lg font-normal text-slate-500 italic ml-2">({wordData.pos})</span>
        </h2>
        <p className="text-xl text-sky-600 mt-4">{wordData.meaning}</p>
        
        {wordData.examples && wordData.examples.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600 italic text-left space-y-1">
             <p className="font-semibold not-italic text-slate-700 mb-1">Ví dụ:</p>
             {wordData.examples.map((ex, index) => (
                <div key={index}>"<InteractiveText text={ex} showDetail={showDetail} />"</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDefinitionModal;

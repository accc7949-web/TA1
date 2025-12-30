
import React from 'react';
import { GrammarTopic } from '../types';
import Header from './common/Header';

interface GrammarPracticeSelectionProps {
  topics: GrammarTopic[];
  onSelectTopic: (topic: GrammarTopic) => void;
  onBack: () => void;
  title?: string;
}

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const GrammarPracticeSelection: React.FC<GrammarPracticeSelectionProps> = ({ topics, onSelectTopic, onBack, title = "Chọn bài tập" }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={title} onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <p className="mb-6 text-slate-500 text-center">AI sẽ tạo 5 câu hỏi trắc nghiệm dựa trên chủ đề bạn chọn.</p>
        <div className="grid grid-cols-1 gap-4 w-full">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-pink-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <TargetIcon />
              <div>
                <h2 className="text-lg font-bold text-pink-700">{topic.title}</h2>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrammarPracticeSelection;

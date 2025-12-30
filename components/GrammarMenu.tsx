
import React from 'react';
import { GrammarTopic } from '../types';
import Header from './common/Header';

interface GrammarMenuProps {
  topics: GrammarTopic[];
  onSelectTopic: (topic: GrammarTopic) => void;
  onBack: () => void;
  title?: string;
}

const BookIcon = ({ color }: { color: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mr-4 text-${color}-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const GrammarMenu: React.FC<GrammarMenuProps> = ({ topics, onSelectTopic, onBack, title = "Danh sách bài học" }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={title} onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <div className="grid grid-cols-1 gap-4 w-full">
          {topics.map(topic => {
             const color = topic.colorTheme || 'blue';
             return (
                <button
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-${color}-50 transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-${color}-500`}
                >
                <BookIcon color={color} />
                <div>
                    <h2 className={`text-lg font-bold text-${color}-700`}>{topic.title}</h2>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{topic.summary}</p>
                </div>
                </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default GrammarMenu;

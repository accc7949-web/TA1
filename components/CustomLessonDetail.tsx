import React, { useState } from 'react';
import { CustomGrammarLesson } from '../types';

interface CustomLessonDetailProps {
  lesson: CustomGrammarLesson;
  unitName: string;
  onBack: () => void;
}

export default function CustomLessonDetail({
  lesson,
  unitName,
  onBack,
}: CustomLessonDetailProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const difficultyColor = {
    beginner: 'text-green-600 bg-green-50',
    intermediate: 'text-orange-600 bg-orange-50',
    advanced: 'text-red-600 bg-red-50',
  };

  const difficultyLabel = {
    beginner: 'Cơ Bản',
    intermediate: 'Trung Bình',
    advanced: 'Nâng Cao',
  };

  const parseMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, idx) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Code
        line = line.replace(/`(.*?)`/g, '<code>$1</code>');
        // Headings
        if (line.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-lg font-bold text-gray-800 mt-3 mb-2">
              {line.slice(4)}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-xl font-bold text-gray-800 mt-4 mb-2">
              {line.slice(3)}
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-2xl font-bold text-gray-800 mt-4 mb-2">
              {line.slice(2)}
            </h2>
          );
        }
        return (
          <p
            key={idx}
            className="text-gray-700 mb-2"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        );
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-1"
          >
            ← Quay Lại
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">{unitName}</p>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              {lesson.isAIGenerated ? '✨ ' : '📝 '}
              {lesson.title}
            </h1>
            <p className="text-gray-600 mb-4">{lesson.description}</p>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  difficultyColor[lesson.difficulty]
                }`}
              >
                {difficultyLabel[lesson.difficulty]}
              </span>
              {lesson.isAIGenerated && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Tạo bởi AI
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 hover:text-blue-600"
          >
            {isExpanded ? '▼' : '▶'} Nội Dung
          </button>

          {isExpanded && (
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed">
                {parseMarkdown(lesson.content)}
              </div>
            </div>
          )}
        </div>

        {/* Examples */}
        {lesson.examples.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ví Dụ</h2>
            <div className="space-y-3">
              {lesson.examples.map((example, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 border-l-4 border-blue-500 pl-4 py-3 rounded"
                >
                  <p className="text-gray-800 font-medium">{example}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Classroom, Grade } from '../types';
import Header from './common/Header';

interface GradeSelectionProps {
  classroom: Classroom;
  onSelect: (grade: Grade) => void;
  onBack: () => void;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const GradeSelection: React.FC<GradeSelectionProps> = ({ classroom, onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={`Chương trình: ${classroom.name}`} onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <h2 className="text-2xl font-semibold text-slate-600 mb-8">Chọn Lớp</h2>
        <div className="grid grid-cols-1 gap-6 w-full">
            {classroom.grades.map(grade => {
                const unitCount = grade.units.length;
                return (
                    <button
                        key={grade.name}
                        onClick={() => onSelect(grade)}
                        disabled={unitCount === 0}
                        className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:transform-none"
                    >
                        <BookIcon />
                        <div>
                            <h2 className="text-xl font-semibold text-blue-600">{grade.name}</h2>
                            <p className="text-slate-500">{unitCount > 0 ? `${unitCount} bài học` : 'Chưa có dữ liệu'}</p>
                        </div>
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default GradeSelection;

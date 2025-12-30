import React from 'react';
import { CLASSROOMS } from '../constants';
import { Classroom } from '../types';
import Header from './common/Header';

interface ClassroomSelectionProps {
  onSelect: (classroom: Classroom) => void;
  onBack: () => void;
}

const LibraryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);


const ClassroomSelection: React.FC<ClassroomSelectionProps> = ({ onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title="Chọn Chương Trình Học" onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
        <div className="grid grid-cols-1 gap-6 w-full">
          {CLASSROOMS.map(classroom => {
            const gradeCount = classroom.grades.length;
            return (
                <button
                key={classroom.name}
                onClick={() => onSelect(classroom)}
                className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-teal-50 transition-all duration-300 transform hover:-translate-y-1"
                >
                <LibraryIcon />
                <div>
                    <h2 className="text-xl font-semibold text-teal-600">{classroom.name}</h2>
                    <p className="text-slate-500">{gradeCount} cấp lớp</p>
                </div>
                </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ClassroomSelection;

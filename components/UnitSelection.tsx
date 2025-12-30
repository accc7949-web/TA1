import React from 'react';
import { Grade, Unit } from '../types';
import Header from './common/Header';

interface UnitSelectionProps {
  grade: Grade;
  onSelect: (unit: Unit) => void;
  onBack: () => void;
}

const DocumentTextIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const UnitSelection: React.FC<UnitSelectionProps> = ({ grade, onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={`Từ vựng ${grade.name}`} onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-md pb-16">
         <h2 className="text-2xl font-semibold text-slate-600 mb-8">Chọn Bài Học</h2>
        <div className="grid grid-cols-1 gap-6 w-full">
            {grade.units.map(unit => {
                const wordCount = unit.parts.reduce((sum, part) => sum + part.words.length, 0);
                return (
                    <button
                        key={unit.name}
                        onClick={() => onSelect(unit)}
                        className="flex items-center text-left p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <DocumentTextIcon />
                        <div>
                            <h2 className="text-xl font-semibold text-purple-600">{unit.name}</h2>
                            <p className="text-slate-500">{wordCount} từ</p>
                        </div>
                    </button>
                )
            })}
             {grade.units.length === 0 && (
                <p className="text-slate-400 text-center italic">Không có bài học nào cho lớp này.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default UnitSelection;

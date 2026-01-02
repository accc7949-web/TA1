
import React, { useState } from 'react';
import { GameMode, GrammarTopic, Unit } from '../types';
import { GRAMMAR_CATEGORIES, CLASSROOMS } from '../constants';

interface SidebarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onSelectGrammarTopic: (topic: GrammarTopic) => void;
  selectedGrammarTopicId?: string;
  onSelectVocabularyUnit: (unit: Unit) => void;
  selectedVocabularyUnitName?: string;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentMode, 
  onSelectMode, 
  onSelectGrammarTopic, 
  selectedGrammarTopicId,
  onSelectVocabularyUnit,
  selectedVocabularyUnitName,
  isMobileOpen,
  closeMobileSidebar,
  isCollapsed,
  onToggleCollapse
}) => {
  // Mặc định là 'grammar'
  const [activeSection, setActiveSection] = useState<'vocab' | 'grammar'>('grammar');

  // Sidebar vocabulary display options
  const vocabGrade = CLASSROOMS[0].grades.find(g => g.name === 'Lớp 12');
  const customVocabLabel = 'Từ Vựng Tùy Chỉnh';

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden" onClick={closeMobileSidebar}></div>
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-30 bg-white border-r border-slate-100 transform transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-80'}
        flex flex-col h-full
      `}>
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectMode(GameMode.MAIN_MENU)}>
             <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             </div>
             <span className={`text-2xl font-black text-blue-700 tracking-tighter ${isCollapsed ? 'md:hidden' : ''}`}>EnglishMaster</span>
          </div>
          <button onClick={onToggleCollapse} className="hidden md:block p-2 text-slate-300 hover:text-slate-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
        </div>

        {/* Menu Section */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide pb-10">
            
            {/* PHẦN CHUYÊN MỤC - Cố định */}
            {!isCollapsed && (
                <div className="space-y-4">
                    <span className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Chuyên mục</span>
                    <div className="space-y-1">
                        <button 
                            onClick={() => { onSelectMode(GameMode.GRAMMAR_CATEGORY_SELECTION); closeMobileSidebar(); }}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${currentMode === GameMode.GRAMMAR_CATEGORY_SELECTION || currentMode === GameMode.GRAMMAR_PRACTICE_MODE ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <div className={`w-2 h-2 rounded-full bg-emerald-400`}></div>
                            Ôn tập Ngữ pháp
                        </button>
                        <button 
                            onClick={() => { onSelectMode(GameMode.EXAM_PREP_MENU); closeMobileSidebar(); }}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${currentMode === GameMode.EXAM_PREP_MENU || currentMode === GameMode.EXAM_PRACTICE_MODE ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <div className={`w-2 h-2 rounded-full bg-orange-400`}></div>
                            Đề thi TN THPT
                        </button>
                        <button 
                            onClick={() => { onSelectMode(GameMode.WRITING_TRANSLATION_MENU); closeMobileSidebar(); }}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${currentMode === GameMode.WRITING_TRANSLATION_MENU || currentMode === GameMode.TRANSLATION_PRACTICE || currentMode === GameMode.WRITING_PRACTICE ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <div className={`w-2 h-2 rounded-full bg-blue-400`}></div>
                            Luyện Viết & Dịch
                        </button>
                    </div>
                </div>
            )}

            {/* PHẦN DANH SÁCH CHI TIẾT - Thay đổi theo Tab dưới */}
            {activeSection === 'vocab' ? (
                <div className={isCollapsed ? 'md:hidden' : 'space-y-4 pt-4 border-t border-slate-50'}>
                    <span className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Học từ vựng theo lớp</span>
                    <div className="space-y-1">
                        {vocabGrade?.units.map(unit => (
                            <button 
                                key={unit.name} 
                                onClick={() => { onSelectVocabularyUnit(unit); closeMobileSidebar(); }}
                                className={`w-full text-left p-4 rounded-2xl text-sm font-bold transition-all truncate ${selectedVocabularyUnitName === unit.name ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {unit.name}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={isCollapsed ? 'md:hidden' : 'space-y-4 pt-4 border-t border-slate-50'}>
                    <span className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Bài học Ngữ pháp</span>
                    <div className="space-y-1">
                        {GRAMMAR_CATEGORIES.map(cat => (
                            <div key={cat.id} className="mb-2">
                                {cat.topics.map(topic => (
                                    <button 
                                        key={topic.id}
                                        onClick={() => { onSelectGrammarTopic(topic); closeMobileSidebar(); }}
                                        className={`w-full text-left p-4 rounded-2xl text-sm font-bold transition-all truncate ${selectedGrammarTopicId === topic.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {topic.title}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Quick Switcher Buttons */}
        <div className="p-6 border-t border-slate-50">
            <div className={`flex items-center gap-4 ${isCollapsed ? 'flex-col items-center' : 'justify-center bg-slate-50 p-3 rounded-3xl border border-slate-100'}`}>
                 <button 
                    onClick={() => setActiveSection('vocab')}
                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${activeSection === 'vocab' ? 'bg-blue-600 shadow-lg scale-110 ring-4 ring-blue-100' : 'bg-blue-200 opacity-50 hover:opacity-100'}`}
                    title="Mục Từ vựng"
                 >
                    {activeSection === 'vocab' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                 </button>
                 
                 <button 
                    onClick={() => setActiveSection('grammar')}
                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${activeSection === 'grammar' ? 'bg-emerald-500 shadow-lg scale-110 ring-4 ring-emerald-100' : 'bg-emerald-200 opacity-50 hover:opacity-100'}`}
                    title="Mục Ngữ pháp"
                 >
                    {activeSection === 'grammar' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                 </button>

                 {!isCollapsed && (
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {activeSection === 'vocab' ? 'Vocab List' : 'Grammar List'}
                     </span>
                 )}
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

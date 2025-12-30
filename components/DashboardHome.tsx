
import React, { useState } from 'react';
import { GameMode, GrammarTopic, Unit } from '../types';
import { CLASSROOMS, GRAMMAR_CATEGORIES } from '../constants';

// --- PROPS ---
interface HubProps {
    onSelectMode: (mode: GameMode) => void;
    onSelectGrammarTopic: (topic: GrammarTopic) => void;
    onSelectVocabularyUnit: (unit: Unit) => void;
}

// --- ICONS ---
const WriteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const ExamIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const PracticeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

const DashboardHome: React.FC<HubProps> = ({ onSelectMode, onSelectGrammarTopic, onSelectVocabularyUnit }) => {
    // Mặc định là 'grammar' theo yêu cầu "Lấy Ngữ pháp làm trang chủ"
    const [mainTab, setMainTab] = useState<'vocabulary' | 'grammar'>('grammar');
    const [selectedGrade, setSelectedGrade] = useState<string>('Lớp 12');

    return (
        <div className="p-4 md:p-6 space-y-8 animate-fade-in">
            
            {/* 1. Quick Action Cards (TOP SECTION) */}
            <div className="space-y-4">
                <button 
                    onClick={() => onSelectMode(GameMode.GRAMMAR_CATEGORY_SELECTION)}
                    className="w-full flex items-center p-5 bg-emerald-50 text-emerald-800 rounded-2xl shadow-sm border border-emerald-100 hover:bg-emerald-100 transition-all transform active:scale-[0.98]"
                >
                    <div className="bg-white p-3 rounded-2xl mr-4 shadow-sm"><PracticeIcon /></div>
                    <span className="text-xl font-bold">Ôn Tập Ngữ Pháp</span>
                </button>

                <button 
                    onClick={() => onSelectMode(GameMode.EXAM_PREP_MENU)}
                    className="w-full flex items-center p-5 bg-orange-50 text-orange-800 rounded-2xl shadow-sm border border-orange-100 hover:bg-orange-100 transition-all transform active:scale-[0.98]"
                >
                    <div className="bg-white p-3 rounded-2xl mr-4 shadow-sm"><ExamIcon /></div>
                    <span className="text-xl font-bold">Làm Đề Kiểm Tra TN THPT</span>
                </button>

                <button 
                    onClick={() => onSelectMode(GameMode.WRITING_TRANSLATION_MENU)}
                    className="w-full flex items-center p-5 bg-blue-50 text-blue-800 rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-100 transition-all transform active:scale-[0.98]"
                >
                    <div className="bg-white p-3 rounded-2xl mr-4 shadow-sm"><WriteIcon /></div>
                    <span className="text-xl font-bold">Luyện Viết & Dịch</span>
                </button>
            </div>

            {/* 2. Unified Category Selection Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Header with Switcher */}
                <div className="p-6 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Danh mục bài học</span>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button 
                                onClick={() => setMainTab('vocabulary')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mainTab === 'vocabulary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Từ vựng
                            </button>
                            <button 
                                onClick={() => setMainTab('grammar')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mainTab === 'grammar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Ngữ pháp
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-2">
                        {mainTab === 'vocabulary' ? (
                            <>
                                {CLASSROOMS[0].grades.map(grade => (
                                    <div key={grade.name} className="space-y-1">
                                        <button 
                                            onClick={() => setSelectedGrade(selectedGrade === grade.name ? '' : grade.name)}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedGrade === grade.name ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <AcademicCapIcon />
                                                <span className="font-bold">{grade.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {selectedGrade === grade.name && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                                                <ChevronRightIcon />
                                            </div>
                                        </button>
                                        
                                        {selectedGrade === grade.name && (
                                            <div className="pl-12 pr-4 py-2 space-y-1">
                                                {grade.units.length > 0 ? grade.units.map(unit => (
                                                    <button 
                                                        key={unit.name} 
                                                        onClick={() => onSelectVocabularyUnit(unit)}
                                                        className="w-full text-left p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all flex items-center justify-between group"
                                                    >
                                                        <span>{unit.name}</span>
                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">🚀</span>
                                                    </button>
                                                )) : <p className="text-slate-400 text-sm italic">Sẽ sớm cập nhật nội dung.</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {GRAMMAR_CATEGORIES.map(cat => (
                                    <div key={cat.id} className="space-y-1">
                                        <div className="p-4 flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-slate-50 mt-2">
                                            {cat.name}
                                        </div>
                                        {cat.topics.map(topic => (
                                            <button 
                                                key={topic.id}
                                                onClick={() => onSelectGrammarTopic(topic)}
                                                className="w-full flex items-center justify-between p-4 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <BookOpenIcon />
                                                    <span className="font-bold">{topic.title}</span>
                                                </div>
                                                <ChevronRightIcon />
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Bottom Status Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-inner">
                    {mainTab === 'vocabulary' ? '12' : 'GP'}
                </div>
                <div className="flex-1">
                    <div className="font-black text-slate-800">
                        {mainTab === 'vocabulary' ? selectedGrade : 'Chuyên đề Ngữ pháp'}
                    </div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-tight">Hệ thống giáo dục phổ thông</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>

        </div>
    );
}

export default DashboardHome;

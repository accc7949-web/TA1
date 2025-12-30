
import React, { useState, useEffect } from 'react';
import { GrammarTopic } from '../types';
import InteractiveText from './common/InteractiveText';

interface GrammarDetailProps {
  topic: GrammarTopic;
  onBack: () => void;
  showDetail: (word: string) => void;
  onOpenAiChat?: (topic: GrammarTopic) => void;
  onStartPractice?: (topic: GrammarTopic) => void;
}

interface ContentBoxProps {
    title: string;
    children?: React.ReactNode;
    type?: 'definition' | 'note' | 'example';
    colorTheme?: string;
}

// Sub-component for rendering content boxes
const ContentBox: React.FC<ContentBoxProps> = ({ title, children, type = 'definition', colorTheme = 'blue' }) => {
    let containerClass = '';
    let headerClass = '';
    let icon = null;

    const safeColorTheme = colorTheme || 'blue';
    const baseColor = ['blue', 'sky', 'cyan', 'teal', 'emerald', 'green', 'lime', 'yellow', 'amber', 'orange', 'red', 'rose', 'pink', 'purple', 'violet', 'indigo', 'slate'].includes(safeColorTheme) ? safeColorTheme : 'blue';

    if (type === 'definition') {
        containerClass = `bg-${baseColor}-50 border border-${baseColor}-200`;
        headerClass = `text-${baseColor}-800`;
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-${baseColor}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        );
    } else if (type === 'note') {
        containerClass = 'bg-amber-50 border border-amber-200';
        headerClass = 'text-amber-800';
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    } else {
        containerClass = 'bg-slate-50 border border-slate-200';
        headerClass = 'text-slate-700';
         icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
        );
    }

    return (
        <div className={`rounded-lg p-5 mb-4 ${containerClass}`}>
            <h4 className={`font-bold flex items-center mb-3 text-lg ${headerClass}`}>
                {icon}
                {title}
            </h4>
            <div className="text-slate-700 leading-relaxed text-base">
                {children}
            </div>
        </div>
    );
};

const GrammarDetail: React.FC<GrammarDetailProps> = ({ topic, onBack, showDetail, onOpenAiChat, onStartPractice }) => {
  const [activeSubTopic, setActiveSubTopic] = useState<GrammarTopic | null>(topic.subTopics ? topic.subTopics[0] : null);

  // FIX: Reset activeSubTopic when the main topic prop changes
  useEffect(() => {
      setActiveSubTopic(topic.subTopics ? topic.subTopics[0] : null);
  }, [topic]);

  const currentTopic = activeSubTopic || topic;

  const renderFormattedContent = (content: string, themeColor: string) => {
      const lines = content.split('\n');
      return (
          <div className="space-y-2">
            {lines.map((line, idx) => {
                 const parts = line.split('**');
                 return (
                     <div key={idx} className="block">
                         {parts.map((part, pIdx) => (
                             pIdx % 2 === 1 
                             ? <span key={pIdx} className={`font-bold text-${themeColor}-700`}>{part}</span> 
                             : <span key={pIdx}>{part}</span>
                         ))}
                     </div>
                 )
            })}
          </div>
      );
  };

  const themeColor = currentTopic.colorTheme || 'blue';

  return (
    <div className="w-full flex flex-col items-center pb-20 relative font-sans animate-fade-in">
      
      <div className="w-full max-w-4xl px-4 md:px-0">
        
        {/* HEADER SECTION */}
        <div className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                     <span className={`bg-${themeColor}-100 text-${themeColor}-700 text-xs px-2 py-1 rounded uppercase font-bold tracking-wider`}>
                        {topic.subTopics ? 'Chuyên đề lớn' : 'Lý thuyết'}
                     </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
                    {topic.title}
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    {topic.summary}
                </p>
            </div>
            
            {onStartPractice && (
                <button 
                    onClick={() => onStartPractice(currentTopic)}
                    className={`flex-shrink-0 flex items-center justify-center px-6 py-3 bg-${themeColor}-600 text-white rounded-xl shadow-lg hover:bg-${themeColor}-700 transition-transform transform hover:-translate-y-1 font-bold`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Luyện tập ngay
                </button>
            )}
        </div>

        {/* SUBTOPICS NAVIGATION (If grouped) */}
        {topic.subTopics && (
            <div className="mb-10 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-2 sticky top-2 z-10">
                {topic.subTopics.map((st) => (
                    <button
                        key={st.id}
                        onClick={() => setActiveSubTopic(st)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${activeSubTopic?.id === st.id ? `bg-${st.colorTheme || 'blue'}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        {st.title.replace(/^\d+\.\s*/, '')}
                    </button>
                ))}
            </div>
        )}

        {/* --- CONTENT START --- */}
        <div key={currentTopic.id} className="animate-fade-in-up">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center">
                <span className={`w-2 h-8 bg-${themeColor}-500 rounded-full mr-4`}></span>
                {currentTopic.title}
            </h2>

            {/* CHEAT SHEET */}
            {currentTopic.cheatSheet && (
                <div className="mb-10">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        {currentTopic.cheatSheet.headers.map((h, i) => (
                                            <th key={i} className="p-4 font-bold text-xs text-slate-500 uppercase tracking-widest border-r border-slate-200 last:border-0">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTopic.cheatSheet.rows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 last:border-0">
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className={`p-4 text-slate-700 whitespace-pre-line border-r border-slate-100 last:border-0 ${cIdx === 0 ? 'font-black text-slate-900 bg-slate-50/50' : 'font-mono text-sm'}`}>
                                                    {renderFormattedContent(cell, themeColor)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTIONS */}
            <div className="space-y-8">
                {currentTopic.sections.map((section, index) => {
                    const isNote = section.title.toLowerCase().includes('quy tắc') || section.title.toLowerCase().includes('lưu ý');
                    const isUsage = section.title.toLowerCase().includes('cách dùng');
                    
                    return (
                        <div key={index}>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">{section.title}</h2>
                            
                            {isUsage ? (
                                <ContentBox title="Phân tích cách dùng" type="definition" colorTheme={themeColor}>
                                    {renderFormattedContent(section.content, themeColor)}
                                </ContentBox>
                            ) : isNote ? (
                                <ContentBox title="Lưu ý quan trọng" type="note">
                                    {renderFormattedContent(section.content, themeColor)}
                                </ContentBox>
                            ) : (
                                <div className="text-slate-700 leading-relaxed text-lg mb-4 pl-4 border-l-4 border-slate-200">
                                    {renderFormattedContent(section.content, themeColor)}
                                </div>
                            )}

                            {section.examples.length > 0 && (
                                <ContentBox title="Ví dụ" type="example">
                                    <ul className="space-y-2">
                                        {section.examples.map((ex, exIndex) => (
                                            <li key={exIndex} className="italic text-slate-600">
                                                • <InteractiveText text={ex} showDetail={showDetail} />
                                            </li>
                                        ))}
                                    </ul>
                                </ContentBox>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* AI Tutor Button */}
        {onOpenAiChat && (
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => onOpenAiChat(currentTopic)}
                    className="flex items-center px-6 py-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 border border-slate-700 group"
                >
                    <span className="text-2xl mr-3 group-hover:rotate-12 transition-transform">🤖</span>
                    <span className="font-bold">Hỏi AI về bài này</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default GrammarDetail;

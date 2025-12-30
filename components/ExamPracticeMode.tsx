
import React, { useState, useEffect } from 'react';
import { generateExamPractice } from '../services/gemini';
import { ExamPracticeConfig, ExamQuestion } from '../types';
import Header from './common/Header';

interface ExamPracticeModeProps {
    config: ExamPracticeConfig;
    onBack: () => void;
}

const ExamPracticeMode: React.FC<ExamPracticeModeProps> = ({ config, onBack }) => {
    const [data, setData] = useState<ExamQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    
    // State for MCQ types
    const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
    
    // State for Arrangement type
    const [arrangedOrder, setArrangedOrder] = useState<string[]>([]);
    
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const loadExam = async () => {
            setLoading(true);
            const result = await generateExamPractice(config);
            if (result) {
                setData(result);
                if (result.type === 'ARRANGEMENT' && result.arrangementItems) {
                    // Initialize empty or pre-fill? Let's start empty for user to click
                }
            }
            setLoading(false);
        };
        loadExam();
    }, [config]);

    const handleMcqSelect = (questionId: string, option: string) => {
        if (submitted) return;
        setUserAnswers(prev => ({...prev, [questionId]: option}));
    };

    const handleArrangementClick = (item: string) => {
        if (submitted) return;
        if (arrangedOrder.includes(item)) {
            // Remove if already added
            setArrangedOrder(prev => prev.filter(i => i !== item));
        } else {
            // Add to end
            setArrangedOrder(prev => [...prev, item]);
        }
    };

    const checkArrangementResult = () => {
        if (!data?.correctArrangement) return false;
        if (arrangedOrder.length !== data.correctArrangement.length) return false;
        for (let i = 0; i < arrangedOrder.length; i++) {
            if (arrangedOrder[i] !== data.correctArrangement[i]) return false;
        }
        return true;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center w-full min-h-screen">
                <Header title="Đang tạo đề..." onBackToMenu={onBack} />
                <div className="flex flex-col items-center justify-center flex-grow">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                    <p className="text-slate-500">AI đang viết bài {config.topic}...</p>
                </div>
            </div>
        );
    }

    if (!data) return <div>Lỗi tải đề. Vui lòng thử lại.</div>;

    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-12">
            <Header title="Luyện thi 2025" onBackToMenu={onBack} />
            
            <div className="w-full max-w-3xl px-4">
                
                {/* Context / Reading Passage Area */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border-l-4 border-orange-500">
                    <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wide mb-2">
                        {data.type === 'NOTICE_FLYER' ? 'Đọc thông báo / Tờ rơi' : 
                         data.type === 'ARRANGEMENT' ? 'Sắp xếp câu' : 'Bài đọc'}
                    </h3>
                    
                    {data.type === 'ARRANGEMENT' ? (
                        <div className="text-slate-600 italic mb-2">Sắp xếp các câu sau thành đoạn văn hoàn chỉnh:</div>
                    ) : (
                        <div className="whitespace-pre-line text-lg text-slate-800 leading-relaxed font-serif">
                            {data.context}
                        </div>
                    )}
                </div>

                {/* Questions Area */}
                
                {/* TYPE: MCQ (Notice, Cloze, Reading) */}
                {data.subQuestions && (
                    <div className="space-y-6">
                        {data.subQuestions.map((q, idx) => {
                            const isCorrect = userAnswers[q.id] === q.correctAnswer;
                            return (
                                <div key={q.id} className="bg-white p-5 rounded-xl shadow-md">
                                    <div className="font-bold text-slate-700 mb-3">{q.questionText}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {q.options.map((opt) => {
                                            let btnClass = "p-3 rounded-lg border text-left hover:bg-slate-50";
                                            if (submitted) {
                                                if (opt === q.correctAnswer) btnClass = "p-3 rounded-lg border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
                                                else if (opt === userAnswers[q.id] && opt !== q.correctAnswer) btnClass = "p-3 rounded-lg border-2 border-red-500 bg-red-50 text-red-800";
                                                else btnClass = "p-3 rounded-lg border-slate-200 opacity-50";
                                            } else {
                                                if (userAnswers[q.id] === opt) btnClass = "p-3 rounded-lg border-2 border-orange-500 bg-orange-50 text-orange-900";
                                            }

                                            return (
                                                <button 
                                                    key={opt}
                                                    onClick={() => handleMcqSelect(q.id, opt)}
                                                    className={btnClass}
                                                    disabled={submitted}
                                                >
                                                    {opt}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    {submitted && (
                                        <div className="mt-3 text-sm text-indigo-600 bg-indigo-50 p-3 rounded">
                                            💡 {q.explanation}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* TYPE: ARRANGEMENT */}
                {data.type === 'ARRANGEMENT' && data.arrangementItems && (
                    <div className="space-y-4">
                        {/* Source Items */}
                        <div className="space-y-2">
                             {data.arrangementItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleArrangementClick(item)}
                                    disabled={submitted || arrangedOrder.includes(item)}
                                    className={`w-full text-left p-4 rounded-lg border shadow-sm transition-all ${
                                        arrangedOrder.includes(item) 
                                        ? 'bg-slate-100 text-slate-400 border-slate-200' 
                                        : 'bg-white hover:bg-orange-50 border-slate-300 text-slate-800'
                                    }`}
                                >
                                    <span className="font-bold mr-2 text-orange-500">{String.fromCharCode(65 + idx)}.</span> 
                                    {item}
                                </button>
                             ))}
                        </div>

                        {/* Drop Zone / Result */}
                        <div className="mt-8 p-4 bg-slate-100 rounded-xl min-h-[150px] border-2 border-dashed border-slate-300">
                            <h4 className="font-bold text-slate-500 mb-2">Thứ tự của bạn:</h4>
                            <div className="space-y-2">
                                {arrangedOrder.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded shadow-sm border-l-4 border-orange-500">
                                        <span>{item}</span>
                                        {!submitted && (
                                            <button onClick={() => handleArrangementClick(item)} className="text-red-400 font-bold px-2">X</button>
                                        )}
                                    </div>
                                ))}
                                {arrangedOrder.length === 0 && <p className="text-slate-400 text-center italic">Chọn câu bên trên để sắp xếp</p>}
                            </div>
                        </div>

                         {submitted && (
                            <div className={`mt-4 p-4 rounded-xl ${checkArrangementResult() ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                <h4 className="font-bold text-lg mb-2">{checkArrangementResult() ? 'Chính xác!' : 'Chưa đúng.'}</h4>
                                <p className="font-semibold">Đáp án đúng:</p>
                                <ul className="list-decimal list-inside">
                                    {data.correctArrangement?.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                                <p className="mt-2 text-sm italic">{data.explanation}</p>
                            </div>
                        )}
                    </div>
                )}


                {/* Actions */}
                <div className="mt-8 mb-8">
                    {!submitted ? (
                        <button 
                            onClick={() => setSubmitted(true)}
                            className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-colors"
                        >
                            Nộp bài
                        </button>
                    ) : (
                        <button 
                            onClick={onBack}
                            className="w-full py-4 bg-slate-600 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700 transition-colors"
                        >
                            Làm đề khác
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamPracticeMode;

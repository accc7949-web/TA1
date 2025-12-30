
import React, { useState } from 'react';
import { generateTranslationTask, evaluateTranslation } from '../services/gemini';
import { TranslationFeedback, Flashcard, DifficultyLevel } from '../types';
import Header from './common/Header';
import InteractiveText from './common/InteractiveText';

interface TranslationPracticeProps {
    vocabulary: Flashcard[]; // To suggest context if needed
    onBack: () => void;
    showDetail: (word: string) => void;
}

const TranslationPractice: React.FC<TranslationPracticeProps> = ({ vocabulary, onBack, showDetail }) => {
    const [topic, setTopic] = useState('Daily Life');
    const [useFlashcards, setUseFlashcards] = useState(false);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
    const [sourceText, setSourceText] = useState('');
    const [userTranslation, setUserTranslation] = useState('');
    const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'SETUP' | 'TRANSLATING' | 'RESULT'>('SETUP');

    const handleGenerate = async () => {
        setLoading(true);
        let vocabContext: string[] = [];
        if (useFlashcards && vocabulary.length > 0) {
            // Pick random 5 words
            const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
            vocabContext = shuffled.slice(0, 5).map(v => v.word);
        }

        const text = await generateTranslationTask(topic, vocabContext, difficulty);
        if (text) {
            setSourceText(text);
            setStep('TRANSLATING');
            setFeedback(null);
            setUserTranslation('');
        } else {
            alert('Lỗi tạo bài tập. Vui lòng thử lại.');
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!userTranslation.trim()) return;
        setLoading(true);
        const result = await evaluateTranslation(sourceText, userTranslation);
        if (result) {
            setFeedback(result);
            setStep('RESULT');
        }
        setLoading(false);
    };

    const handleRetry = () => {
        setStep('SETUP');
        setSourceText('');
        setUserTranslation('');
        setFeedback(null);
    }

    if (step === 'SETUP') {
        return (
            <div className="flex flex-col items-center w-full min-h-screen">
                <Header title="Luyện Dịch (Anh → Việt)" onBackToMenu={onBack} />
                <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-slate-700 mb-6">Thiết lập bài tập</h2>
                    
                    <div className="mb-4">
                        <label className="block text-slate-600 font-bold mb-2">Chủ đề bài đọc:</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none bg-white text-slate-800 placeholder-slate-400"
                            placeholder="VD: Technology, Travel, Family..."
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-slate-600 font-bold mb-2">Độ khó:</label>
                        <div className="flex gap-2 text-sm">
                             {(['Very Easy', 'Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`flex-1 py-2 px-1 rounded-lg border font-medium transition-colors ${
                                        difficulty === level 
                                        ? (level === 'Very Easy' ? 'bg-green-500 text-white border-green-500' : level === 'Easy' ? 'bg-teal-500 text-white border-teal-500' : level === 'Medium' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-red-500 text-white border-red-500')
                                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {level === 'Very Easy' ? 'Rất Dễ' : level === 'Easy' ? 'Dễ' : level === 'Medium' ? 'Vừa' : 'Khó'}
                                </button>
                             ))}
                        </div>
                    </div>

                    <div className="mb-6 flex items-center">
                        <input 
                            type="checkbox" 
                            id="useFlashcards"
                            checked={useFlashcards}
                            onChange={(e) => setUseFlashcards(e.target.checked)}
                            className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor="useFlashcards" className="ml-2 text-slate-600">
                            Lồng ghép từ vựng từ Flashcards của tôi ({vocabulary.length} từ)
                        </label>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors flex justify-center items-center"
                    >
                        {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : 'Tạo bài dịch'}
                    </button>
                </div>
            </div>
        );
    }

    const renderResult = () => (
        <div className="w-full max-w-4xl px-4">
            {feedback && (
                <div className="animate-fade-in-up space-y-6">
                    {/* Score & General Comment */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-600 font-bold text-lg">Tổng quan</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">Điểm số:</span>
                                <span className={`text-3xl font-bold ${feedback.score >= 8 ? 'text-emerald-600' : feedback.score >= 5 ? 'text-yellow-600' : 'text-red-500'}`}>
                                    {feedback.score}/10
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-600 italic border-l-4 border-slate-200 pl-4">{feedback.generalComment}</p>
                    </div>

                    {/* Original Source Text */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h4 className="font-bold text-lg text-slate-800 mb-4">Văn bản gốc (Tiếng Anh)</h4>
                        <div className="p-4 bg-slate-50 rounded-lg text-lg text-slate-800 leading-relaxed font-serif">
                           <InteractiveText text={sourceText} showDetail={showDetail} />
                        </div>
                    </div>

                    {/* Specific Corrections */}
                    {feedback.specificCorrections.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h4 className="font-bold text-lg text-slate-800 mb-4">Phân tích & Sửa lỗi chi tiết</h4>
                            <div className="space-y-4">
                                {feedback.specificCorrections.map((correction, index) => (
                                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                                        <div className="mb-2">
                                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">Bản gốc của bạn</span>
                                            <p className="mt-1 p-2 bg-red-50 rounded text-red-800 line-through">"{correction.originalPhrase}"</p>
                                        </div>
                                        <div className="mb-2">
                                           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Gợi ý sửa</span>
                                           <p className="mt-1 p-2 bg-emerald-50 rounded text-emerald-900 font-semibold">"{correction.correctedPhrase}"</p>
                                        </div>
                                        <p className="text-sm text-slate-600 italic">💡 {correction.explanation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Highlights */}
                    {feedback.highlights.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h4 className="font-bold text-lg text-sky-700 mb-2">Điểm cộng ✨</h4>
                            <ul className="list-disc list-inside text-sky-800 space-y-1">
                                {feedback.highlights.map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                        </div>
                    )}
                    
                    {/* Corrected Version */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h4 className="font-bold text-lg text-indigo-700 mb-2">Bản dịch tham khảo</h4>
                        <p className="text-indigo-900 font-medium leading-relaxed">{feedback.correctedVersion}</p>
                    </div>

                    <button 
                        onClick={handleRetry}
                        className="mt-2 w-full py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700"
                    >
                        Làm bài khác
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-12">
            <Header title="Luyện Dịch (Anh → Việt)" onBackToMenu={step === 'RESULT' ? handleRetry : onBack} />
            
            {step === 'RESULT' ? renderResult() : (
                <div className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Source Text Column */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-cyan-500">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-bold text-cyan-600 uppercase">Văn bản gốc (Tiếng Anh)</h3>
                                <span className={`text-xs px-2 py-1 rounded text-white font-bold ${difficulty === 'Very Easy' ? 'bg-green-400' : difficulty === 'Easy' ? 'bg-teal-400' : difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}`}>
                                    {difficulty === 'Very Easy' ? 'Rất Dễ' : difficulty === 'Easy' ? 'Dễ' : difficulty === 'Medium' ? 'TB' : 'Khó'}
                                </span>
                            </div>
                            <div className="text-lg text-slate-800 leading-relaxed font-serif">
                                <InteractiveText text={sourceText} showDetail={showDetail} />
                            </div>
                        </div>
                        
                        <div className="bg-cyan-50 p-4 rounded-lg text-sm text-cyan-800">
                            💡 Mẹo: Hãy dịch thoát ý, tập trung vào sự tự nhiên trong tiếng Việt thay vì dịch từng từ (word-by-word).
                        </div>
                    </div>

                    {/* Input Column */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-emerald-500 h-full flex flex-col">
                            <h3 className="text-sm font-bold text-emerald-600 uppercase mb-2">Bản dịch của bạn (Tiếng Việt)</h3>
                             <textarea 
                                value={userTranslation}
                                onChange={(e) => setUserTranslation(e.target.value)}
                                className="w-full flex-grow p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none min-h-[200px] bg-white text-slate-900 placeholder-slate-400"
                                placeholder="Nhập bản dịch tại đây..."
                            />
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || !userTranslation.trim()}
                                className="mt-4 w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex justify-center"
                            >
                                {loading ? 'Đang chấm điểm...' : 'Nộp bài'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TranslationPractice;

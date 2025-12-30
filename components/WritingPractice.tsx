
import React, { useState } from 'react';
import { generateWritingTask, evaluateWriting } from '../services/gemini';
import { WritingFeedback, DifficultyLevel } from '../types';
import Header from './common/Header';
import InteractiveText from './common/InteractiveText';

interface WritingPracticeProps {
    onBack: () => void;
    showDetail: (word: string) => void;
}

type WritingMode = 'PARAGRAPH' | 'TRANSLATE_TO_EN' | 'FILL_BLANKS';

const WritingPractice: React.FC<WritingPracticeProps> = ({ onBack, showDetail }) => {
    const [mode, setMode] = useState<WritingMode>('PARAGRAPH');
    const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
    const [topic, setTopic] = useState('');
    const [taskText, setTaskText] = useState('');
    const [userText, setUserText] = useState('');
    const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'SETUP' | 'WRITING' | 'RESULT'>('SETUP');

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert("Vui lòng nhập chủ đề.");
            return;
        }
        setLoading(true);
        const text = await generateWritingTask(mode, topic, difficulty);
        if (text) {
            setTaskText(text);
            setStep('WRITING');
            setFeedback(null);
            setUserText('');
        }
        setLoading(false);
    }

    const handleSubmit = async () => {
        if (!userText.trim()) return;
        setLoading(true);
        const result = await evaluateWriting(taskText, userText);
        if (result) {
            setFeedback(result);
            setStep('RESULT');
        }
        setLoading(false);
    }

    const handleRetry = () => {
        setStep('SETUP');
        setTaskText('');
        setUserText('');
        setFeedback(null);
    }

    if (step === 'SETUP') {
        return (
            <div className="flex flex-col items-center w-full min-h-screen">
                <Header title="Luyện Viết Tiếng Anh" onBackToMenu={onBack} />
                <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg">
                    
                    {/* Mode Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                        <button 
                            onClick={() => setMode('PARAGRAPH')} 
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'PARAGRAPH' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                        >
                            Viết đoạn văn
                        </button>
                        <button 
                            onClick={() => setMode('TRANSLATE_TO_EN')} 
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'TRANSLATE_TO_EN' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                        >
                            Dịch (Việt → Anh)
                        </button>
                        <button 
                            onClick={() => setMode('FILL_BLANKS')} 
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'FILL_BLANKS' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
                        >
                            Điền từ
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-slate-600 font-bold mb-2">Chủ đề mong muốn:</label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-800 placeholder-slate-400"
                            placeholder={mode === 'PARAGRAPH' ? "VD: My favorite hobby..." : "VD: Du lịch, Công nghệ..."}
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

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex justify-center"
                    >
                         {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : 'Bắt đầu'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-12">
            <Header title="Luyện Viết" onBackToMenu={onBack} />
            
            <div className="w-full max-w-3xl px-4">
                {/* Task Box */}
                <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg mb-6 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-bold text-slate-800
                        ${difficulty === 'Very Easy' ? 'bg-green-400' : difficulty === 'Easy' ? 'bg-teal-400' : difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-red-500 text-white'}
                    `}>
                        {difficulty === 'Very Easy' ? 'Rất Dễ' : difficulty === 'Easy' ? 'Dễ' : difficulty === 'Medium' ? 'Trung bình' : 'Khó'}
                    </div>
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                        {mode === 'PARAGRAPH' ? 'Câu hỏi / Đề bài' : mode === 'TRANSLATE_TO_EN' ? 'Đoạn văn cần dịch' : 'Điền từ vào đoạn văn'}
                    </h3>
                    <div className="text-lg leading-relaxed font-medium">
                        <InteractiveText text={taskText} showDetail={showDetail} variant="on-dark" />
                    </div>
                </div>

                {/* Working Area */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                    {step === 'WRITING' ? (
                        <>
                             <textarea 
                                value={userText}
                                onChange={(e) => setUserText(e.target.value)}
                                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none min-h-[200px] font-medium text-slate-900 bg-white placeholder-slate-400"
                                placeholder={mode === 'FILL_BLANKS' ? "Gõ lại toàn bộ đoạn văn đã điền từ..." : "Viết câu trả lời của bạn tại đây (Tiếng Anh)..."}
                            />
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || !userText.trim()}
                                className="mt-4 w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex justify-center"
                            >
                                {loading ? 'AI đang sửa bài...' : 'Nộp bài & Chấm điểm'}
                            </button>
                        </>
                    ) : (
                        // RESULT VIEW
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                <h3 className="font-bold text-xl text-slate-800">Kết quả đánh giá</h3>
                                <div className="flex items-center gap-2">
                                     <span className="text-slate-500 text-sm">Score:</span>
                                     <span className={`text-3xl font-bold ${feedback?.score! >= 8 ? 'text-emerald-600' : 'text-yellow-600'}`}>{feedback?.score}/10</span>
                                </div>
                            </div>

                            {/* General Comment */}
                            <div className="bg-slate-50 p-4 rounded-lg mb-6 italic text-slate-700 border-l-4 border-slate-300">
                                "{feedback?.generalComment}"
                            </div>

                            {/* Correction */}
                            <div className="mb-6">
                                <h4 className="font-bold text-emerald-700 mb-2">Bài viết đã sửa (Corrected Version):</h4>
                                <div className="p-4 bg-emerald-50 rounded-lg text-emerald-900 leading-relaxed">
                                    {feedback?.correctedText}
                                </div>
                            </div>

                            {/* Mistakes Analysis */}
                            {feedback?.grammarMistakes && feedback.grammarMistakes.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-red-600 mb-2">Lỗi ngữ pháp & Sửa lỗi:</h4>
                                    <div className="space-y-3">
                                        {feedback.grammarMistakes.map((mistake, idx) => (
                                            <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-100">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                                    <span className="line-through text-red-400">{mistake.original}</span>
                                                    <span className="text-slate-400 hidden md:inline">→</span>
                                                    <span className="font-bold text-emerald-600">{mistake.correction}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 italic">💡 {mistake.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Vocabulary Suggestions */}
                            {feedback?.vocabularySuggestions && feedback.vocabularySuggestions.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-bold text-indigo-600 mb-2">Gợi ý từ vựng nâng cao:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {feedback.vocabularySuggestions.map((word, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                             <button 
                                onClick={handleRetry}
                                className="w-full py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Luyện tập tiếp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WritingPractice;

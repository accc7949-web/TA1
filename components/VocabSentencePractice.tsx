
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateSentencePracticeTask, evaluateWriting } from '../services/gemini';
import { WritingFeedback, Flashcard } from '../types';
import Header from './common/Header';
import InteractiveText from './common/InteractiveText';

interface VocabSentencePracticeProps {
    vocabulary: Flashcard[];
    onBack: () => void;
    showDetail: (word: string) => void;
}

const CHUNK_SIZE = 10;

// Helper to split array into chunks
const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunked: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
};

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

type PracticePhase = 'GENERATING_TASK' | 'INPUT' | 'EVALUATING' | 'FEEDBACK' | 'REWRITE_CORRECTION';

const VocabSentencePractice: React.FC<VocabSentencePracticeProps> = ({ vocabulary, onBack, showDetail }) => {
    // Session State
    const [chunks, setChunks] = useState<Flashcard[][]>([]);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    const [queue, setQueue] = useState<Flashcard[]>([]); // The current working queue for the chunk
    
    // Card State
    const [currentWord, setCurrentWord] = useState<Flashcard | null>(null);
    const [taskText, setTaskText] = useState('');
    
    // User Interaction State
    const [userText, setUserText] = useState('');
    const [rewriteText, setRewriteText] = useState(''); // For the mandatory rewrite phase
    const [phase, setPhase] = useState<PracticePhase>('GENERATING_TASK');
    const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
    
    const [isFinished, setIsFinished] = useState(false);

    // Initialize Session
    useEffect(() => {
        const shuffled = shuffleArray(vocabulary);
        if (shuffled.length === 0) {
            setIsFinished(true);
            return;
        }
        const chunkedData = chunkArray(shuffled, CHUNK_SIZE);
        setChunks(chunkedData);
        setCurrentChunkIndex(0);
        setQueue(chunkedData[0]); // Load first chunk
    }, [vocabulary]);

    // Trigger task generation when queue or chunk changes
    useEffect(() => {
        if (queue.length > 0 && !currentWord && phase === 'GENERATING_TASK') {
            const nextWord = queue[0];
            setCurrentWord(nextWord);
            generateNewTask(nextWord);
        } else if (queue.length === 0 && chunks.length > 0 && phase === 'GENERATING_TASK') {
            // Chunk finished
            if (currentChunkIndex < chunks.length - 1) {
                // Move to next chunk
                const nextIndex = currentChunkIndex + 1;
                setCurrentChunkIndex(nextIndex);
                setQueue(chunks[nextIndex]);
                setCurrentWord(null); // Reset to trigger generation
            } else {
                // All chunks finished
                setIsFinished(true);
            }
        }
    }, [queue, chunks, currentChunkIndex, phase, currentWord]);

    const generateNewTask = async (word: Flashcard) => {
        setTaskText('');
        setUserText('');
        setFeedback(null);
        
        const text = await generateSentencePracticeTask(word.word.split('(')[0].trim(), word.meaning);
        
        if (text) {
            setTaskText(text);
            setPhase('INPUT');
        } else {
            // Error handling: Skip this word if generation fails to avoid getting stuck
            setQueue(prev => prev.slice(1));
            setCurrentWord(null);
        }
    };

    const handleSubmit = async () => {
        if (!userText.trim() || !currentWord) return;
        setPhase('EVALUATING');
        
        const prompt = `Translate this sentence to English, using the word "${currentWord.word}": ${taskText}`;
        const result = await evaluateWriting(prompt, userText);
        
        if (result) {
            setFeedback(result);
            setPhase('FEEDBACK');
        } else {
            // Error handling
            alert("Có lỗi khi chấm điểm. Vui lòng thử lại.");
            setPhase('INPUT');
        }
    };

    const handleContinue = () => {
        if (!feedback) return;

        // Threshold for "Correct" is 8/10
        const isCorrect = feedback.score >= 8;

        if (isCorrect) {
            // Remove current word from queue (Success)
            setQueue(prev => prev.slice(1));
            setCurrentWord(null); // Reset for next loop
            setPhase('GENERATING_TASK');
        } else {
            // Incorrect: Move to Rewrite Phase
            setPhase('REWRITE_CORRECTION');
            setRewriteText('');
        }
    };

    const handleRewriteSubmit = () => {
        if (!feedback) return;

        // Simple normalization for comparison (ignore case and simple punctuation)
        const normalize = (str: string) => str.toLowerCase().replace(/[.,!?;]/g, '').trim();
        const target = normalize(feedback.correctedText);
        const input = normalize(rewriteText);

        if (target === input) {
            // Correctly rewritten.
            // Move word to back of queue (Re-queue for retry later)
            if (currentWord) {
                setQueue(prev => [...prev.slice(1), currentWord]);
            }
            setCurrentWord(null);
            setPhase('GENERATING_TASK');
        } else {
            alert("Bạn chép chưa đúng hoàn toàn. Hãy chú ý chính tả và dấu câu.");
        }
    };

    // Helper to get raw word without (n) (v)
    const getCleanWord = (w?: Flashcard) => w ? w.word.split('(')[0].trim() : '';

    if (isFinished) {
        return (
            <div className="flex flex-col items-center text-center">
                <Header title="Hoàn thành!" onBackToMenu={onBack} />
                <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md animate-fade-in-up">
                    <div className="mb-6 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Xuất sắc!</h2>
                    <p className="text-xl text-slate-600 mt-4">Bạn đã hoàn thành và nắm vững tất cả các từ trong bài học này.</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button onClick={() => window.location.reload()} className="w-full px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors">
                           Luyện tập lại
                        </button>
                        <button onClick={onBack} className="w-full px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
                           Về menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (phase === 'GENERATING_TASK' || !currentWord) {
        return (
             <div className="flex flex-col items-center w-full min-h-screen">
                <Header title="Luyện Đặt Câu" onBackToMenu={onBack} />
                <div className="flex flex-col items-center justify-center flex-grow">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
                    <p className="text-slate-500 text-lg">AI đang tạo câu hỏi...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-12">
            <Header title="Luyện Đặt Câu" onBackToMenu={onBack} />
            <div className="w-full max-w-3xl px-4">
                
                {/* Progress Bar */}
                <div className="mb-6 flex items-center justify-between text-sm text-slate-500 font-medium">
                    <span>Lượt {currentChunkIndex + 1} / {chunks.length}</span>
                    <span>Hàng chờ: {queue.length} câu</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
                    <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(5, ((CHUNK_SIZE - queue.length) / CHUNK_SIZE) * 100)}%` }} // Approximate progress within chunk
                    ></div>
                </div>

                {/* Task Box */}
                <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg mb-6 relative">
                     <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                        Dịch câu sau (sử dụng từ <span className="underline text-white font-bold text-lg mx-1">{getCleanWord(currentWord)}</span>)
                    </h3>
                    <div className="text-xl leading-relaxed font-medium">
                       {taskText}
                    </div>
                </div>

                {/* Interaction Area */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                    
                    {/* INPUT PHASE */}
                    {phase === 'INPUT' && (
                        <div className="animate-fade-in-up">
                             <textarea 
                                value={userText}
                                onChange={(e) => setUserText(e.target.value)}
                                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none min-h-[150px] font-medium text-slate-900 bg-white placeholder-slate-400"
                                placeholder="Viết bản dịch tiếng Anh của bạn tại đây..."
                                autoFocus
                            />
                            <button 
                                onClick={handleSubmit}
                                disabled={!userText.trim()}
                                className="mt-4 w-full py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-lg"
                            >
                                Nộp bài
                            </button>
                        </div>
                    )}

                    {/* EVALUATING PHASE */}
                    {phase === 'EVALUATING' && (
                        <div className="flex flex-col items-center justify-center py-12">
                             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
                             <p className="text-slate-500">AI đang chấm điểm ngữ pháp và ngữ nghĩa...</p>
                        </div>
                    )}

                    {/* FEEDBACK PHASE */}
                    {phase === 'FEEDBACK' && feedback && (
                        <div className="animate-fade-in-up">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                <h3 className={`font-bold text-xl ${feedback.score >= 8 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {feedback.score >= 8 ? 'Chính xác! 🎉' : 'Chưa chính xác 😔'}
                                </h3>
                                <div className="flex items-center gap-2">
                                     <span className="text-slate-500 text-sm">Điểm:</span>
                                     <span className={`text-3xl font-bold ${feedback.score >= 8 ? 'text-emerald-600' : 'text-red-600'}`}>{feedback.score}/10</span>
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-lg mb-6 italic border-l-4 ${feedback.score >= 8 ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
                                "{feedback.generalComment}"
                            </div>

                            {feedback.score < 8 && (
                                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <h4 className="font-bold text-orange-800 mb-2">Đáp án đúng (Tham khảo):</h4>
                                    <p className="text-lg text-orange-900 font-bold">{feedback.correctedText}</p>
                                </div>
                            )}

                             {feedback.grammarMistakes && feedback.grammarMistakes.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-red-600 mb-2">Lỗi sai chi tiết:</h4>
                                    <div className="space-y-2">
                                        {feedback.grammarMistakes.map((mistake, idx) => (
                                            <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                                                <div className="flex flex-wrap gap-2 mb-1">
                                                    <span className="line-through text-red-400">{mistake.original}</span>
                                                    <span>→</span>
                                                    <span className="font-bold text-emerald-600">{mistake.correction}</span>
                                                </div>
                                                <p className="text-slate-600 italic">{mistake.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handleContinue}
                                className={`w-full py-4 text-white font-bold rounded-lg shadow-lg transition-colors ${feedback.score >= 8 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-800'}`}
                            >
                                {feedback.score >= 8 ? 'Tiếp tục (Đã thuộc)' : 'Sửa lỗi & Học lại'}
                            </button>
                        </div>
                    )}

                    {/* REWRITE PHASE (For incorrect answers) */}
                    {phase === 'REWRITE_CORRECTION' && feedback && (
                        <div className="animate-fade-in-up">
                            <div className="mb-4 text-center">
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Chép chính tả để ghi nhớ</span>
                            </div>
                            <p className="text-slate-600 mb-4 text-center">Hãy gõ lại chính xác câu đúng bên dưới:</p>
                            
                            <div className="bg-slate-100 p-4 rounded-lg mb-6 text-center">
                                <p className="text-lg font-bold text-slate-800 select-none">{feedback.correctedText}</p>
                            </div>

                             <input 
                                type="text"
                                value={rewriteText}
                                onChange={(e) => setRewriteText(e.target.value)}
                                className="w-full p-4 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium text-slate-900 bg-white placeholder-slate-400 mb-4 text-center"
                                placeholder="Gõ lại câu đúng ở đây..."
                                autoFocus
                                onPaste={(e) => {
                                    e.preventDefault();
                                    alert("Đừng copy paste, hãy tự gõ để nhớ lâu hơn! 😉");
                                }}
                            />
                            
                            <button 
                                onClick={handleRewriteSubmit}
                                disabled={!rewriteText.trim()}
                                className="w-full py-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
                            >
                                Kiểm tra & Đưa vào hàng chờ
                            </button>
                            <p className="text-xs text-center text-slate-400 mt-3">Câu này sẽ xuất hiện lại trong lượt này cho đến khi bạn làm đúng.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default VocabSentencePractice;

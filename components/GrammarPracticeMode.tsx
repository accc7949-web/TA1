
import React, { useState, useEffect, useCallback } from 'react';
import { generateGrammarQuiz, generateErrorCorrectionQuiz, generateNuanceQuiz, evaluateQuizPerformance } from '../services/gemini';
import { GrammarTopic, DifficultyLevel, QuizResult, GrammarAssessment, GrammarQuestion, PracticeType, ErrorCorrectionQuestion, GrammarNuanceQuestion } from '../types';
import Header from './common/Header';
import InteractiveText from './common/InteractiveText';
import GrammarAiChat from './GrammarAiChat'; // Import Chat component

interface GrammarPracticeModeProps {
  topic: GrammarTopic;
  difficulty: DifficultyLevel;
  questionCount: number;
  practiceType?: PracticeType; // NEW PROP
  onBack: () => void;
  showDetail: (word: string) => void;
}

const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const SpeakerWaveIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);
const SpeakerXMarkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);

const GrammarPracticeMode: React.FC<GrammarPracticeModeProps> = ({ topic, difficulty, questionCount, practiceType = 'MULTIPLE_CHOICE', onBack, showDetail }) => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  
  // MCQ State
  const [mcqQuestions, setMcqQuestions] = useState<GrammarQuestion[]>([]);
  
  // Error Correction State
  const [errorQuestions, setErrorQuestions] = useState<ErrorCorrectionQuestion[]>([]);
  const [userCorrectionInput, setUserCorrectionInput] = useState('');
  const [correctionPhase, setCorrectionPhase] = useState<'FIND' | 'FIX' | 'DONE'>('FIND');

  // Nuance State
  const [nuanceQuestions, setNuanceQuestions] = useState<GrammarNuanceQuestion[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [assessment, setAssessment] = useState<GrammarAssessment | null>(null);
  const [showChat, setShowChat] = useState(false); // State for Chat Modal

  const speak = (text: string) => {
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          window.speechSynthesis.speak(utterance);
      }
  };

  const loadQuiz = useCallback(async () => {
      setLoading(true);
      if (practiceType === 'MULTIPLE_CHOICE') {
          const subTopicNames = topic.subTopics?.map(st => st.title);
          const data = await generateGrammarQuiz(topic.title, difficulty, questionCount, subTopicNames, topic.summary);
          if (data) setMcqQuestions(data);
      } else if (practiceType === 'ERROR_CORRECTION') {
          const data = await generateErrorCorrectionQuiz(topic.title, difficulty, questionCount, topic.summary);
          if (data) setErrorQuestions(data);
      } else if (practiceType === 'EXPLAIN_DIFFERENCE') {
          const data = await generateNuanceQuiz(topic.title, questionCount, topic.summary);
          if (data) setNuanceQuestions(data);
      }
      setLoading(false);
  }, [topic, difficulty, questionCount, practiceType]);

  useEffect(() => {
      loadQuiz();
  }, [loadQuiz]);

  const handleMcqAnswer = (option: string) => {
      if (selectedAnswer) return;
      setSelectedAnswer(option);
      const currentQ = mcqQuestions[currentIndex];
      const isCorrect = option === currentQ.correctAnswer;
      const newResult = { question: currentQ.question, userAnswer: option, correctAnswer: currentQ.correctAnswer, isCorrect };
      setResults(prev => [...prev, newResult]);
      if (autoPlayAudio) {
          speak(currentQ.question.replace(/_+/g, option));
      }
  };

  const handleNuanceAnswer = (optionIndex: number) => {
      if (selectedAnswer) return;
      const currentQ = nuanceQuestions[currentIndex];
      const selectedText = currentQ.options[optionIndex].text;
      const correctText = currentQ.options[currentQ.correctOptionIndex].text;
      
      setSelectedAnswer(selectedText);
      const isCorrect = optionIndex === currentQ.correctOptionIndex;
      const newResult = { question: currentQ.contextQuestion, userAnswer: selectedText, correctAnswer: correctText, isCorrect };
      setResults(prev => [...prev, newResult]);
  }

  // --- Logic for Error Correction ---
  const handleErrorWordClick = (clickedWord: string) => {
      if (correctionPhase !== 'FIND') return;

      const currentQ = errorQuestions[currentIndex];
      // Simple normalization: remove punctuation
      const cleanClicked = clickedWord.replace(/[.,!?;:"']$/g, '').trim().toLowerCase();
      const cleanTarget = currentQ.errorTarget.replace(/[.,!?;:"']$/g, '').trim().toLowerCase();
      
      if (cleanClicked.includes(cleanTarget) || cleanTarget.includes(cleanClicked)) {
          // Correct word found!
          setCorrectionPhase('FIX');
      } else {
          // Wrong word clicked
          const btn = document.getElementById(`word-${currentIndex}-${clickedWord}`);
          if(btn) {
              btn.classList.add('animate-shake', 'bg-red-200');
              setTimeout(() => btn.classList.remove('animate-shake', 'bg-red-200'), 500);
          }
      }
  };

  const handleSubmitCorrection = () => {
      if (!userCorrectionInput.trim()) return;
      
      const currentQ = errorQuestions[currentIndex];
      const isCorrect = userCorrectionInput.trim().toLowerCase() === currentQ.correctForm.trim().toLowerCase();
      
      setCorrectionPhase('DONE');
      const newResult = { 
          question: currentQ.sentence, 
          userAnswer: `Found: ${currentQ.errorTarget} -> Fixed: ${userCorrectionInput}`, 
          correctAnswer: `Found: ${currentQ.errorTarget} -> Fixed: ${currentQ.correctForm}`, 
          isCorrect 
      };
      setResults(prev => [...prev, newResult]);
  };
  // ----------------------------------

  const handleNext = async () => {
      let totalLen = 0;
      if (practiceType === 'MULTIPLE_CHOICE') totalLen = mcqQuestions.length;
      else if (practiceType === 'ERROR_CORRECTION') totalLen = errorQuestions.length;
      else totalLen = nuanceQuestions.length;
      
      if (currentIndex < totalLen - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setCorrectionPhase('FIND');
          setUserCorrectionInput('');
      } else {
          setLoadingAction(true);
          const evalResult = await evaluateQuizPerformance(topic.title, results);
          setAssessment(evalResult);
          setIsFinished(true);
          setLoadingAction(false);
      }
  };

  if (loading) return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header title={topic.title} onBackToMenu={onBack} />
      <div className="flex flex-col items-center justify-center flex-grow animate-pulse">
        <BrainIcon />
        <p className="text-slate-500 mt-4 text-lg">AI đang tạo {questionCount} câu hỏi {practiceType === 'MULTIPLE_CHOICE' ? 'trắc nghiệm' : practiceType === 'ERROR_CORRECTION' ? 'tìm lỗi sai' : 'tư duy ngữ cảnh'}...</p>
        <p className="text-xs text-slate-400 mt-2 italic">(Bao gồm: {topic.subTopics?.map(s => s.title.split('.')[1].trim()).join(', ') || topic.summary})</p>
      </div>
    </div>
  );

  if (isFinished) return (
    <div className="flex flex-col items-center text-center w-full min-h-screen">
      <Header title="Hoàn thành!" onBackToMenu={onBack} />
      <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md animate-fade-in-up mt-10 border border-slate-100">
        <div className="text-blue-500 mb-6 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Kết quả</h2>
        <div className="text-6xl font-bold text-blue-600 mb-8">{results.filter(r => r.isCorrect).length}/{questionCount}</div>
        {assessment && <p className="italic text-slate-500 mb-8 border-l-4 border-blue-100 pl-4 text-left">"{assessment.generalComment}"</p>}
        
        <button onClick={loadQuiz} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl mb-3 hover:bg-blue-700 shadow-md transition-all">Luyện tập lại</button>
        <button onClick={onBack} className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Chọn chuyên đề khác</button>
      </div>
    </div>
  );

  // RENDER BASED ON TYPE
  if (practiceType === 'MULTIPLE_CHOICE') {
      const currentQ = mcqQuestions[currentIndex];
      const isCorrect = selectedAnswer === currentQ.correctAnswer;

      return (
        <div className="flex flex-col items-center w-full min-h-screen pb-20 relative">
          <Header title={topic.title} onBackToMenu={onBack} />
           {showChat && (
              <div className="fixed inset-0 z-50 bg-white animate-fade-in">
                  <GrammarAiChat topic={topic} onBack={() => setShowChat(false)} />
              </div>
          )}

          <div className="w-full max-w-3xl px-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">Câu {currentIndex + 1} / {questionCount}</span>
                    <div className="flex gap-2">
                        <button onClick={() => speak(currentQ.question || '')} className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"><SpeakerWaveIcon className="text-slate-500"/></button>
                        <button onClick={() => setAutoPlayAudio(!autoPlayAudio)} className={`p-2 rounded-full border transition-all ${autoPlayAudio ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-400'}`}>{autoPlayAudio ? <span className="text-[10px] font-bold">AUTO</span> : <SpeakerXMarkIcon/>}</button>
                    </div>
                </div>
                
                <div className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                    <InteractiveText text={currentQ.question} showDetail={showDetail} />
                </div>

                <div className="space-y-3">
                    {currentQ.options.map((opt, i) => {
                        const isOptionCorrect = opt === currentQ.correctAnswer;
                        const isSel = selectedAnswer === opt;
                        let cls = "border-slate-100 hover:border-blue-300 hover:bg-blue-50";
                        if (selectedAnswer) {
                            if (isOptionCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-sm";
                            else if (isSel) cls = "border-red-500 bg-red-50 text-red-800";
                            else cls = "opacity-40 border-slate-100";
                        }
                        return (
                            <button 
                                key={i} 
                                onClick={() => handleMcqAnswer(opt)} 
                                disabled={!!selectedAnswer} 
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 text-lg ${cls}`}
                            >
                                <span className="inline-block w-8 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {selectedAnswer && (
                    <div className="mt-8 animate-fade-in-up">
                        <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500 mb-4">
                            <p className="text-xs uppercase font-bold text-amber-600 mb-1">Dịch nghĩa:</p>
                            <p className="text-slate-700 font-medium italic">"{currentQ.questionTranslation}"</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500 mb-4 shadow-sm">
                            <p className="text-xs uppercase font-bold text-purple-600 mb-2 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Dấu hiệu nhận biết & Công thức
                            </p>
                            <p className="text-lg font-bold text-purple-900">{currentQ.relatedTheory}</p>
                        </div>
                        {!isCorrect && (
                            <div className="p-4 bg-red-50 rounded-xl text-sm text-red-900 mb-6 border border-red-100">
                                <p className="font-bold mb-1 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Tại sao sai? (Giải thích chi tiết)
                                </p>
                                <p>{currentQ.explanation}</p>
                            </div>
                        )}
                        <button onClick={handleNext} className="w-full py-5 bg-slate-800 text-white font-extrabold rounded-2xl hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
                            {currentIndex < mcqQuestions.length - 1 ? 'Tiếp tục câu tiếp theo' : 'Xem kết quả bài làm'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                )}
            </div>
          </div>
          <button onClick={() => setShowChat(true)} className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-pink-600 transition-all transform hover:scale-110 z-40 border-2 border-white/20"><span className="text-2xl">🤖</span></button>
        </div>
      );
  } else if (practiceType === 'ERROR_CORRECTION') {
      // RENDER ERROR CORRECTION
      const currentQ = errorQuestions[currentIndex];
      const isCorrect = results[currentIndex]?.isCorrect;

      return (
        <div className="flex flex-col items-center w-full min-h-screen pb-20 relative">
          <Header title="Tìm lỗi sai" onBackToMenu={onBack} />
           {showChat && (
              <div className="fixed inset-0 z-50 bg-white animate-fade-in">
                  <GrammarAiChat topic={topic} onBack={() => setShowChat(false)} />
              </div>
          )}

          <div className="w-full max-w-3xl px-4">
             <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                 <div className="flex justify-between items-center mb-6">
                    <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">Câu {currentIndex + 1} / {questionCount}</span>
                </div>
                
                {/* INSTRUCTION */}
                <p className="text-slate-500 mb-4 italic text-center">
                    {correctionPhase === 'FIND' 
                        ? "Click vào MỘT từ bị sai trong câu dưới đây:" 
                        : correctionPhase === 'FIX' 
                            ? "Nhập từ đúng vào ô bên dưới:" 
                            : "Kết quả chi tiết:"}
                </p>

                {/* SENTENCE DISPLAY */}
                <div className="text-2xl md:text-3xl font-serif text-slate-800 mb-8 leading-relaxed text-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                    {currentQ.sentence.split(/(\s+)/).map((word, idx) => {
                        if (/^\s+$/.test(word)) return <span key={idx}>{word}</span>;
                        
                        // Highlight logic for results
                        let style = "cursor-pointer hover:text-orange-600 transition-colors rounded px-1 ";
                        const cleanWord = word.replace(/[.,!?;:"']$/g, '').trim().toLowerCase();
                        const cleanTarget = currentQ.errorTarget.replace(/[.,!?;:"']$/g, '').trim().toLowerCase();
                        
                        if (correctionPhase === 'DONE') {
                            if (cleanWord.includes(cleanTarget) || cleanTarget.includes(cleanWord)) {
                                style = "bg-red-200 text-red-800 font-bold line-through decoration-red-500 decoration-2";
                            } else if (cleanWord === currentQ.correctForm.toLowerCase()) {
                                 // Try to highlight correction if inserted (not easy with this map logic, simplified)
                            }
                        } else if (correctionPhase === 'FIX') {
                             if (cleanWord.includes(cleanTarget) || cleanTarget.includes(cleanWord)) {
                                style = "bg-orange-200 text-orange-800 font-bold border-b-4 border-orange-500";
                            }
                        }

                        return (
                            <span 
                                id={`word-${currentIndex}-${word}`}
                                key={idx} 
                                onClick={() => handleErrorWordClick(word)}
                                className={style}
                            >
                                {word}
                            </span>
                        );
                    })}
                </div>

                {/* INTERACTION AREA */}
                {correctionPhase === 'FIX' && (
                    <div className="animate-fade-in-up">
                        <div className="flex flex-col gap-3">
                             <input 
                                type="text" 
                                value={userCorrectionInput}
                                onChange={(e) => setUserCorrectionInput(e.target.value)}
                                placeholder="Gõ từ đã sửa vào đây..."
                                className="p-4 border-2 border-orange-300 rounded-xl text-center text-xl focus:ring-4 focus:ring-orange-200 outline-none font-bold text-slate-700"
                                autoFocus
                            />
                            <button 
                                onClick={handleSubmitCorrection}
                                className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-colors"
                            >
                                Sửa lỗi
                            </button>
                        </div>
                    </div>
                )}

                {/* RESULT AREA */}
                {correctionPhase === 'DONE' && (
                    <div className="animate-fade-in-up">
                        <div className={`p-4 rounded-xl border-l-4 mb-4 ${isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-red-50 border-red-500 text-red-900'}`}>
                             <div className="font-bold text-lg mb-2">
                                {isCorrect ? 'Chính xác! 🎉' : 'Chưa đúng rồi 😓'}
                             </div>
                             <div className="flex items-center gap-2 text-lg">
                                 <span className="line-through opacity-70">{currentQ.errorTarget}</span>
                                 <span>➔</span>
                                 <span className="font-bold">{currentQ.correctForm}</span>
                             </div>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500 mb-4 shadow-sm">
                            <p className="text-xs uppercase font-bold text-purple-600 mb-2 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Giải thích & Công thức
                            </p>
                            <p className="text-base text-purple-900 mb-2">{currentQ.explanation}</p>
                            <p className="font-mono text-sm bg-purple-100 p-2 rounded inline-block font-bold">{currentQ.relatedTheory}</p>
                        </div>

                         <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500 mb-4">
                            <p className="text-xs uppercase font-bold text-amber-600 mb-1">Dịch nghĩa:</p>
                            <p className="text-slate-700 font-medium italic">"{currentQ.translation}"</p>
                        </div>

                        <button onClick={handleNext} className="w-full py-5 bg-slate-800 text-white font-extrabold rounded-2xl hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
                            {currentIndex < errorQuestions.length - 1 ? 'Tiếp tục câu tiếp theo' : 'Xem kết quả bài làm'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                )}
             </div>
          </div>
          <button onClick={() => setShowChat(true)} className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-pink-600 transition-all transform hover:scale-110 z-40 border-2 border-white/20"><span className="text-2xl">🤖</span></button>
        </div>
      );
  } else {
      // RENDER NUANCE / CONTEXT
      const currentQ = nuanceQuestions[currentIndex];
      const isCorrect = results[currentIndex]?.isCorrect;

      return (
        <div className="flex flex-col items-center w-full min-h-screen pb-20 relative">
          <Header title="Tư duy Ngữ cảnh" onBackToMenu={onBack} />
           {showChat && (
              <div className="fixed inset-0 z-50 bg-white animate-fade-in">
                  <GrammarAiChat topic={topic} onBack={() => setShowChat(false)} />
              </div>
          )}

          <div className="w-full max-w-4xl px-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">Câu {currentIndex + 1} / {questionCount}</span>
                </div>
                
                {/* QUESTION CONTEXT */}
                <div className="mb-8">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Câu hỏi thực tế (Reality Check)</p>
                    <h3 className="text-2xl font-bold text-slate-800 leading-snug">
                        {currentQ.contextQuestion}
                    </h3>
                </div>

                {/* OPTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQ.options.map((opt, i) => {
                        const isOptionCorrect = i === currentQ.correctOptionIndex;
                        const isSel = selectedAnswer === opt.text;
                        let cls = "border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700";
                        if (selectedAnswer) {
                            if (isOptionCorrect) cls = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-200";
                            else if (isSel) cls = "border-red-500 bg-red-50 text-red-900 opacity-60";
                            else cls = "border-slate-100 opacity-50";
                        }
                        return (
                            <button 
                                key={i} 
                                onClick={() => handleNuanceAnswer(i)} 
                                disabled={!!selectedAnswer} 
                                className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 text-lg shadow-sm flex flex-col h-full ${cls}`}
                            >
                                <span className="inline-block font-black text-2xl mb-2 opacity-50">{String.fromCharCode(65 + i)}</span>
                                <span className="flex-grow">{opt.text}</span>
                                
                                {/* Reveal nuance after selection */}
                                {selectedAnswer && (
                                    <div className={`mt-4 pt-4 border-t border-black/10 text-sm font-medium italic animate-fade-in`}>
                                        👉 {opt.nuance}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* EXPLANATION */}
                {selectedAnswer && (
                    <div className="mt-8 animate-fade-in-up">
                        <div className={`p-5 rounded-xl border-l-4 mb-6 ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
                             <h4 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                                {isCorrect ? 'Chính xác! Tư duy rất tốt.' : 'Chưa đúng rồi.'}
                             </h4>
                             <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
                        </div>

                        <button onClick={handleNext} className="w-full py-5 bg-slate-800 text-white font-extrabold rounded-2xl hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
                            {currentIndex < nuanceQuestions.length - 1 ? 'Tiếp tục câu tiếp theo' : 'Xem kết quả bài làm'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                )}
            </div>
          </div>
          <button onClick={() => setShowChat(true)} className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-pink-600 transition-all transform hover:scale-110 z-40 border-2 border-white/20"><span className="text-2xl">🤖</span></button>
        </div>
      );
  }
};

export default GrammarPracticeMode;

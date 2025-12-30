import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ALL_VOCABULARY } from '../constants';
import { Flashcard } from '../types';
import Header from './common/Header';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const QuizEnToVi: React.FC<{ vocabulary: Flashcard[]; onBackToMenu: () => void }> = ({ vocabulary, onBackToMenu }) => {
  const [questions, setQuestions] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const speak = useCallback((word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const wordToSpeak = word.split('(')[0].trim();
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  }, []);

  const generateOptions = useCallback((correctCard: Flashcard) => {
    const otherMeanings = ALL_VOCABULARY.filter(card => card.id !== correctCard.id)
                                    .map(card => card.meaning);
    const shuffledMeanings = shuffleArray(otherMeanings).slice(0, 3);
    setOptions(shuffleArray([correctCard.meaning, ...shuffledMeanings]));
  }, []);

  const startQuiz = useCallback(() => {
    const shuffledQuestions = shuffleArray(vocabulary);
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsFinished(false);
    generateOptions(shuffledQuestions[0]);
  }, [generateOptions, vocabulary]);

  useEffect(() => {
    startQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabulary]);
  
  useEffect(() => {
    if (currentQuestion) {
      speak(currentQuestion.word);
    }
  }, [currentQuestion, speak]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    if (answer === currentQuestion.meaning) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      generateOptions(questions[nextIndex]);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center text-center">
        <Header title="Quiz Results" onBackToMenu={onBackToMenu} />
        <div className="p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-slate-700">Quiz Complete!</h2>
          <p className="text-xl text-slate-500 mt-4">Your score is</p>
          <p className="text-6xl font-bold text-emerald-500 my-4">{score} / {questions.length}</p>
          <div className="flex gap-4 mt-8">
            <button onClick={startQuiz} className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-colors">
              Try Again
            </button>
            <button onClick={onBackToMenu} className="px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
              Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full">
      <Header title="Word to Meaning" onBackToMenu={onBackToMenu} />
      <div className="w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <p className="text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
        <div className="flex items-center justify-center gap-4">
            <p className="text-4xl font-bold my-4 text-slate-800">{currentQuestion.word}</p>
            <button 
                onClick={() => speak(currentQuestion.word)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Pronounce word"
            >
                <SpeakerIcon className="text-slate-500 h-7 w-7" />
            </button>
        </div>
        <p className="text-xl text-slate-400">{currentQuestion.pronunciation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
        {options.map(option => {
          const isCorrect = option === currentQuestion.meaning;
          const isSelected = selectedAnswer === option;
          let buttonClass = 'p-4 bg-white rounded-lg shadow hover:bg-slate-100 transition-colors text-lg text-left';
          if (selectedAnswer) {
            if (isCorrect) {
              buttonClass = 'p-4 bg-emerald-500 text-white rounded-lg shadow-lg';
            } else if (isSelected) {
              buttonClass = 'p-4 bg-red-500 text-white rounded-lg shadow-lg';
            } else {
               buttonClass = 'p-4 bg-slate-200 text-slate-500 rounded-lg shadow cursor-not-allowed';
            }
          }
          return (
            <button key={option} onClick={() => handleAnswer(option)} disabled={!!selectedAnswer} className={buttonClass}>
              {option}
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <button onClick={handleNext} className="mt-8 px-8 py-4 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 transition-colors text-xl">
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
};

export default QuizEnToVi;

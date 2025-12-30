import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './common/Header';
import { Flashcard, RelatedWord } from '../types';
import WordDefinitionModal from './common/WordDefinitionModal';
import InteractiveText from './common/InteractiveText';

const TURNS = 3;

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  let index = 0;
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
}

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" />
    </svg>
);


const FlashcardMode: React.FC<{ vocabulary: Flashcard[]; onBackToMenu: () => void; showDetail: (word: string) => void; }> = ({ vocabulary, onBackToMenu, showDetail }) => {
  const [allTurns, setAllTurns] = useState<Flashcard[][]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [isTurnComplete, setIsTurnComplete] = useState(false);
  const [selectedWord, setSelectedWord] = useState<RelatedWord | null>(null);
  const notRememberedRef = useRef<Flashcard[]>([]);

  const startTurn = useCallback((turnIndex: number, turnsData: Flashcard[][]) => {
    if (!turnsData[turnIndex]) return;
    setDeck(shuffleArray(turnsData[turnIndex]));
    setCurrentTurnIndex(turnIndex);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsTurnComplete(false);
    notRememberedRef.current = [];
  }, []);

  const startNewSession = useCallback(() => {
    const shuffledVocab = shuffleArray(vocabulary);
    const chunkSize = Math.ceil(shuffledVocab.length / TURNS);
    const turnsData = chunkArray(shuffledVocab, chunkSize);
    setAllTurns(turnsData);
    setIsSessionComplete(false);
    startTurn(0, turnsData);
  }, [startTurn, vocabulary]);

  useEffect(() => {
    startNewSession();
  }, [startNewSession]);

  const card = deck[currentIndex];

  const speak = useCallback((e?: React.MouseEvent, word?: string) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window && (word || card)) {
      window.speechSynthesis.cancel();
      const wordToSpeak = (word || card.word).split('(')[0].trim();
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  }, [card]);

  useEffect(() => {
    if (card && !isFlipped) {
      speak();
    }
  }, [card, isFlipped, speak]);

  const handleDecision = (remembered: boolean) => {
    setIsFlipped(false);

    setTimeout(() => {
      if (!remembered) {
        notRememberedRef.current.push(deck[currentIndex]);
      }

      if (currentIndex < deck.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        if (notRememberedRef.current.length > 0) {
          setDeck(shuffleArray(notRememberedRef.current));
          notRememberedRef.current = [];
          setCurrentIndex(0);
        } else {
            if (currentTurnIndex < TURNS - 1) {
                setIsTurnComplete(true);
            } else {
                setIsSessionComplete(true);
            }
        }
      }
    }, 150);
  };
  
  const handleNextTurn = () => {
    startTurn(currentTurnIndex + 1, allTurns);
  }

  const handleWordClick = (e: React.MouseEvent, word: RelatedWord) => {
    e.stopPropagation();
    setSelectedWord(word);
  };
  
  const handleShowDetail = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    showDetail(word);
  };

  if (isSessionComplete) {
    return (
      <div className="flex flex-col items-center text-center">
        <Header title="Học tập" onBackToMenu={onBackToMenu} />
        <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-emerald-600">Tuyệt vời!</h2>
          <p className="text-xl text-slate-600 mt-4">Bạn đã ghi nhớ thành công tất cả các từ.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={startNewSession} 
              className="flex items-center justify-center w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors"
            >
              <RefreshIcon />
              Ôn tập lại
            </button>
            <button 
              onClick={onBackToMenu} 
              className="w-full px-6 py-3 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition-colors"
            >
              Về menu chính
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTurnComplete) {
    return (
      <div className="flex flex-col items-center text-center">
        <Header title={`Hoàn thành Lượt ${currentTurnIndex + 1}`} onBackToMenu={onBackToMenu} />
        <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-sky-600">Hoàn thành!</h2>
          <p className="text-xl text-slate-600 mt-4">Bạn đã sẵn sàng cho lượt tiếp theo chưa?</p>
          <div className="mt-8">
            <button 
              onClick={handleNextTurn} 
              className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors"
            >
              Bắt đầu Lượt {currentTurnIndex + 2}
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  if (!card) return <div>Đang tải...</div>;

  return (
    <div className="flex flex-col items-center w-full">
      <Header title="Học tập" onBackToMenu={onBackToMenu} />
      {selectedWord && <WordDefinitionModal wordData={selectedWord} onClose={() => setSelectedWord(null)} showDetail={showDetail}/>}
      
      <div className="w-full" style={{ perspective: '1000px' }}>
        <div
          className="relative w-full h-96 transition-transform duration-500 cursor-pointer"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of Card */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 text-center" style={{ backfaceVisibility: 'hidden' }}>
            <button onClick={(e) => handleShowDetail(e, card.word.split('(')[0].trim())} className="text-3xl md:text-4xl font-bold text-slate-800 hover:text-sky-600 transition-colors">{card.word}</button>
            <p className="text-lg md:text-xl mt-2 text-slate-500">{card.pronunciation}</p>
            <button 
              onClick={(e) => speak(e)} 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Pronounce word"
            >
              <SpeakerIcon className="text-slate-500" />
            </button>
          </div>
          
          {/* Back of Card */}
          <div className="absolute w-full h-full bg-sky-500 text-white rounded-xl shadow-lg flex flex-col justify-center p-4 text-center overflow-y-auto" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="flex-grow flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-bold">{card.meaning}</p>

                {card.examples && card.examples.length > 0 && (
                    <div className="mt-2 text-sm italic text-sky-100 px-2">
                        <p className="font-bold not-italic text-sky-200 uppercase text-xs tracking-wider mb-1">Ví dụ</p>
                        {card.examples.map((ex, index) => (
                           <div key={index} className="leading-tight">"<InteractiveText text={ex} showDetail={showDetail} variant="on-dark" />"</div>
                        ))}
                    </div>
                )}
                
                {(card.synonyms?.length || card.antonyms?.length) && <hr className="my-3 border-sky-300 w-1/2 mx-auto" />}
                
                <div className="space-y-2 text-sm">
                    {card.synonyms && card.synonyms.length > 0 && (
                        <div>
                            <h4 className="font-bold text-sky-200 uppercase text-xs tracking-wider">Đồng nghĩa</h4>
                            <div className="flex flex-wrap justify-center gap-1 mt-1">
                                {card.synonyms.map(syn => (
                                    <button key={syn.word} onClick={(e) => handleWordClick(e, syn)} className="px-2 py-1 bg-sky-400 rounded hover:bg-sky-300 transition-colors text-xs">
                                        {syn.word} <span className="italic opacity-80">({syn.pos})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {card.antonyms && card.antonyms.length > 0 && (
                        <div>
                            <h4 className="font-bold text-sky-200 uppercase text-xs tracking-wider">Trái nghĩa</h4>
                            <div className="flex flex-wrap justify-center gap-1 mt-1">
                                {card.antonyms.map(ant => (
                                    <button key={ant.word} onClick={(e) => handleWordClick(e, ant)} className="px-2 py-1 bg-sky-400 rounded hover:bg-sky-300 transition-colors text-xs">
                                        {ant.word} <span className="italic opacity-80">({ant.pos})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button 
              onClick={(e) => speak(e)} 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-sky-400 transition-colors"
              aria-label="Pronounce word"
            >
              <SpeakerIcon className="text-white" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center w-full mt-4">
        <p className="text-slate-500 font-semibold">
            Lượt {currentTurnIndex + 1} / {TURNS}
        </p>
        <p className="text-slate-500">
            Từ {currentIndex + 1} / {deck.length}
        </p>
      </div>


      <div className="flex justify-between items-center w-full max-w-sm mt-4">
        <button 
          onClick={() => handleDecision(false)}
          className="flex flex-col items-center justify-center p-4 w-28 h-28 bg-red-100 text-red-600 rounded-full shadow-md hover:bg-red-200 transition-colors disabled:opacity-50"
          aria-label="Chưa nhớ"
          disabled={!isFlipped}
        >
          <XIcon />
          <span className="mt-1 text-sm font-semibold">Chưa nhớ</span>
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors"
        >
          Lật thẻ
        </button>
        <button 
          onClick={() => handleDecision(true)}
          className="flex flex-col items-center justify-center p-4 w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full shadow-md hover:bg-emerald-200 transition-colors disabled:opacity-50"
          aria-label="Đã nhớ"
          disabled={!isFlipped}
        >
          <CheckIcon />
           <span className="mt-1 text-sm font-semibold">Đã nhớ</span>
        </button>
      </div>
    </div>
  );
};

export default FlashcardMode;

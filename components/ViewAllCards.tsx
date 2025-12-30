import React, { useCallback, useState } from 'react';
import Header from './common/Header';
import { Flashcard, RelatedWord } from '../types';
import WordDefinitionModal from './common/WordDefinitionModal';
import InteractiveText from './common/InteractiveText';

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);


const ViewAllCards: React.FC<{ vocabulary: Flashcard[]; onBack: () => void; showDetail: (word: string) => void; }> = ({ vocabulary, onBack, showDetail }) => {
    const [selectedWord, setSelectedWord] = useState<RelatedWord | null>(null);

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

    return (
        <div className="w-full">
            <Header title="Tất cả từ vựng" onBackToMenu={onBack} />
            {selectedWord && <WordDefinitionModal wordData={selectedWord} onClose={() => setSelectedWord(null)} showDetail={showDetail} />}
            <div className="space-y-3 pb-8">
                {vocabulary.map(card => (
                    <div key={card.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                        <div className="flex-grow">
                            <h3 className="font-bold text-lg text-slate-800">
                                <button onClick={() => showDetail(card.word.split('(')[0].trim())} className="hover:text-sky-600 transition-colors text-left">{card.word}</button>
                            </h3>
                            <p className="text-slate-500 italic">{card.pronunciation}</p>
                            <p className="text-sky-700 font-semibold mt-1">{card.meaning}</p>
                            
                            {card.examples && card.examples.length > 0 && (
                                <div className="mt-2 text-sm text-slate-600 italic pl-3 border-l-2 border-slate-200 space-y-1">
                                    {card.examples.map((ex, index) => (
                                        <div key={index}>"<InteractiveText text={ex} showDetail={showDetail} />"</div>
                                    ))}
                                </div>
                            )}

                             {card.synonyms && card.synonyms.length > 0 && (
                                <div className="mt-2">
                                    <span className="font-semibold text-emerald-700 text-sm">Đồng nghĩa: </span>
                                    <div className="inline-flex flex-wrap gap-1 mt-1">
                                        {card.synonyms.map(syn => (
                                            <button key={syn.word} onClick={() => showDetail(syn.word)} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200 transition-colors text-sm">
                                                {syn.word} <span className="italic opacity-80">({syn.pos})</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {card.antonyms && card.antonyms.length > 0 && (
                                <div className="mt-1">
                                    <span className="font-semibold text-red-700 text-sm">Trái nghĩa: </span>
                                    <div className="inline-flex flex-wrap gap-1 mt-1">
                                        {card.antonyms.map(ant => (
                                            <button key={ant.word} onClick={() => showDetail(ant.word)} className="px-2 py-0.5 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm">
                                                {ant.word} <span className="italic opacity-80">({ant.pos})</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => speak(card.word)} 
                            className="p-3 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0 ml-4"
                            aria-label="Pronounce word"
                        >
                            <SpeakerIcon className="text-slate-500"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ViewAllCards;

import React, { useEffect, useState, useCallback } from 'react';
import { getWordDetails } from '../../services/gemini';
import { WordDetails } from '../../types';
import InteractiveText from './InteractiveText';

interface WordDetailModalProps {
  word: string;
  onClose: () => void;
  showDetail: (word: string) => void;
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const translatePartOfSpeech = (pos: string): string => {
    const lowerPos = pos.toLowerCase();
    switch (lowerPos) {
        case 'noun':
        case 'n':
            return 'Danh từ';
        case 'verb':
        case 'v':
            return 'Động từ';
        case 'adjective':
        case 'adj':
            return 'Tính từ';
        case 'adverb':
        case 'adv':
            return 'Trạng từ';
        case 'preposition':
            return 'Giới từ';
        case 'conjunction':
            return 'Liên từ';
        case 'phrasal verb':
            return 'Cụm động từ';
        default:
            return pos.charAt(0).toUpperCase() + pos.slice(1);
    }
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose, showDetail }) => {
    const [details, setDetails] = useState<WordDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            setDetails(null);
            const result = await getWordDetails(word);
            if (result) {
                setDetails(result);
            } else {
                setError("Không thể tải chi tiết của từ này. Vui lòng thử lại.");
            }
            setLoading(false);
        };
        fetchDetails();
    }, [word]);

    const speak = useCallback((textToSpeak: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-title-detail"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg text-left relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="sticky top-0 float-right -mt-1 -mr-1 p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors bg-white z-10"
          aria-label="Close"
        >
          <XIcon />
        </button>
        
        {loading && <div className="text-center p-8">Đang tải định nghĩa...</div>}
        {error && <div className="text-center p-8 text-red-600">{error}</div>}
        
        {details && (
            <div>
                 <div className="flex items-center gap-4 mb-2">
                    <h2 id="word-title-detail" className="text-3xl font-bold text-slate-800 capitalize">
                        {details.word}
                    </h2>
                     <button onClick={() => speak(details.word)} aria-label="Speak word">
                        <SpeakerIcon className="text-sky-600 hover:text-sky-800 transition-colors" />
                    </button>
                </div>
                <p className="text-lg text-slate-500 mb-6">{details.pronunciation}</p>
                
                <div className="space-y-6">
                    {details.definitions.map((definition, defIndex) => (
                        <div key={defIndex}>
                            <h3 className="font-bold text-xl text-sky-700 capitalize border-b-2 border-sky-200 pb-1 mb-3">
                                <span>{translatePartOfSpeech(definition.partOfSpeech)}:</span>
                                <span className="font-semibold text-lg text-slate-700 ml-2">{definition.commonMeanings}</span>
                            </h3>
                            {definition.meanings.map((meaningData, meaningIndex) => (
                                <div key={meaningIndex} className="mb-4 pl-4">
                                    <p className="font-semibold text-slate-800">{meaningData.meaning}</p>
                                    {meaningData.examples.map((ex, exIndex) => (
                                        <div key={exIndex} className="mt-1 text-slate-600 italic">
                                            "<InteractiveText text={ex} showDetail={showDetail} />"
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default WordDetailModal;


import React, { useState, useCallback, useEffect } from 'react';
import { Flashcard, GameMode, Unit, GrammarTopic, GrammarCategory, DifficultyLevel, ExamPracticeConfig, PracticeType } from './types';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import FlashcardMode from './components/FlashcardMode';
import QuizEnToVi from './components/QuizEnToVi';
import QuizViToEn from './components/QuizViToEn';
import FlashcardMenu from './components/FlashcardMenu';
import ViewAllCards from './components/ViewAllCards';
import WordDetailModal from './components/common/WordDetailModal';
import GrammarCategorySelection from './components/GrammarCategorySelection';
import GrammarDetail from './components/GrammarDetail';
import GrammarMenu from './components/GrammarMenu';
import GrammarPracticeSelection from './components/GrammarPracticeSelection';
import GrammarDifficultySelection from './components/GrammarDifficultySelection';
import GrammarPracticeMode from './components/GrammarPracticeMode';
import GrammarAiChat from './components/GrammarAiChat';
import ExamPrepMenu from './components/ExamPrepMenu';
import ExamPracticeMode from './components/ExamPracticeMode';
import WritingTranslationMenu from './components/WritingTranslationMenu';
import TranslationPractice from './components/TranslationPractice';
import WritingPractice from './components/WritingPractice';
import VocabSentencePractice from './components/VocabSentencePractice';


import { ALL_VOCABULARY } from './constants'; 

const App: React.FC = () => {
  // Đặt MAIN_MENU làm mặc định để hiển thị DashboardHome chứa đầy đủ tính năng
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MAIN_MENU);
  const [detailWord, setDetailWord] = useState<string | null>(null);
  
  // Vocabulary State
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedWords, setSelectedWords] = useState<Flashcard[]>([]);
  
  // Grammar State
  const [selectedGrammarCategory, setSelectedGrammarCategory] = useState<GrammarCategory | null>(null);
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<GrammarTopic | null>(null);
  const [grammarFlow, setGrammarFlow] = useState<'theory' | 'practice'>('theory');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [practiceType, setPracticeType] = useState<PracticeType>('MULTIPLE_CHOICE');

  // Exam Prep State
  const [examConfig, setExamConfig] = useState<ExamPracticeConfig | null>(null);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Set default words for Quiz modes to prevent crashes
  useEffect(() => {
      setSelectedWords(ALL_VOCABULARY);
  }, []);

  const handleShowDetail = (word: string) => {
    setDetailWord(word);
  };
  
  const handleSelectMode = (mode: GameMode) => {
     setGameMode(mode);
     
     // Set specific flows based on entry point
     if (mode === GameMode.GRAMMAR_CATEGORY_SELECTION) {
         setGrammarFlow('practice');
     } else if (mode === GameMode.GRAMMAR_DETAIL) {
         setGrammarFlow('theory');
     }
  };

  // Grammar Sidebar Selection (Direct to Theory)
  const handleSidebarGrammarTopicSelect = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      setGrammarFlow('theory');
      setGameMode(GameMode.GRAMMAR_DETAIL);
  };

  // --- Vocabulary Logic ---
  const handleSidebarUnitSelect = (unit: Unit) => {
    const allWords = unit.parts.flatMap(p => p.words);
    setSelectedWords(allWords);
    setSelectedUnit(unit);
    setGameMode(GameMode.FLASHCARD_MENU);
  };


  // --- Grammar Logic ---
  const handleSelectGrammarCategory = (category: GrammarCategory) => {
      setSelectedGrammarCategory(category);
      if (grammarFlow === 'practice') {
          setGameMode(GameMode.GRAMMAR_PRACTICE_SELECTION);
      } else {
          setGameMode(GameMode.GRAMMAR_THEORY_SELECTION); 
      }
  }

  const handleSelectGrammarTopicForTheory = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      setGameMode(GameMode.GRAMMAR_DETAIL);
  }

  const handleSelectGrammarTopicForPractice = (topic: GrammarTopic) => {
    setSelectedGrammarTopic(topic);
    setGameMode(GameMode.GRAMMAR_DIFFICULTY_SELECTION);
  };

  const handleOpenAiChat = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      setGameMode(GameMode.GRAMMAR_AI_CHAT);
  }

  const handleStartPracticeFromDetail = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      setGrammarFlow('practice');
      setGameMode(GameMode.GRAMMAR_DIFFICULTY_SELECTION);
  }

  const handleSelectParams = (level: DifficultyLevel, count: number, type: PracticeType) => {
      setSelectedDifficulty(level);
      setQuestionCount(count);
      setPracticeType(type);
      setGameMode(GameMode.GRAMMAR_PRACTICE_MODE);
  }

  // --- Exam Prep Logic ---
  const handleStartExam = (config: ExamPracticeConfig) => {
      setExamConfig(config);
      setGameMode(GameMode.EXAM_PRACTICE_MODE);
  }


  const renderContent = useCallback(() => {
    switch (gameMode) {
      // --- VOCABULARY ---
      case GameMode.FLASHCARD_MENU:
        return <FlashcardMenu setGameMode={setGameMode} onBackToMenu={() => setGameMode(GameMode.MAIN_MENU)} />;
      case GameMode.FLASHCARD_VIEW_ALL:
        return <ViewAllCards vocabulary={selectedWords} onBack={() => setGameMode(GameMode.FLASHCARD_MENU)} showDetail={handleShowDetail} />;
      case GameMode.FLASHCARDS:
        return <FlashcardMode vocabulary={selectedWords} onBackToMenu={() => setGameMode(GameMode.FLASHCARD_MENU)} showDetail={handleShowDetail} />;
      
      case GameMode.QUIZ_EN_TO_VI:
        return <QuizEnToVi vocabulary={selectedWords} onBackToMenu={() => setGameMode(GameMode.FLASHCARD_MENU)} />;
      case GameMode.QUIZ_VI_TO_EN:
        return <QuizViToEn vocabulary={selectedWords} onBackToMenu={() => setGameMode(GameMode.FLASHCARD_MENU)} />;
       case GameMode.VOCAB_SENTENCE_PRACTICE:
            return <VocabSentencePractice 
                        vocabulary={selectedWords} 
                        onBack={() => setGameMode(GameMode.FLASHCARD_MENU)} 
                        showDetail={handleShowDetail}
                    />;
      
      // --- GRAMMAR ---
      case GameMode.GRAMMAR_THEORY_SELECTION:
         if (!selectedGrammarCategory) return null;
         return (
             <GrammarMenu 
                topics={selectedGrammarCategory.topics} 
                onSelectTopic={handleSelectGrammarTopicForTheory} 
                onBack={() => setGameMode(GameMode.MAIN_MENU)} 
                title={`Bài học: ${selectedGrammarCategory.name}`}
             />
         );

      case GameMode.GRAMMAR_DETAIL:
        if (!selectedGrammarTopic) return <div className="p-8 text-slate-500">Vui lòng chọn một bài học từ menu bên trái.</div>;
        return (
            <GrammarDetail 
                topic={selectedGrammarTopic} 
                onBack={() => setGameMode(GameMode.MAIN_MENU)} 
                showDetail={handleShowDetail} 
                onOpenAiChat={handleOpenAiChat}
                onStartPractice={handleStartPracticeFromDetail}
            />
        );
      
      case GameMode.GRAMMAR_AI_CHAT:
          if (!selectedGrammarTopic) return null;
          return <GrammarAiChat topic={selectedGrammarTopic} onBack={() => setGameMode(GameMode.GRAMMAR_DETAIL)} />

      case GameMode.GRAMMAR_CATEGORY_SELECTION:
          return (
              <GrammarCategorySelection 
                onSelectCategory={handleSelectGrammarCategory} 
                onBack={() => setGameMode(GameMode.MAIN_MENU)} 
                title="Ngữ Pháp EnglishMaster"
              />
          );

      case GameMode.GRAMMAR_PRACTICE_SELECTION:
          if (!selectedGrammarCategory) return null;
          return (
              <GrammarPracticeSelection 
                topics={selectedGrammarCategory.topics}
                onSelectTopic={handleSelectGrammarTopicForPractice} 
                onBack={() => setGameMode(GameMode.MAIN_MENU)} 
                title={`Bài tập: ${selectedGrammarCategory.name}`}
              />
          );

      case GameMode.GRAMMAR_DIFFICULTY_SELECTION:
          if (!selectedGrammarTopic) return null;
          return (
              <GrammarDifficultySelection 
                onSelectParams={handleSelectParams}
                onBack={() => setGameMode(GameMode.GRAMMAR_DETAIL)}
                topicTitle={selectedGrammarTopic.title}
              />
          )

      case GameMode.GRAMMAR_PRACTICE_MODE:
          if (!selectedGrammarTopic) return null;
          return (
            <GrammarPracticeMode 
                topic={selectedGrammarTopic} 
                difficulty={selectedDifficulty}
                questionCount={questionCount}
                practiceType={practiceType}
                onBack={() => setGameMode(GameMode.GRAMMAR_DIFFICULTY_SELECTION)}
                showDetail={handleShowDetail}
            />
          );

      // --- EXAM PREP 2025 ---
      case GameMode.EXAM_PREP_MENU:
          return (
              <ExamPrepMenu 
                onStartExam={handleStartExam}
                onBack={() => setGameMode(GameMode.MAIN_MENU)}
              />
          );
      
      case GameMode.EXAM_PRACTICE_MODE:
          if (!examConfig) return null;
          return (
              <ExamPracticeMode 
                config={examConfig}
                onBack={() => setGameMode(GameMode.EXAM_PREP_MENU)}
              />
          );

      // --- WRITING & TRANSLATION ---
      case GameMode.WRITING_TRANSLATION_MENU:
          return (
              <WritingTranslationMenu 
                  onSelectMode={setGameMode}
                  onBack={() => setGameMode(GameMode.MAIN_MENU)}
              />
          );
      case GameMode.TRANSLATION_PRACTICE:
          return (
              <TranslationPractice 
                  vocabulary={selectedWords}
                  onBack={() => setGameMode(GameMode.WRITING_TRANSLATION_MENU)}
                  showDetail={handleShowDetail}
              />
          );
      case GameMode.WRITING_PRACTICE:
          return (
              <WritingPractice 
                  onBack={() => setGameMode(GameMode.WRITING_TRANSLATION_MENU)}
                  showDetail={handleShowDetail}
              />
          );

      case GameMode.MAIN_MENU:
      default:
        return <DashboardHome 
          onSelectMode={handleSelectMode}
          onSelectGrammarTopic={handleSidebarGrammarTopicSelect}
          onSelectVocabularyUnit={handleSidebarUnitSelect}
        />;
    }
  }, [gameMode, selectedWords, selectedGrammarCategory, selectedGrammarTopic, grammarFlow, selectedDifficulty, questionCount, examConfig, practiceType]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentMode={gameMode} 
        onSelectMode={handleSelectMode} 
        onSelectGrammarTopic={handleSidebarGrammarTopicSelect}
        selectedGrammarTopicId={selectedGrammarTopic?.id}
        onSelectVocabularyUnit={handleSidebarUnitSelect}
        selectedVocabularyUnitName={selectedUnit?.name}
        isMobileOpen={isSidebarOpen}
        closeMobileSidebar={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
           <span className="font-bold text-lg text-slate-700">EnglishMaster</span>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 bg-slate-100 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-0 md:p-6 lg:p-8 scroll-smooth">
           <div className="max-w-5xl mx-auto">
             {renderContent()}
           </div>
        </main>

      </div>

      {detailWord && <WordDetailModal word={detailWord} onClose={() => setDetailWord(null)} showDetail={handleShowDetail} />}
    </div>
  );
};

export default App;

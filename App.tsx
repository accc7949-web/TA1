
import React, { useState, useCallback, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Flashcard, GameMode, Unit, GrammarTopic, GrammarCategory, DifficultyLevel, ExamPracticeConfig, PracticeType } from './types';
import { observeAuthState, logoutUser, getUserProfile, UserProfile } from './services/auth';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfileComponent from './components/UserProfile';
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
import CustomGrammarManager from './components/CustomGrammarManager';
import CustomVocabularyManager from './components/CustomVocabularyManager';
import { CustomVocabUnit } from './types';

import { ALL_VOCABULARY } from './constants'; 

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
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
  const [showCustomGrammar, setShowCustomGrammar] = useState(false);

  // Exam Prep State
  const [examConfig, setExamConfig] = useState<ExamPracticeConfig | null>(null);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = observeAuthState(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Set default words for Quiz modes to prevent crashes
  useEffect(() => {
      setSelectedWords(ALL_VOCABULARY);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  // Convert CustomVocabUnit to Unit format for compatibility
  const handleSelectCustomVocabUnit = (customUnit: CustomVocabUnit) => {
    // Convert modules to parts format
    const parts = customUnit.modules.map(module => ({
      name: module.name,
      words: module.words || [],
    }));
    
    // Get all words from all modules
    const allWords = parts.flatMap(p => p.words);
    
    // Check if there are any words
    if (allWords.length === 0) {
      alert('Unit này chưa có từ vựng nào. Vui lòng thêm học phần trước.');
      return;
    }
    
    const unit: Unit = {
      name: customUnit.name,
      parts: parts,
    };
    
    handleSidebarUnitSelect(unit);
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
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để hiển thị. Vui lòng chọn một unit.</div>;
        }
        return <ViewAllCards vocabulary={selectedWords} onBack={() => setGameMode(GameMode.FLASHCARD_MENU)} showDetail={handleShowDetail} />;
      case GameMode.FLASHCARDS:
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để học. Vui lòng chọn một unit.</div>;
        }
        return <FlashcardMode vocabulary={selectedWords} onBackToMenu={() => setGameMode(GameMode.FLASHCARD_MENU)} showDetail={handleShowDetail} />;
      
      case GameMode.QUIZ_EN_TO_VI:
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để làm quiz. Vui lòng chọn một unit.</div>;
        }
        return <QuizEnToVi vocabulary={selectedWords} onBackToMenu={() => setGameMode(GameMode.FLASHCARD_MENU)} />;
      case GameMode.QUIZ_VI_TO_EN:
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để làm quiz. Vui lòng chọn một unit.</div>;
        }
        return <QuizViToEn vocabulary={selectedWords} onBackToMenu={() => setGameMode(GameMode.FLASHCARD_MENU)} />;
       case GameMode.VOCAB_SENTENCE_PRACTICE:
            if (selectedWords.length === 0) {
              return <div className="p-8 text-center text-gray-600">Không có từ vựng để luyện tập. Vui lòng chọn một unit.</div>;
            }
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
                uid={user?.uid}
                onCustomGrammar={() => setGameMode(GameMode.CUSTOM_GRAMMAR)}
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

      case GameMode.CUSTOM_GRAMMAR:
          if (!user) return null;
          return (
              <CustomGrammarManager 
                uid={user.uid}
                onBack={() => setGameMode(GameMode.GRAMMAR_CATEGORY_SELECTION)}
              />
          );

      case GameMode.CUSTOM_VOCABULARY:
          if (!user) return null;
          return (
              <CustomVocabularyManager 
                uid={user.uid}
                onBack={() => setGameMode(GameMode.MAIN_MENU)}
                onSelectUnit={handleSelectCustomVocabUnit}
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
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-700">Đang tải...</p>
          </div>
        </div>
      ) : !user ? (
        authMode === 'login' ? (
          <Login 
            onSuccess={() => {}} 
            onSwitchToSignup={() => setAuthMode('signup')}
          />
        ) : (
          <Signup 
            onSuccess={() => {}} 
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )
      ) : (
        <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
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

          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="md:hidden bg-white p-4 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
               <span className="font-bold text-lg text-slate-700">EnglishMaster</span>
               <div className="flex gap-2">
                 <button 
                   onClick={() => setShowProfileModal(true)}
                   className="p-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                   title="Xem thông tin"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </button>
                 <button 
                   onClick={() => setIsSidebarOpen(true)} 
                   className="p-2 text-slate-600 bg-slate-100 rounded-md"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                 </button>
                 <button 
                   onClick={handleLogout}
                   className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                 >
                   Đăng xuất
                 </button>
               </div>
            </div>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-0 md:p-6 lg:p-8 scroll-smooth">
               <div className="max-w-5xl mx-auto">
                 <div className="hidden md:flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                     <h1 className="text-2xl font-bold text-slate-800">Xin chào, {user.displayName || user.email}</h1>
                     {userProfile?.isAdmin && (
                       <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                         ADMIN
                       </span>
                     )}
                   </div>
                   <div className="flex gap-3">
                     <button 
                       onClick={() => setShowProfileModal(true)}
                       className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                     >
                       Thông tin
                     </button>
                     <button 
                       onClick={handleLogout}
                       className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                     >
                       Đăng xuất
                     </button>
                   </div>
                 </div>
                 {renderContent()}
               </div>
            </main>

            <>
              {showProfileModal && user && (
                <UserProfileComponent 
                  user={user} 
                  onClose={() => setShowProfileModal(false)}
                />
              )}

              {detailWord && <WordDetailModal word={detailWord} onClose={() => setDetailWord(null)} showDetail={handleShowDetail} />}
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

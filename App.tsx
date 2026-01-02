
import React, { useState, useCallback, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Flashcard, GameMode, Unit, GrammarTopic, GrammarCategory, DifficultyLevel, ExamPracticeConfig, PracticeType, VocabularyModule, ROLE_COLORS } from './types';
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
import ModuleSelection from './components/ModuleSelection';
import CustomModuleSelection from './components/CustomModuleSelection';
import ChatPanel from './components/ChatPanel';
import { CustomVocabUnit } from './types';

import { ALL_VOCABULARY } from './constants'; 

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  
  // Đặt MAIN_MENU làm mặc định để hiển thị DashboardHome chứa đầy đủ tính năng
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MAIN_MENU);
  const [modeHistory, setModeHistory] = useState<GameMode[]>([GameMode.MAIN_MENU]);
  const [detailWord, setDetailWord] = useState<string | null>(null);
  
  // Vocabulary State
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedWords, setSelectedWords] = useState<Flashcard[]>([]);
  const [selectedModule, setSelectedModule] = useState<VocabularyModule | null>(null);
  const [selectedCustomVocabUnit, setSelectedCustomVocabUnit] = useState<CustomVocabUnit | null>(null);
  
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

  // Navigation handler that tracks history
  const handleSelectMode = (mode: GameMode) => {
     setGameMode(mode);
     setModeHistory(prev => [...prev, mode]);
     
     // Set specific flows based on entry point
     if (mode === GameMode.GRAMMAR_CATEGORY_SELECTION) {
         setGrammarFlow('practice');
     } else if (mode === GameMode.GRAMMAR_DETAIL) {
         setGrammarFlow('theory');
     }
  };

  // Go back to previous screen
  const handleGoBack = () => {
    if (modeHistory.length > 1) {
      const newHistory = modeHistory.slice(0, -1);
      const previousMode = newHistory[newHistory.length - 1];
      setModeHistory(newHistory);
      setGameMode(previousMode);
    } else {
      setGameMode(GameMode.MAIN_MENU);
    }
  };

  // Grammar Sidebar Selection (Direct to Theory)
  const handleSidebarGrammarTopicSelect = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      setGrammarFlow('theory');
      handleSelectMode(GameMode.GRAMMAR_DETAIL);
  };

  // --- Vocabulary Logic ---
  const handleSidebarUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    handleSelectMode(GameMode.MODULE_SELECTION);
  };

  // Module selection handler
  const handleSelectModule = (module: VocabularyModule) => {
    setSelectedModule(module);
    setSelectedWords(module.words);
    handleSelectMode(GameMode.FLASHCARD_MENU);
  };

  // Convert CustomVocabUnit to Unit format for compatibility
  const handleSelectCustomVocabUnit = (customUnit: CustomVocabUnit) => {
    setSelectedCustomVocabUnit(customUnit);
    handleSelectMode(GameMode.CUSTOM_MODULE_SELECTION);
  };

  // Custom module selection handler
  const handleSelectCustomModule = (moduleName: string, moduleWords: any[]) => {
    setSelectedWords(moduleWords);
    handleSelectMode(GameMode.FLASHCARD_MENU);
  };


  // --- Grammar Logic ---
  const handleSelectGrammarCategory = (category: GrammarCategory) => {
      setSelectedGrammarCategory(category);
      if (grammarFlow === 'practice') {
          handleSelectMode(GameMode.GRAMMAR_PRACTICE_SELECTION);
      } else {
          handleSelectMode(GameMode.GRAMMAR_THEORY_SELECTION); 
      }
  }

  const handleSelectGrammarTopicForTheory = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      handleSelectMode(GameMode.GRAMMAR_DETAIL);
  }

  const handleSelectGrammarTopicForPractice = (topic: GrammarTopic) => {
    setSelectedGrammarTopic(topic);
    handleSelectMode(GameMode.GRAMMAR_DIFFICULTY_SELECTION);
  };

  const handleOpenAiChat = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      handleSelectMode(GameMode.GRAMMAR_AI_CHAT);
  }

  const handleStartPracticeFromDetail = (topic: GrammarTopic) => {
      setSelectedGrammarTopic(topic);
      setGrammarFlow('practice');
      handleSelectMode(GameMode.GRAMMAR_DIFFICULTY_SELECTION);
  }

  const handleSelectParams = (level: DifficultyLevel, count: number, type: PracticeType) => {
      setSelectedDifficulty(level);
      setQuestionCount(count);
      setPracticeType(type);
      handleSelectMode(GameMode.GRAMMAR_PRACTICE_MODE);
  }

  // --- Exam Prep Logic ---
  const handleStartExam = (config: ExamPracticeConfig) => {
      setExamConfig(config);
      handleSelectMode(GameMode.EXAM_PRACTICE_MODE);
  }


  const renderContent = useCallback(() => {
    switch (gameMode) {
      // --- VOCABULARY ---
      case GameMode.FLASHCARD_MENU:
        return <FlashcardMenu setGameMode={setGameMode} onBackToMenu={handleGoBack} />;
      case GameMode.MODULE_SELECTION:
        if (!selectedUnit) return null;
        return <ModuleSelection 
                  unit={selectedUnit} 
                  onSelectModule={handleSelectModule} 
                  onBack={handleGoBack} 
                />;
      case GameMode.CUSTOM_MODULE_SELECTION:
        if (!selectedCustomVocabUnit) return null;
        return <CustomModuleSelection 
                  customUnit={selectedCustomVocabUnit} 
                  onSelectModule={handleSelectCustomModule} 
                  onBack={handleGoBack} 
                />;
      case GameMode.FLASHCARD_VIEW_ALL:
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để hiển thị. Vui lòng chọn một unit.</div>;
        }
        return <ViewAllCards vocabulary={selectedWords} onBack={handleGoBack} showDetail={handleShowDetail} />;
      case GameMode.FLASHCARDS:
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để học. Vui lòng chọn một unit.</div>;
        }
        return <FlashcardMode vocabulary={selectedWords} onBackToMenu={handleGoBack} showDetail={handleShowDetail} />;
      
      case GameMode.QUIZ_EN_TO_VI:
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để làm quiz. Vui lòng chọn một unit.</div>;
        }
        return <QuizEnToVi vocabulary={selectedWords} onBackToMenu={handleGoBack} />;
      case GameMode.QUIZ_VI_TO_EN:
        if (selectedWords.length === 0) {
          return <div className="p-8 text-center text-gray-600">Không có từ vựng để làm quiz. Vui lòng chọn một unit.</div>;
        }
        return <QuizViToEn vocabulary={selectedWords} onBackToMenu={handleGoBack} />;
       case GameMode.VOCAB_SENTENCE_PRACTICE:
            if (selectedWords.length === 0) {
              return <div className="p-8 text-center text-gray-600">Không có từ vựng để luyện tập. Vui lòng chọn một unit.</div>;
            }
            return <VocabSentencePractice 
                        vocabulary={selectedWords} 
                        onBack={handleGoBack} 
                        showDetail={handleShowDetail}
                    />;
      
      // --- GRAMMAR ---
      case GameMode.GRAMMAR_THEORY_SELECTION:
         if (!selectedGrammarCategory) return null;
         return (
             <GrammarMenu 
                topics={selectedGrammarCategory.topics} 
                onSelectTopic={handleSelectGrammarTopicForTheory} 
                onBack={handleGoBack} 
                title={`Bài học: ${selectedGrammarCategory.name}`}
             />
         );

      case GameMode.GRAMMAR_DETAIL:
        if (!selectedGrammarTopic) return <div className="p-8 text-slate-500">Vui lòng chọn một bài học từ menu bên trái.</div>;
        return (
            <GrammarDetail 
                topic={selectedGrammarTopic} 
                onBack={handleGoBack} 
                showDetail={handleShowDetail} 
                onOpenAiChat={handleOpenAiChat}
                onStartPractice={handleStartPracticeFromDetail}
            />
        );
      
      case GameMode.GRAMMAR_AI_CHAT:
          if (!selectedGrammarTopic) return null;
          return <GrammarAiChat topic={selectedGrammarTopic} onBack={handleGoBack} />

      case GameMode.GRAMMAR_CATEGORY_SELECTION:
          return (
              <GrammarCategorySelection 
                onSelectCategory={handleSelectGrammarCategory} 
                onBack={handleGoBack} 
                title="Ngữ Pháp EnglishMaster"
                uid={user?.uid}
                onCustomGrammar={() => handleSelectMode(GameMode.CUSTOM_GRAMMAR)}
              />
          );

      case GameMode.GRAMMAR_PRACTICE_SELECTION:
          if (!selectedGrammarCategory) return null;
          return (
              <GrammarPracticeSelection 
                topics={selectedGrammarCategory.topics}
                onSelectTopic={handleSelectGrammarTopicForPractice} 
                onBack={handleGoBack} 
                title={`Bài tập: ${selectedGrammarCategory.name}`}
              />
          );

      case GameMode.GRAMMAR_DIFFICULTY_SELECTION:
          if (!selectedGrammarTopic) return null;
          return (
              <GrammarDifficultySelection 
                onSelectParams={handleSelectParams}
                onBack={handleGoBack}
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
                onBack={handleGoBack}
                showDetail={handleShowDetail}
            />
          );

      case GameMode.CUSTOM_GRAMMAR:
          if (!user) return null;
          return (
              <CustomGrammarManager 
                uid={user.uid}
                onBack={handleGoBack}
              />
          );

      case GameMode.CUSTOM_VOCABULARY:
          if (!user) return null;
          return (
              <CustomVocabularyManager 
                uid={user.uid}
                onBack={handleGoBack}
                onSelectUnit={handleSelectCustomVocabUnit}
              />
          );

      // --- EXAM PREP 2025 ---
      case GameMode.EXAM_PREP_MENU:
          return (
              <ExamPrepMenu 
                onStartExam={handleStartExam}
                onBack={handleGoBack}
              />
          );
      
      case GameMode.EXAM_PRACTICE_MODE:
          if (!examConfig) return null;
          return (
              <ExamPracticeMode 
                config={examConfig}
                onBack={handleGoBack}
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
               <div className="flex gap-2 items-center">
                 <button 
                   onClick={() => setShowChatPanel(true)}
                   className="p-2 rounded-full hover:bg-slate-200 transition-colors relative"
                   title="Open Chat"
                 >
                   <span className="text-xl">💬</span>
                   <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                 </button>
                 <button 
                   onClick={() => setShowProfileModal(true)}
                   className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                     userProfile?.role ? ROLE_COLORS[userProfile.role].bg : 'from-blue-400 to-blue-600'
                   } flex items-center justify-center text-white font-bold text-sm hover:ring-2 hover:ring-offset-2 transition-all ${
                     userProfile?.role === 'admin' ? 'hover:ring-yellow-400' :
                     userProfile?.role === 'moderator' ? 'hover:ring-purple-400' :
                     userProfile?.role === 'ai_bot' ? 'hover:ring-cyan-400' :
                     'hover:ring-blue-400'
                   } ${userProfile?.role === 'admin' ? 'shadow-xl shadow-yellow-400/50' : userProfile?.role === 'ai_bot' ? 'shadow-xl shadow-cyan-400/30' : ''}`}
                   title={userProfile?.displayName || 'Profile'}
                 >
                   {userProfile?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                 </button>
                 <button 
                   onClick={() => setIsSidebarOpen(true)} 
                   className="p-2 text-slate-600 bg-slate-100 rounded-md"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
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
                       onClick={() => setShowChatPanel(true)}
                       className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                     >
                       💬 Chat
                     </button>
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
                  onLogout={handleLogout}
                />
              )}

              <ChatPanel 
                user={user}
                userProfile={userProfile}
                isOpen={showChatPanel}
                onClose={() => setShowChatPanel(false)}
              />

              {detailWord && <WordDetailModal word={detailWord} onClose={() => setDetailWord(null)} showDetail={handleShowDetail} />}
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

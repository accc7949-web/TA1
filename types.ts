
export interface RelatedWord {
  word: string;
  pos: string; // part of speech
  meaning: string;
  examples?: string[];
}

export interface Flashcard {
  id: number;
  word: string;
  pronunciation: string;
  meaning: string;
  synonyms?: RelatedWord[];
  antonyms?: RelatedWord[];
  examples?: string[];
}

export interface VocabularyPart {
  name: string;
  words: Flashcard[];
}

export interface VocabularyModule {
  id: string;
  name: string;
  words: Flashcard[];
  wordCount: number;
}

export interface Unit {
    name: string;
    parts: VocabularyPart[];
    modules?: VocabularyModule[];
}

export interface Grade {
    name: string;
    units: Unit[];
}

export interface Classroom {
    name: string;
    description: string;
    grades: Grade[];
}

// FIX: Add VocabularyCategory interface to resolve compilation errors in legacy/unused components like CategorySelection.
export interface VocabularyCategory {
  name: string;
  parts: VocabularyPart[];
}

export interface GrammarSection {
  title: string;
  content: string; // Markdown supported
  examples: string[];
}

export interface GrammarTable {
    headers: string[];
    rows: string[][];
}

export interface GrammarTopic {
  id: string;
  title: string;
  summary: string;
  sections: GrammarSection[];
  cheatSheet?: GrammarTable; // Bảng tóm tắt kiến thức
  colorTheme?: 'blue' | 'sky' | 'cyan' | 'teal' | 'emerald' | 'green' | 'lime' | 'yellow' | 'amber' | 'orange' | 'red' | 'rose' | 'pink' | 'purple' | 'violet' | 'indigo' | 'slate'; // Expanded colors
  subTopics?: GrammarTopic[];
}

export interface GrammarCategory {
  id: string;
  name: string;
  description: string;
  topics: GrammarTopic[];
}

export interface GrammarQuestion {
  id?: string;
  question: string;
  questionTranslation: string; // Meaning of the sentence in Vietnamese
  options: string[];
  correctAnswer: string;
  explanation: string;
  relatedTheory?: string; // Short theory snippet to review if wrong
}

export interface ErrorCorrectionQuestion {
    id?: string;
    sentence: string; // The full sentence with an error
    errorTarget: string; // The specific word/phrase that is wrong (e.g., "go")
    correctForm: string; // The corrected form (e.g., "went")
    translation: string;
    explanation: string; // Why it's wrong
    relatedTheory: string; // Formula
}

export interface GrammarNuanceQuestion {
    id?: string;
    contextQuestion: string; // Câu hỏi tư duy: "Ai là người đã rời đi?"
    options: {
        text: string; // Câu A: I lived...
        nuance: string; // Tư duy: Hành động đã chết -> Đã rời đi.
    }[];
    correctOptionIndex: number;
    explanation: string; // Tổng hợp logic
    topic: string;
}

export type DifficultyLevel = 'Very Easy' | 'Easy' | 'Medium' | 'Hard';
export type PracticeType = 'MULTIPLE_CHOICE' | 'ERROR_CORRECTION' | 'EXPLAIN_DIFFERENCE';

export interface QuizResult {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

export interface GrammarAssessment {
    generalComment: string;
    strengths: string[];
    weaknesses: string[];
    advice: string;
}

// --- NEW TYPES FOR ADAPTIVE GRAMMAR PRACTICE ---

export type PracticeStep = 'STEP_1_MATCHING' | 'STEP_2_ADAPTIVE_MCQ' | 'STEP_3_WRITING' | 'COMPLETED';

export interface MatchingPair {
    id: string;
    concept: string; // e.g., "S + V(s/es)"
    definition: string; // e.g., "Công thức Hiện tại đơn (Khẳng định)"
}

export interface WritingQuestion {
    id: string;
    prompt: string; // e.g., "Write a sentence using Present Simple" or "She ____ (go) to school."
    correctAnswers: string[]; // Possible correct answers
    hint?: string;
}

export interface PracticeState {
    topicId: string;
    currentStep: PracticeStep;
    
    // Step 1 Data
    matchingPairs: MatchingPair[];
    isMatchingCompleted: boolean;

    // Step 2 & 3 Data
    weakPoints: string[]; // List of concepts the user is struggling with
    roundCount: number; // How many batches taken
    step2BatchInfo: {
        currentBatch: number; // 1 or 2
        batch1Score: number;
        batch2Score: number;
    }
}

// --- NEW TYPES FOR EXAM PREP 2025 ---

export type ExamQuestionType = 'NOTICE_FLYER' | 'ARRANGEMENT' | 'CLOZE' | 'READING';

export interface ExamPracticeConfig {
    type: ExamQuestionType;
    topic: string; // e.g., Environment, Education
    readingLength?: 'short' | 'medium' | 'long'; // 150, 250, 350 words
}

export interface ExamQuestion {
    id: string;
    type: ExamQuestionType;
    context: string; // The notice content, the paragraph text, or the sentences to arrange
    subQuestions?: { // For Reading/Cloze/Notice where one context has multiple questions
        id: string;
        questionText: string; // "Question 1", "The word 'It' refers to..."
        options: string[];
        correctAnswer: string;
        explanation: string;
    }[];
    arrangementItems?: string[]; // For Arrangement type: the shuffled sentences
    correctArrangement?: string[]; // The correct order of IDs or indices
    explanation?: string; // General explanation
}

// --- NEW TYPES FOR WRITING & TRANSLATION ---

export interface TranslationCorrection {
    originalPhrase: string;
    correctedPhrase: string;
    explanation: string;
}

export interface TranslationFeedback {
    score: number; // 1-10
    generalComment: string;
    specificCorrections: TranslationCorrection[];
    correctedVersion: string; // A better version of the user's translation
    highlights: string[]; // Good points
}

export interface WritingFeedback {
    score: number;
    correctedText: string;
    grammarMistakes: { original: string; correction: string; explanation: string }[];
    vocabularySuggestions: string[];
    generalComment: string;
}

export enum GameMode {
  MAIN_MENU,
  
  // Vocabulary Section
  CLASSROOM_SELECTION,
  GRADE_SELECTION,
  UNIT_SELECTION,
  MODULE_SELECTION, // Select which module/part to learn
  CUSTOM_MODULE_SELECTION, // Select which custom module/part to learn
  FLASHCARD_MENU,
  FLASHCARDS,
  FLASHCARD_VIEW_ALL,
  QUIZ_EN_TO_VI,
  QUIZ_VI_TO_EN,
  VOCAB_SENTENCE_PRACTICE,

  // Grammar Section
  GRAMMAR_DASHBOARD, 
  GRAMMAR_CATEGORY_SELECTION,
  GRAMMAR_THEORY_SELECTION, // This acts as the menu to select a topic
  GRAMMAR_DETAIL,
  GRAMMAR_PRACTICE_SELECTION,
  GRAMMAR_DIFFICULTY_SELECTION,
  GRAMMAR_PRACTICE_MODE,
  GRAMMAR_AI_CHAT,
  CUSTOM_GRAMMAR, // User created custom grammar units
  CUSTOM_VOCABULARY, // User created custom vocabulary units

  // Exam Prep 2025 Section
  EXAM_PREP_MENU, // Select type: Notice, Arrangement, Reading...
  EXAM_PRACTICE_MODE, // The actual exam taking interface

  // Writing & Translation Section
  WRITING_TRANSLATION_MENU,
  TRANSLATION_PRACTICE,
  WRITING_PRACTICE
}

// Types for Gemini Response
export interface WordDefinition {
    meaning: string;
    examples: string[];
}

export interface WordDetails {
    word: string;
    pronunciation: string;
    definitions: {
        partOfSpeech: string;
        commonMeanings: string;
        meanings: WordDefinition[];
    }[];
}

// Custom Grammar Units - User Created
export interface CustomGrammarLesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown supported
  examples: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: number;
  updatedAt: number;
  isAIGenerated?: boolean;
}

export interface CustomGrammarUnit {
  id: string;
  uid: string; // User ID
  name: string;
  description: string;
  lessons: CustomGrammarLesson[];
  createdAt: number;
  updatedAt: number;
}

// Custom Vocabulary Units - User Created
export interface CustomVocabModule {
  id: string;
  name: string; // Tên học phần
  words: Flashcard[];
  createdAt: number;
  updatedAt: number;
  isAIGenerated?: boolean;
}

export interface CustomVocabUnit {
  id: string;
  uid: string; // User ID
  name: string;
  description: string;
  modules: CustomVocabModule[]; // Các học phần
  createdAt: number;
  updatedAt: number;
}

// Chat System Types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: UserRole;
  content: string;
  timestamp: number;
  isAIResponse?: boolean;
  mentions?: string[]; // @usernames mentioned
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

export type ChatType = 'direct' | 'community' | 'ai';

export interface Conversation {
  id: string;
  type: ChatType;
  name: string;
  description?: string;
  participants: string[]; // UIDs of participants
  lastMessage?: string;
  lastMessageTime?: number;
  lastMessageSender?: string;
  unreadCount?: number;
  avatar?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatRoom {
  id: string;
  type: ChatType;
  name: string;
  description: string;
  icon?: string;
  participants: Array<{
    uid: string;
    displayName: string;
    avatar?: string;
    role?: UserRole;
    joinedAt: number;
  }>;
  createdAt: number;
  updatedAt: number;
}

// Role types for user profiles
export type UserRole = 'admin' | 'user' | 'moderator' | 'ai_bot';

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  'admin': 'Admin',
  'user': 'Học viên (Member)',
  'moderator': 'Kiểm duyệt viên (Moderator)',
  'ai_bot': 'Trợ lý ảo (AI Bot)'
};

export const ROLE_COLORS: Record<UserRole, { bg: string; text: string; badge: string; border: string; glow?: string }> = {
  'admin': {
    bg: 'from-yellow-400 to-yellow-600',
    text: 'text-yellow-700',
    badge: 'bg-yellow-400 border-yellow-500',
    border: 'border-yellow-400',
    glow: 'shadow-xl shadow-yellow-400/50'
  },
  'user': {
    bg: 'from-blue-400 to-blue-600',
    text: 'text-blue-700',
    badge: 'bg-blue-400 border-blue-500',
    border: 'border-blue-400'
  },
  'moderator': {
    bg: 'from-purple-400 to-purple-600',
    text: 'text-purple-700',
    badge: 'bg-purple-400 border-purple-500',
    border: 'border-purple-400'
  },
  'ai_bot': {
    bg: 'from-cyan-400 to-cyan-600',
    text: 'text-cyan-700',
    badge: 'bg-cyan-400 border-cyan-500',
    border: 'border-cyan-400',
    glow: 'shadow-xl shadow-cyan-400/30'
  }
};
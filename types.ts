
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

export interface Unit {
    name: string;
    parts: VocabularyPart[];
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

/// <reference types="vite/client" />

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WordDetails, GrammarQuestion, DifficultyLevel, QuizResult, GrammarAssessment, ExamQuestion, ExamPracticeConfig, TranslationFeedback, WritingFeedback, MatchingPair, WritingQuestion, ErrorCorrectionQuestion, GrammarNuanceQuestion } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

let ai: GoogleGenAI | null = null;

export function getAI(): GoogleGenAI {
  if (!ai) {
    if (!apiKey) {
      throw new Error("API key not found. Set VITE_GEMINI_API_KEY in your .env file");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

const modelName = 'gemini-3-flash-preview';

const definitionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING },
        pronunciation: { type: Type.STRING },
        definitions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    partOfSpeech: { type: Type.STRING },
                    commonMeanings: { type: Type.STRING },
                    meanings: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                meaning: { type: Type.STRING },
                                examples: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["meaning", "examples"]
                        }
                    }
                },
                required: ["partOfSpeech", "commonMeanings", "meanings"]
            }
        }
    },
    required: ["word", "pronunciation", "definitions"]
};

const quizSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            questionTranslation: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            relatedTheory: { type: Type.STRING }
        },
        required: ["question", "questionTranslation", "options", "correctAnswer", "explanation", "relatedTheory"]
    }
};

const errorCorrectionSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            sentence: { type: Type.STRING },
            errorTarget: { type: Type.STRING },
            correctForm: { type: Type.STRING },
            translation: { type: Type.STRING },
            explanation: { type: Type.STRING },
            relatedTheory: { type: Type.STRING }
        },
        required: ["sentence", "errorTarget", "correctForm", "translation", "explanation", "relatedTheory"]
    }
}

const nuanceSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            contextQuestion: { type: Type.STRING },
            options: { 
                type: Type.ARRAY, 
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        nuance: { type: Type.STRING }
                    },
                    required: ["text", "nuance"]
                }
            },
            correctOptionIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            topic: { type: Type.STRING }
        },
        required: ["contextQuestion", "options", "correctOptionIndex", "explanation", "topic"]
    }
}

const matchingSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            concept: { type: Type.STRING },
            definition: { type: Type.STRING }
        },
        required: ["id", "concept", "definition"]
    }
};

const writingQuestionSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            prompt: { type: Type.STRING },
            correctAnswers: { type: Type.ARRAY, items: { type: Type.STRING } },
            hint: { type: Type.STRING }
        },
        required: ["id", "prompt", "correctAnswers"]
    }
}

const assessmentSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        generalComment: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        advice: { type: Type.STRING }
    },
    required: ["generalComment", "strengths", "weaknesses", "advice"]
}

export const getWordDetails = async (word: string): Promise<WordDetails | null> => {
    try {
        const prompt = `Provide detailed definition for "${word}" in Vietnamese with IPA and examples.`;
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: definitionSchema },
        });
        return JSON.parse(response.text.trim()) as WordDetails;
    } catch (error) {
        return null;
    }
};

export const generateGrammarQuiz = async (topicTitle: string, difficulty: DifficultyLevel, count: number = 10, subTopics?: string[], topicSummary?: string): Promise<GrammarQuestion[] | null> => {
    try {
        let topicContext = `topic "${topicTitle}"`;
        if (subTopics && subTopics.length > 0) {
            topicContext = `a MIXED practice covering these specific sub-topics: ${subTopics.join(', ')}.`;
        }

        const scopeInstruction = topicSummary 
            ? `**CRITICAL SCOPE CONSTRAINT**: You must STRICTLY limit the questions to the concepts described in this summary: "${topicSummary}". DO NOT include any grammar points, vocabulary, or structures that are not explicitly part of this scope (e.g., if the scope is "And, But, So", do NOT ask about "Not only... but also", "However", "Therefore").` 
            : "";

        // IMPROVED PROMPT WITH 4 DIFFICULTY LEVELS:
        const prompt = `
        Act as an expert English teacher for Vietnamese students.
        Create EXACTLY ${count} multiple-choice questions for ${topicContext}.
        
        ${scopeInstruction}

        STRICT DIFFICULTY GUIDELINES (4 LEVELS):
        
        1. **Difficulty Level: ${difficulty}**
           
           - **Very Easy (A1)**: 
             * Usage: Focus on the MOST BASIC FORM and OBVIOUS signals (e.g., "Yesterday", "Every day", "Now").
             * Sentence: Short, simple sentences (Subject + Verb + Object). No complex clauses.
             * Distractors: Completely wrong tenses (e.g., Future vs Past).
             * Goal: Recognition of the core rule.

           - **Easy (A2)**: 
             * Usage: Common usage in daily life.
             * Sentence: Simple Compound sentences (using "and", "but"). Clear context.
             * Distractors: Common mistakes (e.g., forgetting 's' in 3rd person, irregular verbs).
             * Goal: Correct conjugation and basic sentence structure.

           - **Medium (B1)**: 
             * Usage: Context clues (logical sequence, cause-effect) instead of just signal words.
             * Sentence: Complex sentences with time clauses ("When", "While", "After", "Before").
             * Distractors: Confusing pairs (Past Simple vs Present Perfect; Will vs Be Going To).
             * Goal: Distinguishing between similar tenses based on context.
             
           - **Hard (B2/C1)**: 
             * Usage: Exceptions, subtle nuances, formal structures, passive voice combined with tenses, or idioms.
             * Sentence: Longer, academic, or formal contexts.
             * Distractors: Very similar grammatical forms where only context/nuance decides the winner.
             * Goal: Mastery and advanced logic.

        2. **Diversity & Uniqueness**:
           - Avoid repetitive subjects like "I", "He", "She". Use names, "The government", "Scientists", etc.
           - Ensure questions cover different rules within the topic (Affirmative, Negative, Question, Wh-Question).

        3. **Distractors (Wrong Answers)**:
           - Must be grammatically plausible (common student mistakes). 
           - Do NOT use non-existent words.

        4. **Output Format**:
           - **question**: The English sentence with a blank (________).
           - **questionTranslation**: Natural Vietnamese translation.
           - **explanation**: Explain specifically why the correct answer fits and why others are wrong (in Vietnamese).
           - **relatedTheory**: State the **USAGE CONTEXT (Cách dùng)** explicitly. Format: "Dấu hiệu/Ngữ cảnh -> Tên thì/Cấu trúc".
        `;
        
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: quizSchema },
        });
        return JSON.parse(response.text.trim()) as GrammarQuestion[];
    } catch (error) {
        console.error("Quiz Gen Error:", error);
        return null;
    }
}

export const generateErrorCorrectionQuiz = async (topicTitle: string, difficulty: DifficultyLevel, count: number = 10, topicSummary?: string): Promise<ErrorCorrectionQuestion[] | null> => {
    try {
        const scopeInstruction = topicSummary 
            ? `**CRITICAL SCOPE CONSTRAINT**: You must STRICTLY limit the errors to the grammar concepts described in this summary: "${topicSummary}". Do NOT test unrelated errors.` 
            : "";

        const prompt = `
        Act as a strict English grammar teacher.
        Create EXACTLY ${count} "Error Identification & Correction" questions for topic "${topicTitle}".
        Difficulty: ${difficulty}.
        ${scopeInstruction}

        Difficulty Rules:
        - Very Easy: Error is obvious (wrong verb form with clear time signal). Short sentence.
        - Easy: Error is in agreement (Subject-Verb) or basic tense usage.
        - Medium: Error is in a complex sentence (Time clause, Conditional).
        - Hard: Error is subtle (Nuance, Preposition, Article, Advanced Structure).

        Rules:
        1. Create a complete English sentence that contains **EXACTLY ONE** grammatical or logical error related to "${topicTitle}".
        2. 'errorTarget' must be the exact word or short phrase (2-3 words max) in the sentence that is incorrect.
        3. 'correctForm' is how it should be written.
        4. 'relatedTheory' should state the rule/signal words clearly.
        `;

        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: errorCorrectionSchema },
        });
        return JSON.parse(response.text.trim()) as ErrorCorrectionQuestion[];
    } catch (error) {
        console.error("Error Correction Gen Error:", error);
        return null;
    }
}

export const generateNuanceQuiz = async (topicTitle: string, count: number = 5, topicSummary?: string): Promise<GrammarNuanceQuestion[] | null> => {
    try {
        const scopeInstruction = topicSummary 
            ? `**CRITICAL SCOPE CONSTRAINT**: Focus ONLY on the nuances of concepts described here: "${topicSummary}".` 
            : "";

        const prompt = `
        Create EXACTLY ${count} "Nuance Distinction" questions for English grammar topic: "${topicTitle}".
        ${scopeInstruction}
        This is an advanced exercise to test understanding of *Reality* and *Context* rather than just grammatical correctness.

        Mechanism:
        1. Provide 2-3 sentences (options) that are grammatically correct but imply different things (e.g., Stop to smoke vs Stop smoking, Lived vs Have lived).
        2. Ask a "Thinking Question" (contextQuestion) that asks about the REALITY of the situation (e.g., "Which action is healthy?", "Who is still in London?").
        3. Explain the specific implication (nuance) of EACH option in Vietnamese.

        Example Output format:
        - contextQuestion: "Người nói câu nào hiện tại KHÔNG còn ở Tokyo nữa?"
        - options: 
            [
                {text: "I lived in Tokyo for 5 years.", nuance: "Past Simple -> Đã kết thúc trong quá khứ -> Đã rời đi."},
                {text: "I have lived in Tokyo for 5 years.", nuance: "Present Perfect -> Kéo dài đến hiện tại -> Vẫn đang ở."}
            ]
        - correctOptionIndex: 0
        - explanation: "Thì Quá khứ đơn diễn tả hành động đã chấm dứt hoàn toàn, không liên quan đến hiện tại."
        `;

        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: nuanceSchema },
        });
        return JSON.parse(response.text.trim()) as GrammarNuanceQuestion[];
    } catch (error) {
        console.error("Nuance Quiz Gen Error:", error);
        return null;
    }
}

export const evaluateQuizPerformance = async (topicTitle: string, results: QuizResult[]): Promise<GrammarAssessment | null> => {
     try {
        const prompt = `Analyze these results for topic "${topicTitle}": ${JSON.stringify(results)}. Provide a friendly but professional assessment in Vietnamese. Highlight exactly which sub-rules the user missed.`;
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: assessmentSchema },
        });
        return JSON.parse(response.text.trim()) as GrammarAssessment;
    } catch (error) {
        return null;
    }
}

export const generateMatchingPairs = async (topicTitle: string): Promise<MatchingPair[] | null> => {
    try {
        const prompt = `Create 6 challenging matching pairs for "${topicTitle}". 
        Left side: A specific structure or usage case (e.g., "S + have/has + V3" or "Usage: Action started in past, continuing now").
        Right side: The corresponding Name or Vietnamese Definition.
        Ensure pairs are distinct and not easily guessable without knowing the rule.`;
        
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: matchingSchema },
        });
        return JSON.parse(response.text.trim()) as MatchingPair[];
    } catch (error) {
        return null;
    }
}

export const generateWritingQuestions = async (topicTitle: string, focusWeaknesses?: string[]): Promise<WritingQuestion[] | null> => {
    try {
        const focusText = focusWeaknesses && focusWeaknesses.length > 0 ? `Focus specifically on these weak areas: ${focusWeaknesses.join(', ')}.` : "";
        const prompt = `Create EXACTLY 10 fill-in-the-blank writing exercises for "${topicTitle}". ${focusText}
        User must type the correct verb form or structure.
        Contexts should be academic or formal English.
        Provide hints in Vietnamese that explain the context (e.g., "Dấu hiệu 'since' chỉ thì hoàn thành").`;
        
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: writingQuestionSchema },
        });
        return JSON.parse(response.text.trim()) as WritingQuestion[];
    } catch (error) {
        return null;
    }
}

export const evaluateGrammarWriting = async (topic: string, question: string, userAnswer: string): Promise<{isCorrect: boolean, feedback: string}> => {
    try {
        const prompt = `Topic: ${topic}. Question: "${question}". User input: "${userAnswer}". 
        Check if the grammar is correct. Ignore capitalization or minor punctuation unless necessary for the rule.
        Return JSON {isCorrect: boolean, feedback: string (in Vietnamese, explain why right/wrong)}.`;
        
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { isCorrect: { type: Type.BOOLEAN }, feedback: { type: Type.STRING } },
                    required: ["isCorrect", "feedback"]
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        return { isCorrect: false, feedback: "Lỗi kết nối." };
    }
}

export const generateExamPractice = async (config: ExamPracticeConfig): Promise<ExamQuestion | null> => {
    try {
        // IMPROVED PROMPT FOR EXAM:
        let prompt = `Create a high-quality English exam task (Vietnam THPT 2025 Format) for Topic: "${config.topic}".
        Type: ${config.type}.
        
        GUIDELINES:
        - **Reading/Cloze**: The passage must be COHERENT, LOGICAL, and informative (approx. 200-350 words). Use academic vocabulary (B2/C1). Do not write simple children's stories.
        - **Arrangement**: Sentences must be long, compound sentences with connecting words (However, Therefore, Although) to make arrangement challenging but logical.
        - **Notice/Flyer**: Must look professional, strictly following standard formats (Heading, Body, Call to Action).
        - **Questions**: Must require understanding of the text, inference, or vocabulary in context. NOT just simple scanning.
        - **Context**: Must be informative and educational.
        `;
        
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt + " Explanation in Vietnamese.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING },
                        context: { type: Type.STRING },
                        subQuestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    questionText: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    correctAnswer: { type: Type.STRING },
                                    explanation: { type: Type.STRING }
                                }
                            }
                        },
                        arrangementItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctArrangement: { type: Type.ARRAY, items: { type: Type.STRING } },
                        explanation: { type: Type.STRING }
                    },
                    required: ["id", "type", "context"]
                },
            },
        });
        return JSON.parse(response.text.trim()) as ExamQuestion;
    } catch (error) {
        return null;
    }
}

export const generateTranslationTask = async (topic: string, vocabularyContext?: string[], difficulty: DifficultyLevel = 'Medium'): Promise<string | null> => {
    try {
        const vocabInstruction = vocabularyContext && vocabularyContext.length > 0 
            ? `Must naturally incorporate these words: ${vocabularyContext.join(', ')}.` 
            : "";
            
        const prompt = `Generate a short English paragraph (3-4 sentences) about "${topic}".
        Difficulty: ${difficulty}.
        ${vocabInstruction}
        The text must be coherent, grammatically complex, and sound natural (native-like).`;
        
        const response = await getAI().models.generateContent({ model: modelName, contents: prompt });
        return response.text.trim();
    } catch (error) {
        return null;
    }
}

export const evaluateTranslation = async (sourceEn: string, userVi: string): Promise<TranslationFeedback | null> => {
    try {
        const prompt = `Evaluate this translation.
        Source (EN): "${sourceEn}"
        User (VI): "${userVi}"
        
        Task:
        1. Rate accuracy (1-10).
        2. Identify mistranslations or awkward phrasing.
        3. Provide a "Corrected Version" that sounds natural in Vietnamese (Văn phong Việt Nam) but stays true to the meaning.
        
        Return JSON.`;
        
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        generalComment: { type: Type.STRING },
                        specificCorrections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    originalPhrase: { type: Type.STRING },
                                    correctedPhrase: { type: Type.STRING },
                                    explanation: { type: Type.STRING }
                                }
                            }
                        },
                        correctedVersion: { type: Type.STRING },
                        highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim()) as TranslationFeedback;
    } catch (error) {
        return null;
    }
}

export const generateWritingTask = async (mode: 'PARAGRAPH' | 'TRANSLATE_TO_EN' | 'FILL_BLANKS', topic: string, difficulty: DifficultyLevel = 'Medium'): Promise<string | null> => {
    try {
        let instruction = "";
        if (mode === 'PARAGRAPH') instruction = "Write a prompt asking the user to write a paragraph (100-150 words). Provide a structure or guiding questions.";
        if (mode === 'TRANSLATE_TO_EN') instruction = "Provide a Vietnamese paragraph (3-4 sentences) for the user to translate into English. Ensure it uses interesting vocabulary.";
        if (mode === 'FILL_BLANKS') instruction = "Create a short English paragraph with 5 blanks (represented by [___]). The blanks should test vocabulary or grammar relative to the topic.";

        const prompt = `Generate a writing task. Mode: ${mode}. Topic: ${topic}. Difficulty: ${difficulty}.
        ${instruction}
        Output ONLY the task text.`;
        
        const response = await getAI().models.generateContent({ model: modelName, contents: prompt });
        return response.text.trim();
    } catch (error) {
         return null;
    }
}

export const evaluateWriting = async (taskText: string, userText: string): Promise<WritingFeedback | null> => {
    try {
        const prompt = `Act as an IELTS Examiner. Evaluate this writing.
        Task: ${taskText}
        User's Work: ${userText}
        
        Analyze: Grammar, Vocabulary, Coherence.
        Provide a detailed JSON response with corrections and a score.`;
        
        const response = await getAI().models.generateContent({
            model: modelName,
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        correctedText: { type: Type.STRING },
                        grammarMistakes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    original: { type: Type.STRING },
                                    correction: { type: Type.STRING },
                                    explanation: { type: Type.STRING }
                                }
                            }
                        },
                        vocabularySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        generalComment: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim()) as WritingFeedback;
    } catch (error) {
         return null;
    }
}

export const generateSentencePracticeTask = async (word: string, meaning: string): Promise<string | null> => {
    try {
        // IMPROVED PROMPT for Sentence Practice
        const prompt = `Create a **context-rich, natural** Vietnamese sentence that requires the user to translate it into English using the target word: "${word}" (Meaning: ${meaning}).
        
        Constraints:
        1. The sentence must imply a specific situation (e.g., at work, travel, expressing feelings) to make the meaning clear.
        2. Do NOT create simple/boring sentences like "This is a ${word}".
        3. Output ONLY the Vietnamese sentence.`;
        
        const response = await getAI().models.generateContent({ model: modelName, contents: prompt });
        
        if (!response || !response.text) {
            console.error('AI response is empty');
            return null;
        }
        
        const text = response.text.trim();
        return text.length > 0 ? text : null;
    } catch (error: any) {
        console.error('Error generating sentence practice task:', error);
        // Check if it's an API key error
        if (error?.code === 403 || error?.message?.includes('API key')) {
            throw new Error('API key không hợp lệ hoặc đã bị chặn. Vui lòng kiểm tra lại API key trong file .env');
        }
        return null;
    }
};

const vocabModuleSchema: Schema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            word: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            meaning: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            synonyms: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING },
                        pos: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                        examples: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["word", "pos", "meaning"]
                }
            },
            antonyms: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING },
                        pos: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                        examples: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["word", "pos", "meaning"]
                }
            }
        },
        required: ["word", "pronunciation", "meaning", "examples"]
    }
};

/**
 * Generate a complete vocabulary module from a list of English words
 * Returns flashcards with pronunciation, meaning, examples, synonyms, and antonyms
 */
export const generateVocabModuleFromWords = async (words: string[]): Promise<import('../types').Flashcard[]> => {
    try {
        // Clean words - remove Vietnamese meanings in parentheses if present
        const cleanWords = words.map(w => {
            // Remove Vietnamese meaning in parentheses like "return (trả lại)" -> "return"
            const match = w.trim().match(/^([^(]+)/);
            return match ? match[1].trim() : w.trim();
        }).filter(w => w.length > 0);

        if (cleanWords.length === 0) {
            throw new Error('Không có từ nào hợp lệ');
        }

        const wordsList = cleanWords.join(', ');
        const prompt = `Create a complete vocabulary learning module for these English words: ${wordsList}.

For EACH word, provide:
1. **word**: The word with part of speech in parentheses (e.g., "sustain (v)")
2. **pronunciation**: IPA phonetic transcription (e.g., "/sə'stein/")
3. **meaning**: Vietnamese meaning
4. **examples**: 2-3 example sentences in English
5. **synonyms**: 2-3 synonyms with their part of speech, Vietnamese meaning, and 1 example each
6. **antonyms**: 1-2 antonyms with their part of speech, Vietnamese meaning, and 1 example each

Make sure all information is accurate and educational. The examples should be natural and practical.`;

        let response;
        try {
            response = await getAI().models.generateContent({
                model: modelName,
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: vocabModuleSchema },
            });
        } catch (apiError: any) {
            // Check for API key errors
            if (apiError?.code === 403 || apiError?.message?.includes('API key') || apiError?.error?.code === 403) {
                throw new Error('API key không hợp lệ hoặc đã bị chặn. Vui lòng kiểm tra lại API key trong file .env');
            }
            throw apiError;
        }

        if (!response || !response.text) {
            throw new Error('API không trả về dữ liệu');
        }

        const responseText = response.text.trim();
        if (!responseText) {
            throw new Error('API trả về dữ liệu rỗng');
        }

        let flashcards: import('../types').Flashcard[];
        try {
            flashcards = JSON.parse(responseText) as import('../types').Flashcard[];
        } catch (parseError) {
            console.error('Parse error:', parseError);
            console.error('Response text:', responseText);
            throw new Error('Không thể parse dữ liệu từ AI');
        }

        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            throw new Error('AI không tạo được từ vựng nào');
        }
        
        // Add IDs to flashcards and ensure all required fields
        return flashcards.map((card, index) => ({
            id: Date.now() + index,
            word: card.word || '',
            pronunciation: card.pronunciation || '',
            meaning: card.meaning || '',
            examples: Array.isArray(card.examples) ? card.examples : [],
            synonyms: Array.isArray(card.synonyms) ? card.synonyms : [],
            antonyms: Array.isArray(card.antonyms) ? card.antonyms : [],
        }));
    } catch (error: any) {
        console.error('Error generating vocab module:', error);
        const errorMessage = error?.message || 'Lỗi không xác định khi tạo học phần';
        throw new Error(errorMessage);
    }
};

// Generate AI response for chat
export const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
        const ai = getAI();
        const model = ai.getGenerativeModel({ model: modelName });
        
        const prompt = `Bạn là một trợ lý AI học tiếng Anh tên là "EnglishMaster Assistant". 
        
Người dùng gửi tin nhắn: "${userMessage}"

Hãy trả lời một cách thân thiện, hữu ích, và ngắn gọn (tối đa 2-3 câu).
Nếu là câu hỏi về tiếng Anh, hãy giải thích chi tiết.
Luôn trả lời bằng tiếng Việt, trừ khi người dùng hỏi bằng tiếng Anh.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return text || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
    } catch (error: any) {
        console.error('Error generating AI response:', error);
        return 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.';
    }
};
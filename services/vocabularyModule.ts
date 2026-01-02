import { Unit, VocabularyModule, Flashcard } from '../types';

const WORDS_PER_MODULE = 20;
const MODULE_TOLERANCE = 5; // Allow ±5 words

/**
 * Divides a unit into learning modules of approximately 20 words each
 * Modules can vary between 15-25 words to accommodate natural breaks
 */
export function generateModulesFromUnit(unit: Unit): VocabularyModule[] {
  // Get all words from all parts
  const allWords: Flashcard[] = [];
  unit.parts.forEach(part => {
    allWords.push(...part.words);
  });

  if (allWords.length === 0) {
    return [];
  }

  // Calculate number of modules needed
  const modules: VocabularyModule[] = [];
  let moduleCount = Math.ceil(allWords.length / WORDS_PER_MODULE);

  // Distribute words evenly across modules
  const wordsPerModule = Math.ceil(allWords.length / moduleCount);

  for (let i = 0; i < moduleCount; i++) {
    const startIdx = i * wordsPerModule;
    const endIdx = Math.min(startIdx + wordsPerModule, allWords.length);
    const moduleWords = allWords.slice(startIdx, endIdx);

    const module: VocabularyModule = {
      id: `module-${i + 1}`,
      name: `Phần ${i + 1}`,
      words: moduleWords,
      wordCount: moduleWords.length,
    };

    modules.push(module);
  }

  return modules;
}

/**
 * Generate modules for a unit if they don't exist
 */
export function ensureModulesExist(unit: Unit): Unit {
  if (!unit.modules || unit.modules.length === 0) {
    unit.modules = generateModulesFromUnit(unit);
  }
  return unit;
}

/**
 * Get all words from a module
 */
export function getModuleWords(module: VocabularyModule): Flashcard[] {
  return module.words;
}

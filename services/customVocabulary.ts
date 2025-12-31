import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { CustomVocabUnit, CustomVocabModule, Flashcard } from '../types';
import { generateVocabModuleFromWords } from './gemini';

/**
 * Create a new custom vocabulary unit for the user
 */
export async function createCustomVocabUnit(
  uid: string,
  name: string,
  description: string
): Promise<CustomVocabUnit> {
  try {
    const now = Date.now();
    const newUnit: Omit<CustomVocabUnit, 'id'> = {
      uid,
      name,
      description,
      modules: [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(
      collection(db, 'users', uid, 'customVocabUnits'),
      newUnit
    );

    return {
      ...newUnit,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error creating custom vocab unit:', error);
    throw error;
  }
}

/**
 * Get all custom vocabulary units for a user
 */
export async function getUserCustomVocabUnits(
  uid: string
): Promise<CustomVocabUnit[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, 'users', uid, 'customVocabUnits')
    );

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as CustomVocabUnit));
  } catch (error) {
    console.error('Error fetching custom vocab units:', error);
    throw error;
  }
}

/**
 * Add a manual module to a custom vocabulary unit
 */
export async function addManualModule(
  uid: string,
  unitId: string,
  module: Omit<CustomVocabModule, 'id' | 'createdAt' | 'updatedAt' | 'isAIGenerated'>
): Promise<CustomVocabModule> {
  try {
    const now = Date.now();
    const newModule: CustomVocabModule = {
      id: `module_${Date.now()}`,
      ...module,
      createdAt: now,
      updatedAt: now,
      isAIGenerated: false,
    };

    const unitRef = doc(db, 'users', uid, 'customVocabUnits', unitId);
    const unitDoc = await getDoc(unitRef);

    if (!unitDoc.exists()) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.data() as CustomVocabUnit;
    const updatedModules = [...currentUnit.modules, newModule];

    await updateDoc(unitRef, {
      modules: updatedModules,
      updatedAt: now,
    });

    return newModule;
  } catch (error) {
    console.error('Error adding manual module:', error);
    throw error;
  }
}

/**
 * Generate AI module for a custom vocabulary unit from English words
 */
export async function generateAIModule(
  uid: string,
  unitId: string,
  moduleName: string,
  words: string[] // List of English words
): Promise<CustomVocabModule> {
  try {
    // Generate vocabulary module using AI
    const flashcards = await generateVocabModuleFromWords(words);

    const now = Date.now();
    const newModule: CustomVocabModule = {
      id: `module_${Date.now()}`,
      name: moduleName,
      words: flashcards,
      createdAt: now,
      updatedAt: now,
      isAIGenerated: true,
    };

    const unitRef = doc(db, 'users', uid, 'customVocabUnits', unitId);
    const unitDoc = await getDoc(unitRef);

    if (!unitDoc.exists()) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.data() as CustomVocabUnit;
    const updatedModules = [...currentUnit.modules, newModule];

    await updateDoc(unitRef, {
      modules: updatedModules,
      updatedAt: now,
    });

    return newModule;
  } catch (error) {
    console.error('Error generating AI module:', error);
    throw error;
  }
}

/**
 * Update a module in a custom vocabulary unit
 */
export async function updateModule(
  uid: string,
  unitId: string,
  moduleId: string,
  updates: Partial<CustomVocabModule>
): Promise<void> {
  try {
    const unitRef = doc(db, 'users', uid, 'customVocabUnits', unitId);
    const unitDoc = await getDoc(unitRef);

    if (!unitDoc.exists()) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.data() as CustomVocabUnit;
    const updatedModules = currentUnit.modules.map((module) =>
      module.id === moduleId
        ? {
            ...module,
            ...updates,
            updatedAt: Date.now(),
          }
        : module
    );

    await updateDoc(unitRef, {
      modules: updatedModules,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating module:', error);
    throw error;
  }
}

/**
 * Delete a module from a custom vocabulary unit
 */
export async function deleteModule(
  uid: string,
  unitId: string,
  moduleId: string
): Promise<void> {
  try {
    const unitRef = doc(db, 'users', uid, 'customVocabUnits', unitId);
    const unitDoc = await getDoc(unitRef);

    if (!unitDoc.exists()) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.data() as CustomVocabUnit;
    const updatedModules = currentUnit.modules.filter(
      (module) => module.id !== moduleId
    );

    await updateDoc(unitRef, {
      modules: updatedModules,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error deleting module:', error);
    throw error;
  }
}

/**
 * Delete a custom vocabulary unit
 */
export async function deleteCustomVocabUnit(
  uid: string,
  unitId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', uid, 'customVocabUnits', unitId));
  } catch (error) {
    console.error('Error deleting custom vocab unit:', error);
    throw error;
  }
}


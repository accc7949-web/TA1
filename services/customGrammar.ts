import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { CustomGrammarUnit, CustomGrammarLesson } from '../types';
import { getAI } from './gemini';

/**
 * Create a new custom grammar unit for the user
 */
export async function createCustomGrammarUnit(
  uid: string,
  name: string,
  description: string
): Promise<CustomGrammarUnit> {
  try {
    const now = Date.now();
    const newUnit: Omit<CustomGrammarUnit, 'id'> = {
      uid,
      name,
      description,
      lessons: [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(
      collection(db, 'users', uid, 'customGrammarUnits'),
      newUnit
    );

    return {
      ...newUnit,
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error creating custom grammar unit:', error);
    throw error;
  }
}

/**
 * Get all custom grammar units for a user
 */
export async function getUserCustomGrammarUnits(
  uid: string
): Promise<CustomGrammarUnit[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, 'users', uid, 'customGrammarUnits')
    );

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as CustomGrammarUnit));
  } catch (error) {
    console.error('Error fetching custom grammar units:', error);
    throw error;
  }
}

/**
 * Add a manual lesson to a custom grammar unit
 */
export async function addManualLesson(
  uid: string,
  unitId: string,
  lesson: Omit<CustomGrammarLesson, 'id' | 'createdAt' | 'updatedAt' | 'isAIGenerated'>
): Promise<CustomGrammarLesson> {
  try {
    const now = Date.now();
    const newLesson: CustomGrammarLesson = {
      id: `lesson_${Date.now()}`,
      ...lesson,
      createdAt: now,
      updatedAt: now,
      isAIGenerated: false,
    };

    const unitRef = doc(db, 'users', uid, 'customGrammarUnits', unitId);
    const unitDoc = await getDocs(
      query(
        collection(db, 'users', uid, 'customGrammarUnits'),
        where('__name__', '==', unitId)
      )
    );

    if (unitDoc.empty) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.docs[0].data() as CustomGrammarUnit;
    const updatedLessons = [...currentUnit.lessons, newLesson];

    await updateDoc(unitRef, {
      lessons: updatedLessons,
      updatedAt: now,
    });

    return newLesson;
  } catch (error) {
    console.error('Error adding manual lesson:', error);
    throw error;
  }
}

/**
 * Generate AI lesson for a custom grammar unit
 */
export async function generateAILesson(
  uid: string,
  unitId: string,
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<CustomGrammarLesson> {
  try {
    const ai = getAI();

    const prompt = `Create an English grammar lesson about "${topic}" at ${difficulty} level.
    
Provide the response in this exact JSON format:
{
  "title": "lesson title",
  "description": "brief description of the lesson",
  "content": "detailed explanation with markdown formatting",
  "examples": ["example 1", "example 2", "example 3", "example 4", "example 5"]
}

Make sure the content is well-structured, clear, and educational. Include practical examples.`;

    const response = await ai.models.generateContent(prompt);
    const text = response.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const lessonData = JSON.parse(jsonMatch[0]);

    const now = Date.now();
    const newLesson: CustomGrammarLesson = {
      id: `lesson_${Date.now()}`,
      title: lessonData.title,
      description: lessonData.description,
      content: lessonData.content,
      examples: Array.isArray(lessonData.examples) ? lessonData.examples : [],
      difficulty,
      createdAt: now,
      updatedAt: now,
      isAIGenerated: true,
    };

    const unitRef = doc(db, 'users', uid, 'customGrammarUnits', unitId);
    const unitDoc = await getDocs(
      query(
        collection(db, 'users', uid, 'customGrammarUnits'),
        where('__name__', '==', unitId)
      )
    );

    if (unitDoc.empty) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.docs[0].data() as CustomGrammarUnit;
    const updatedLessons = [...currentUnit.lessons, newLesson];

    await updateDoc(unitRef, {
      lessons: updatedLessons,
      updatedAt: now,
    });

    return newLesson;
  } catch (error) {
    console.error('Error generating AI lesson:', error);
    throw error;
  }
}

/**
 * Update a lesson in a custom grammar unit
 */
export async function updateLesson(
  uid: string,
  unitId: string,
  lessonId: string,
  updates: Partial<CustomGrammarLesson>
): Promise<void> {
  try {
    const unitRef = doc(db, 'users', uid, 'customGrammarUnits', unitId);
    const unitDoc = await getDocs(
      query(
        collection(db, 'users', uid, 'customGrammarUnits'),
        where('__name__', '==', unitId)
      )
    );

    if (unitDoc.empty) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.docs[0].data() as CustomGrammarUnit;
    const updatedLessons = currentUnit.lessons.map((lesson) =>
      lesson.id === lessonId
        ? {
            ...lesson,
            ...updates,
            updatedAt: Date.now(),
          }
        : lesson
    );

    await updateDoc(unitRef, {
      lessons: updatedLessons,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
}

/**
 * Delete a lesson from a custom grammar unit
 */
export async function deleteLesson(
  uid: string,
  unitId: string,
  lessonId: string
): Promise<void> {
  try {
    const unitRef = doc(db, 'users', uid, 'customGrammarUnits', unitId);
    const unitDoc = await getDocs(
      query(
        collection(db, 'users', uid, 'customGrammarUnits'),
        where('__name__', '==', unitId)
      )
    );

    if (unitDoc.empty) {
      throw new Error('Unit not found');
    }

    const currentUnit = unitDoc.docs[0].data() as CustomGrammarUnit;
    const updatedLessons = currentUnit.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );

    await updateDoc(unitRef, {
      lessons: updatedLessons,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
}

/**
 * Delete a custom grammar unit
 */
export async function deleteCustomGrammarUnit(
  uid: string,
  unitId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', uid, 'customGrammarUnits', unitId));
  } catch (error) {
    console.error('Error deleting custom grammar unit:', error);
    throw error;
  }
}

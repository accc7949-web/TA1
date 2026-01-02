import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  onSnapshot,
  Query,
  QueryConstraint,
  startAfter,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { ChatMessage, Conversation, ChatType } from '../types';
import { generateAIResponse } from './gemini';

// Create a new conversation
export const createConversation = async (
  userId: string,
  type: ChatType,
  name: string,
  otherUserIds?: string[]
): Promise<string> => {
  try {
    const participants = type === 'direct' && otherUserIds 
      ? [userId, ...otherUserIds] 
      : type === 'community' 
      ? [userId] 
      : ['ai'];

    const docRef = await addDoc(collection(db, 'conversations'), {
      type,
      name,
      participants,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastMessage: '',
      lastMessageTime: null,
      unreadCount: 0,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// Get user's conversations
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toMillis() || 0,
      updatedAt: doc.data().updatedAt?.toMillis() || 0,
      lastMessageTime: doc.data().lastMessageTime?.toMillis() || 0,
    } as Conversation));
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

// Send a message
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderName: string,
  senderRole: string,
  content: string,
  mentions?: string[],
  senderAvatar?: string
): Promise<string> => {
  try {
    const messageData = {
      senderId,
      senderName,
      senderRole,
      senderAvatar: senderAvatar || '',
      content,
      mentions: mentions || [],
      timestamp: Timestamp.now(),
      isAIResponse: false,
    };
    
    console.log('Sending message to Firebase:', messageData);
    
    const docRef = await addDoc(
      collection(db, 'conversations', conversationId, 'messages'),
      messageData
    );

    console.log('Message saved successfully:', docRef.id);

    // Update conversation last message
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: content,
      lastMessageTime: Timestamp.now(),
      lastMessageSender: senderName,
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Listen to messages in real-time
export const listenToMessages = (
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc'),
    limit(50)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const msg: ChatMessage = {
        id: doc.id,
        conversationId,
        senderId: data.senderId || '',
        senderName: data.senderName || 'Unknown',
        senderRole: data.senderRole || 'user',
        senderAvatar: data.senderAvatar || '',
        content: data.content || '',
        timestamp: data.timestamp?.toMillis() || 0,
        mentions: data.mentions || [],
        isAIResponse: data.isAIResponse || false,
      };
      console.log('Message from Firebase:', msg);
      return msg;
    });

    console.log('Total messages retrieved:', messages.length, messages);
    callback(messages);
  });

  return unsubscribe;
};

// Get community chat room
export const getOrCreateCommunityChat = async (userId: string): Promise<string> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('type', '==', 'community')
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.size > 0) {
      return querySnapshot.docs[0].id;
    }

    // Create community chat if doesn't exist
    return await createConversation(userId, 'community', '🌍 Cộng đồng (Community)');
  } catch (error) {
    console.error('Error getting community chat:', error);
    throw error;
  }
};

// Get or create AI chat
export const getOrCreateAIChat = async (userId: string): Promise<string> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('type', '==', 'ai'),
      where('participants', 'array-contains', userId)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.size > 0) {
      return querySnapshot.docs[0].id;
    }

    // Create AI chat if doesn't exist
    return await createConversation(userId, 'ai', '🤖 AI Assistant');
  } catch (error) {
    console.error('Error getting AI chat:', error);
    throw error;
  }
};

// Handle AI message with Gemini
export const handleAIMessage = async (
  conversationId: string,
  userMessage: string,
  senderId: string,
  senderName: string
): Promise<void> => {
  try {
    // Send user message first
    await sendMessage(conversationId, senderId, senderName, 'user', userMessage);

    // Get AI response
    const aiResponse = await generateAIResponse(userMessage);

    // Send AI response
    await addDoc(
      collection(db, 'conversations', conversationId, 'messages'),
      {
        senderId: 'ai-bot',
        senderName: '🤖 AI Assistant',
        senderRole: 'ai_bot',
        content: aiResponse,
        mentions: [],
        timestamp: Timestamp.now(),
        isAIResponse: true,
      }
    );

    // Update conversation with AI response
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: aiResponse,
      lastMessageTime: Timestamp.now(),
      lastMessageSender: '🤖 AI Assistant',
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error handling AI message:', error);
    throw error;
  }
};

// Check if message mentions AI
export const isMentioningAI = (content: string): boolean => {
  return /@AI\s|@AI$|^@AI\s/.test(content);
};

// Extract mentions from message
export const extractMentions = (content: string): string[] => {
  const regex = /@(\w+)/g;
  const matches = content.match(regex);
  return matches ? matches.map(m => m.substring(1)) : [];
};

// Get user by username for direct message
export const getUserByDisplayName = async (displayName: string) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', displayName)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0]?.data() || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Get online users for current conversation type
export const getAvailableUsers = async (userId: string): Promise<any[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('uid', '!=', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting available users:', error);
    return [];
  }
};

// Mark conversation as read
export const markConversationAsRead = async (conversationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'conversations', conversationId), {
      unreadCount: 0,
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
  }
};

// Delete a conversation
export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    // Delete all messages first
    const messagesSnapshot = await getDocs(
      collection(db, 'conversations', conversationId, 'messages')
    );

    for (const msgDoc of messagesSnapshot.docs) {
      await deleteDoc(msgDoc.ref);
    }

    // Delete conversation
    await deleteDoc(doc(db, 'conversations', conversationId));
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};

// Generate room ID for DM (sorted to ensure consistency)
export const getDMRoom = (uid1: string, uid2: string): string => {
  const sorted = [uid1, uid2].sort();
  return `dm_${sorted[0]}_${sorted[1]}`;
};

// Get DM messages for a specific room
export const getDMMessages = async (roomId: string): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, 'dm_messages', roomId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      conversationId: roomId,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis() || 0,
    } as ChatMessage));
  } catch (error) {
    console.error('Error getting DM messages:', error);
    return [];
  }
};

// Send DM message
export const sendDMMessage = async (
  roomId: string,
  senderId: string,
  senderName: string,
  senderRole: string,
  content: string,
  senderAvatar?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, 'dm_messages', roomId, 'messages'),
      {
        senderId,
        senderName,
        senderRole,
        senderAvatar: senderAvatar || '',
        content,
        timestamp: Timestamp.now(),
        isAIResponse: false,
      }
    );

    return docRef.id;
  } catch (error) {
    console.error('Error sending DM:', error);
    throw error;
  }
};

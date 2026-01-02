import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { ChatMessage, Conversation, UserRole } from '../types';
import {
  listenToMessages,
  sendMessage,
  handleAIMessage,
  isMentioningAI,
  extractMentions,
  getOrCreateCommunityChat,
  getOrCreateAIChat,
  getAvailableUsers,
  getDMRoom,
  getDMMessages,
  sendDMMessage,
} from '../services/chat';
import { getUserProfile, UserProfile } from '../services/auth';
import { generateAIResponse } from '../services/gemini';

interface ChatPanelProps {
  user: User;
  userProfile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

interface DMUser {
  uid: string;
  displayName: string;
  role?: UserRole;
  avatar?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ user, userProfile, isOpen, onClose }) => {
  // ========== STATE SEPARATION BY TAB ==========
  // Community Chat: Real-time Firebase data
  const [communityConversationId, setCommunityConversationId] = useState<string | null>(null);
  const [communityMessages, setCommunityMessages] = useState<ChatMessage[]>([]);
  
  // AI Chat: Local state only
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  
  // Direct Messages: Session data
  const [availableUsers, setAvailableUsers] = useState<DMUser[]>([]);
  const [selectedDMUser, setSelectedDMUser] = useState<DMUser | null>(null);
  const [dmMessages, setDmMessages] = useState<ChatMessage[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'community' | 'ai' | 'dm'>('community');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Initialize community chat
  useEffect(() => {
    if (isOpen && activeTab === 'community' && !communityConversationId) {
      loadCommunityChat();
    }
  }, [isOpen, activeTab, communityConversationId]);

  // Initialize DM user list
  useEffect(() => {
    if (isOpen && activeTab === 'dm') {
      loadAvailableUsers();
    }
  }, [isOpen, activeTab]);

  // Listen to community messages
  useEffect(() => {
    if (activeTab === 'community' && communityConversationId) {
      setLoading(true);
      unsubscribeRef.current = listenToMessages(communityConversationId, (msgs) => {
        console.log('ChatPanel received messages:', msgs);
        setCommunityMessages(msgs);
        setLoading(false);
      });

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    }
  }, [activeTab, communityConversationId]);

  // Listen to DM messages when user is selected
  useEffect(() => {
    if (activeTab === 'dm' && selectedDMUser) {
      loadDMMessages();
    }
  }, [activeTab, selectedDMUser]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [communityMessages, aiMessages, dmMessages]);

  const loadCommunityChat = async () => {
    if (!user) return;
    try {
      const chatId = await getOrCreateCommunityChat(user.uid);
      setCommunityConversationId(chatId);
    } catch (error) {
      console.error('Error loading community chat:', error);
    }
  };

  const loadAvailableUsers = async () => {
    if (!user) return;
    try {
      const users = await getAvailableUsers(user.uid);
      setAvailableUsers(users as DMUser[]);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadDMMessages = async () => {
    if (!user || !selectedDMUser) return;
    try {
      setLoading(true);
      const roomId = getDMRoom(user.uid, selectedDMUser.uid);
      const messages = await getDMMessages(roomId);
      setDmMessages(messages);
    } catch (error) {
      console.error('Error loading DM messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDMUser = (dmUser: DMUser) => {
    setSelectedDMUser(dmUser);
    setDmMessages([]);
  };

  const handleGoBackToUserList = () => {
    setSelectedDMUser(null);
    setDmMessages([]);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !userProfile) return;

    const trimmedMessage = messageInput.trim();
    setMessageInput('');
    setLoading(true);

    try {
      const mentions = extractMentions(trimmedMessage);

      if (activeTab === 'community') {
        if (!communityConversationId) return;

        // Handle AI mention
        if (isMentioningAI(trimmedMessage)) {
          // Send user message
          await sendMessage(
            communityConversationId,
            user.uid,
            userProfile.displayName,
            userProfile.role || 'user',
            trimmedMessage,
            mentions,
            user.photoURL || ''
          );

          // Get AI response
          const cleanMessage = trimmedMessage.replace(/@AI\s?/g, '').trim();
          const aiResponse = await generateAIResponse(cleanMessage);

          // Send AI response
          await sendMessage(
            communityConversationId,
            'ai-bot',
            '🤖 AI Assistant',
            'ai_bot',
            aiResponse,
            [],
            ''
          );
        } else {
          // Regular community message
          await sendMessage(
            communityConversationId,
            user.uid,
            userProfile.displayName,
            userProfile.role || 'user',
            trimmedMessage,
            mentions,
            user.photoURL || ''
          );
        }
      } else if (activeTab === 'ai') {
        // Add user message to local state
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          conversationId: 'ai-chat',
          senderId: user.uid,
          senderName: userProfile.displayName,
          senderRole: userProfile.role || 'user',
          senderAvatar: user.photoURL || '',
          content: trimmedMessage,
          timestamp: Date.now(),
        };
        setAiMessages(prev => [...prev, userMsg]);

        // Get AI response
        const aiResponse = await generateAIResponse(trimmedMessage);

        // Add AI message to local state
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          conversationId: 'ai-chat',
          senderId: 'ai-bot',
          senderName: '🤖 AI Assistant',
          senderRole: 'ai_bot',
          senderAvatar: '',
          content: aiResponse,
          timestamp: Date.now() + 1,
          isAIResponse: true,
        };
        setAiMessages(prev => [...prev, aiMsg]);
      } else if (activeTab === 'dm' && selectedDMUser) {
        // Send DM message
        const roomId = getDMRoom(user.uid, selectedDMUser.uid);
        await sendDMMessage(
          roomId,
          user.uid,
          userProfile.displayName,
          userProfile.role || 'user',
          trimmedMessage,
          user.photoURL || ''
        );
        
        // Reload DM messages
        await loadDMMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageInput(trimmedMessage); // Restore message on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl transition-all duration-300 z-50 flex flex-col ${
          isOpen ? 'w-full md:w-[30%]' : 'w-0'
        }`}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between border-b border-blue-200 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <h2 className="text-lg font-bold">Chat</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
              <button
                onClick={() => {
                  if (activeTab === 'community') return; // Already on this tab, don't toggle
                  setActiveTab('community');
                  setCommunityMessages([]);
                }}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                  activeTab === 'community'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🌍 Cộng đồng
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'ai') return; // Already on this tab, don't toggle
                  setActiveTab('ai');
                  setAiMessages([]);
                }}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                  activeTab === 'ai'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🤖 AI
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'dm') return; // Already on this tab, don't toggle
                  setActiveTab('dm');
                  handleGoBackToUserList();
                }}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                  activeTab === 'dm'
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                👤 DM
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {activeTab === 'dm' && !selectedDMUser ? (
                // DM User List
                <div className="space-y-2">
                  {loading && availableUsers.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Đang tải danh sách người dùng...</p>
                    </div>
                  ) : availableUsers.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Không có người dùng khác để chat</p>
                    </div>
                  ) : (
                    availableUsers.map(dmUser => (
                      <button
                        key={dmUser.uid}
                        onClick={() => handleSelectDMUser(dmUser)}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-50 border border-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm ${
                            dmUser.role === 'admin' ? 'from-yellow-400 to-yellow-600' :
                            dmUser.role === 'moderator' ? 'from-purple-400 to-purple-600' :
                            dmUser.role === 'ai_bot' ? 'from-cyan-400 to-cyan-600' :
                            'from-blue-400 to-blue-600'
                          }`}>
                            {dmUser.displayName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{dmUser.displayName}</p>
                            {dmUser.role && dmUser.role !== 'user' && (
                              <p className="text-xs text-gray-500">
                                {dmUser.role === 'admin' && '👑 Admin'}
                                {dmUser.role === 'moderator' && '🛡️ Moderator'}
                                {dmUser.role === 'ai_bot' && '🤖 AI Bot'}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                // Messages Display
                <>
                  {loading && (activeTab === 'community' ? communityMessages.length === 0 : activeTab === 'ai' ? aiMessages.length === 0 : dmMessages.length === 0) ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Đang tải tin nhắn...</p>
                    </div>
                  ) : (activeTab === 'community' ? communityMessages.length === 0 : activeTab === 'ai' ? aiMessages.length === 0 : dmMessages.length === 0) ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>
                        {activeTab === 'community' && '✨ Hãy bắt đầu cuộc trò chuyện!'}
                        {activeTab === 'ai' && '🤖 Chat với AI Assistant'}
                        {activeTab === 'dm' && '👤 Chọn hoặc bắt đầu một cuộc trò chuyện'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {(activeTab === 'community' ? communityMessages : activeTab === 'ai' ? aiMessages : dmMessages).map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderId === user.uid ? 'flex-row-reverse justify-start' : 'flex-row'
                          } gap-3 mb-4`}
                        >
                          {/* Column 1: Avatar */}
                          {msg.senderId !== user.uid && (
                            <div className="flex-shrink-0">
                              <img
                                src={msg.senderAvatar || 'https://via.placeholder.com/40'}
                                alt={msg.senderName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                                }}
                              />
                            </div>
                          )}

                          {/* Column 2: Content (Sender name + Message bubble) */}
                          <div className={`flex flex-col ${msg.senderId === user.uid ? 'items-end' : 'items-start'} max-w-xs flex-1`}>
                            {/* Row 1: Sender name + Role icon */}
                            {msg.senderId !== user.uid && (
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-xs font-semibold text-gray-700">
                                  {msg.senderName}
                                </span>
                                {msg.senderRole && msg.senderRole !== 'user' && (
                                  <span className="text-sm">
                                    {msg.senderRole === 'admin' && '👑'}
                                    {msg.senderRole === 'moderator' && '🛡️'}
                                    {msg.senderRole === 'ai_bot' && '🤖'}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Row 2: Message bubble */}
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                msg.senderId === user.uid
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-300 text-gray-900'
                              }`}
                            >
                              <p className="text-sm break-words">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.senderId === user.uid ? 'text-blue-100' : 'text-gray-600'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 shrink-0">
              {activeTab === 'dm' && selectedDMUser && (
                <button
                  onClick={handleGoBackToUserList}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold mb-2"
                >
                  ← Quay lại danh sách
                </button>
              )}
              <div className="text-xs text-gray-500 mb-2">
                {activeTab === 'community' && '💡 Gõ @AI để gọi AI Assistant'}
                {activeTab === 'ai' && '💡 Chat trực tiếp với AI'}
                {activeTab === 'dm' && selectedDMUser && `💡 Chat riêng với ${selectedDMUser.displayName}`}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    activeTab === 'community'
                      ? 'Nhắn tin cộng đồng... (gõ @AI để gọi AI)'
                      : activeTab === 'ai'
                      ? 'Hỏi AI Assistant...'
                      : selectedDMUser
                      ? `Nhắn tin với ${selectedDMUser.displayName}...`
                      : 'Chọn một người dùng để chat'
                  }
                  disabled={loading || (activeTab === 'dm' && !selectedDMUser)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !messageInput.trim() || (activeTab === 'dm' && !selectedDMUser)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold text-sm"
                >
                  {loading ? '⏳' : '📤'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatPanel;

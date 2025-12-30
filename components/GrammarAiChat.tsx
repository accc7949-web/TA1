
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GrammarTopic } from '../types';
import Header from './common/Header';

interface GrammarAiChatProps {
    topic: GrammarTopic;
    onBack: () => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const GrammarAiChat: React.FC<GrammarAiChatProps> = ({ topic, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `Xin chào! Mình là gia sư AI vui tính đây. 👋\nChúng ta đang học về bài: **${topic.title}**.\n\nBạn muốn mình giúp gì nào? \n- Giải thích lại cho dễ hiểu hơn? 🧠\n- Cho ví dụ thực tế? 📝\n- Kể một câu chuyện dùng ngữ pháp này? 📖\n- Hay so sánh với cái gì khác? ⚖️` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatSessionRef = useRef<Chat | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Chat Session
    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const systemInstruction = `
        You are a friendly, energetic, and helpful English grammar tutor specifically for Vietnamese students.
        Your persona is fun, encouraging, and uses emojis to make learning less boring.
        The user is currently studying the topic: "${topic.title}".
        The summary of this topic is: "${topic.summary}".
        
        Your goals:
        1. Explain complex grammar concepts in simple Vietnamese, using analogies (ví dụ so sánh đời thường).
        2. Provide examples in English with Vietnamese translations.
        3. Correct the user if they make a mistake in a supportive way.
        4. If asked, tell short, funny stories using the target grammar.
        5. Keep responses concise but informative. Do not write long essays unless asked.
        
        IMPORTANT: ALWAYS RESPOND IN VIETNAMESE (except for the English examples).
        `;

        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
            history: [
                 { role: 'user', parts: [{ text: `Hi, I am learning about ${topic.title}. Help me.` }] },
                 { role: 'model', parts: [{ text: messages[0].text }] }
            ]
        });
    }, [topic]);

    const handleSend = async () => {
        if (!input.trim() || !chatSessionRef.current) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMessage });
            const responseText = result.text;
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Xin lỗi, mình đang bị mất kết nối một chút. Bạn thử lại nhé! 😓" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
        // Optional: Auto send
        // setTimeout(() => handleSend(), 100); 
    }

    return (
        <div className="flex flex-col items-center w-full h-screen bg-slate-100 pb-4">
            <div className="w-full max-w-2xl flex flex-col h-full bg-white shadow-2xl md:rounded-xl overflow-hidden">
                 {/* Custom Header for Chat */}
                <div className="bg-pink-500 p-4 flex items-center justify-between text-white shadow-md z-10">
                    <button onClick={onBack} className="p-2 hover:bg-pink-600 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg font-bold">Gia sư AI 🤖</h1>
                        <p className="text-xs text-pink-100 opacity-90">{topic.title}</p>
                    </div>
                    <div className="w-10"></div> 
                </div>

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                                <div className="flex-shrink-0 mb-1">
                                    {msg.role === 'user' ? <UserIcon /> : <RobotIcon />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm md:text-base whitespace-pre-wrap shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-sky-500 text-white rounded-br-none' 
                                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-200'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                             <div className="flex items-center gap-2 ml-10 bg-white p-3 rounded-xl rounded-bl-none border border-slate-200 shadow-sm">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {!isLoading && messages.length < 3 && (
                    <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                        <button onClick={() => handleQuickPrompt("Giải thích dễ hiểu hơn đi")} className="whitespace-nowrap px-3 py-1 bg-white border border-pink-300 text-pink-600 rounded-full text-xs hover:bg-pink-50">🧠 Giải thích dễ hiểu</button>
                        <button onClick={() => handleQuickPrompt("Cho mình ví dụ thực tế")} className="whitespace-nowrap px-3 py-1 bg-white border border-emerald-300 text-emerald-600 rounded-full text-xs hover:bg-emerald-50">📝 Ví dụ thực tế</button>
                        <button onClick={() => handleQuickPrompt("Kể chuyện dùng ngữ pháp này")} className="whitespace-nowrap px-3 py-1 bg-white border border-purple-300 text-purple-600 rounded-full text-xs hover:bg-purple-50">📖 Kể chuyện</button>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Hỏi gì đó đi..."
                            className="flex-grow px-4 py-3 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrammarAiChat;

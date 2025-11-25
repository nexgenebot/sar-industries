import React, { useState, useEffect, useRef } from 'react';
import { createChatSession, sendMessageToAssistant } from '../services/geminiService';
import { useData } from '../context/DataContext';
import { ChatMessage } from '../types';
import { MessageSquare, X, Send, Sparkles, User, Minimize2, Maximize2, Bot } from 'lucide-react';

export const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'welcome', role: 'assistant', content: 'Hello! I am SarAI. How can I assist you with Sar Industries operations today?', timestamp: Date.now() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get current context data
    const { campaigns, businesses, audiences, userProfile } = useData();

    // Initialize chat session with context when opened
    useEffect(() => {
        if (isOpen) {
            const contextSummary = JSON.stringify({
                user: userProfile.firstName,
                campaigns: campaigns.map(c => ({ name: c.name, status: c.status, roas: c.roas, spend: c.spend })),
                activeBusinesses: businesses.length,
                audiences: audiences.map(a => a.name)
            });
            createChatSession(contextSummary);
        }
    }, [isOpen, campaigns, businesses, audiences, userProfile]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        const responseText = await sendMessageToAssistant(userMsg.content);

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white hover:scale-110 transition-transform z-50 group"
            >
                <Bot size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-8 right-8 bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 ${isExpanded ? 'w-[500px] h-[700px]' : 'w-[380px] h-[500px]'}`}>
            {/* Header */}
            <div className="h-16 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border flex items-center justify-between px-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg">
                        <Bot size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-textMain text-sm">SarAI Assistant</h3>
                        <p className="text-[10px] text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-textMuted">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:text-white">
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            msg.role === 'user' 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-zinc-800 text-textMain rounded-bl-none border border-border'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-800 border border-border rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-surface">
                <div className="relative">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask SarAI anything..."
                        className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-textMain focus:ring-2 focus:ring-primary outline-none shadow-inner"
                        autoFocus
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-lg hover:bg-primaryHover disabled:opacity-50 disabled:bg-zinc-700 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
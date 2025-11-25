
import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { MOCK_CONVERSATIONS } from '../constants';
import { Conversation, Platform, Message } from '../types';
import { generateSmartReplies } from '../services/geminiService';
import { 
    Search, Filter, Facebook, Instagram, Phone, Star, Archive, MoreHorizontal, 
    Paperclip, Smile, Send, Sparkles, MapPin, Mail, Tag, Clock, CheckCircle 
} from 'lucide-react';

export const UnifiedInbox: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Unread'>('All');
    const [platformFilter, setPlatformFilter] = useState<'All' | Platform>('All');
    const [replyText, setReplyText] = useState('');
    const [smartReplies, setSmartReplies] = useState<string[]>([]);
    const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedConversation = conversations.find(c => c.id === selectedId);

    useEffect(() => {
        if (selectedConversation) {
            // Simulate reading
            if(selectedConversation.isUnread) {
                setConversations(prev => prev.map(c => c.id === selectedId ? {...c, isUnread: false} : c));
            }
            // Generate suggestions for the last user message
            const lastMsg = selectedConversation.messages[selectedConversation.messages.length - 1];
            if (lastMsg.sender === 'user') {
                setIsGeneratingReplies(true);
                generateSmartReplies(lastMsg.content).then(replies => {
                    setSmartReplies(replies);
                    setIsGeneratingReplies(false);
                });
            } else {
                setSmartReplies([]);
            }
            scrollToBottom();
        }
    }, [selectedId]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleSend = () => {
        if (!replyText || !selectedId) return;
        const newMsg: Message = {
            id: Date.now().toString(),
            sender: 'admin',
            content: replyText,
            timestamp: Date.now()
        };
        
        setConversations(prev => prev.map(c => {
            if (c.id === selectedId) {
                return {
                    ...c,
                    messages: [...c.messages, newMsg],
                    lastMessageTime: 'Now'
                };
            }
            return c;
        }));
        setReplyText('');
        scrollToBottom();
    };

    const filteredConvs = conversations.filter(c => 
        (activeFilter === 'All' || (activeFilter === 'Unread' && c.isUnread)) &&
        (platformFilter === 'All' || c.platform === platformFilter) &&
        c.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 overflow-hidden">
            {/* Left Sidebar: List */}
            <div className="w-full md:w-80 bg-surface border border-border rounded-xl flex flex-col overflow-hidden shrink-0">
                <div className="p-4 border-b border-border space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            Inbox <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{conversations.filter(c=>c.isUnread).length}</span>
                        </h2>
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-textMuted" />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {/* Filters */}
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1 p-1 bg-background rounded-lg border border-border">
                            {['All', 'Unread'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter as any)}
                                    className={`flex-1 text-xs font-medium py-1.5 rounded transition-all ${activeFilter === filter ? 'bg-zinc-700 text-white shadow' : 'text-textMuted hover:text-textMain'}`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between gap-1">
                             <button 
                                onClick={() => setPlatformFilter('All')}
                                className={`flex-1 p-1.5 rounded border ${platformFilter === 'All' ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-transparent border-transparent text-textMuted hover:bg-zinc-800'}`} title="All"
                            >
                                <Filter size={14} className="mx-auto" />
                            </button>
                            <button 
                                onClick={() => setPlatformFilter(Platform.FACEBOOK)}
                                className={`flex-1 p-1.5 rounded border ${platformFilter === Platform.FACEBOOK ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-transparent border-transparent text-textMuted hover:bg-zinc-800'}`} title="Facebook"
                            >
                                <Facebook size={14} className="mx-auto" />
                            </button>
                            <button 
                                onClick={() => setPlatformFilter(Platform.INSTAGRAM)}
                                className={`flex-1 p-1.5 rounded border ${platformFilter === Platform.INSTAGRAM ? 'bg-pink-900/30 border-pink-500 text-pink-400' : 'bg-transparent border-transparent text-textMuted hover:bg-zinc-800'}`} title="Instagram"
                            >
                                <Instagram size={14} className="mx-auto" />
                            </button>
                            <button 
                                onClick={() => setPlatformFilter(Platform.WHATSAPP)}
                                className={`flex-1 p-1.5 rounded border ${platformFilter === Platform.WHATSAPP ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-transparent border-transparent text-textMuted hover:bg-zinc-800'}`} title="WhatsApp"
                            >
                                <Phone size={14} className="mx-auto" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredConvs.length === 0 && (
                        <div className="p-8 text-center text-textMuted text-xs">No conversations found.</div>
                    )}
                    {filteredConvs.map(conv => (
                        <div 
                            key={conv.id} 
                            onClick={() => setSelectedId(conv.id)}
                            className={`p-4 border-b border-border/50 cursor-pointer hover:bg-zinc-800/50 transition-colors ${selectedId === conv.id ? 'bg-zinc-800/80 border-l-2 border-l-primary' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-semibold text-sm flex items-center gap-2">
                                    {conv.isUnread && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                    {conv.userName}
                                </div>
                                <span className="text-[10px] text-textMuted">{conv.lastMessageTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className={`text-xs truncate max-w-[180px] ${conv.isUnread ? 'text-textMain font-medium' : 'text-textMuted'}`}>
                                    {conv.messages[conv.messages.length-1].content}
                                </p>
                                <div className={`p-1 rounded bg-zinc-700/50 ${
                                    conv.platform === Platform.FACEBOOK ? 'text-blue-500' :
                                    conv.platform === Platform.INSTAGRAM ? 'text-pink-500' : 'text-green-500'
                                }`}>
                                    {conv.platform === Platform.FACEBOOK ? <Facebook size={12} /> : 
                                     conv.platform === Platform.INSTAGRAM ? <Instagram size={12} /> : <Phone size={12} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle: Chat Area */}
            {selectedConversation ? (
                <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col overflow-hidden relative">
                    {/* Header */}
                    <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface/95 backdrop-blur z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center font-bold text-textMuted">
                                {selectedConversation.userName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-textMain">{selectedConversation.userName}</h3>
                                <div className="flex items-center gap-2 text-xs text-textMuted">
                                    <span className="capitalize">{selectedConversation.platform}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                                    {selectedConversation.location}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 text-textMuted">
                            <button className="p-2 hover:bg-zinc-800 rounded-lg"><Star size={18} /></button>
                            <button className="p-2 hover:bg-zinc-800 rounded-lg"><Archive size={18} /></button>
                            <button className="p-2 hover:bg-zinc-800 rounded-lg"><MoreHorizontal size={18} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-950/30 custom-scrollbar">
                        {selectedConversation.messages.map((msg, idx) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                                    msg.sender === 'admin' 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-zinc-800 text-textMain rounded-bl-none border border-border'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Smart Replies */}
                    {smartReplies.length > 0 && (
                        <div className="px-6 py-2 flex gap-2 overflow-x-auto">
                            <div className="flex items-center gap-1 text-xs text-accent font-medium shrink-0 mr-2">
                                <Sparkles size={12} /> AI Suggestions
                            </div>
                            {smartReplies.map((reply, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setReplyText(reply)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs hover:bg-accent/20 transition-colors"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-surface border-t border-border">
                        <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                            <button className="text-textMuted hover:text-textMain"><Paperclip size={20} /></button>
                            <input 
                                type="text" 
                                className="flex-1 bg-transparent outline-none text-sm h-10"
                                placeholder="Type a message..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className="text-textMuted hover:text-textMain"><Smile size={20} /></button>
                            <button 
                                onClick={handleSend}
                                disabled={!replyText}
                                className="p-2 bg-primary text-white rounded-lg hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-surface border border-border rounded-xl flex items-center justify-center text-textMuted flex-col gap-4">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
                        <Filter size={32} />
                    </div>
                    <p>Select a conversation to start chatting</p>
                </div>
            )}

            {/* Right Sidebar: CRM */}
            {selectedConversation && (
                <div className="hidden lg:block w-72 bg-surface border border-border rounded-xl overflow-hidden shrink-0 animate-in slide-in-from-right-4 duration-500">
                    <div className="p-6 border-b border-border text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-800 flex items-center justify-center font-bold text-2xl text-textMuted mb-4 border-2 border-border">
                            {selectedConversation.userName.charAt(0)}
                        </div>
                        <h3 className="font-bold text-lg">{selectedConversation.userName}</h3>
                        <p className="text-sm text-textMuted">Customer since 2023</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-textMuted">
                                <Mail size={16} /> {selectedConversation.email || 'No email'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-textMuted">
                                <MapPin size={16} /> {selectedConversation.location || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-textMuted">
                                <Clock size={16} /> Local time: 2:45 PM
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h4 className="text-xs font-bold text-textMuted uppercase mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedConversation.tags.map(tag => (
                                    <Badge key={tag} variant="neutral" className="text-xs py-1 px-2">
                                        {tag}
                                    </Badge>
                                ))}
                                <button className="text-xs flex items-center gap-1 text-primary hover:underline mt-1">
                                    <Tag size={12} /> Add Tag
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h4 className="text-xs font-bold text-textMuted uppercase mb-3">Lifetime Value</h4>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-emerald-400">${selectedConversation.ltv || 0}</span>
                                <Badge variant="success" className="text-[10px]">+12%</Badge>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <Button variant="secondary" className="w-full">Create Order</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

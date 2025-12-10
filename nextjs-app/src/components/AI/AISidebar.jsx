import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Paperclip, FileText, Shield, Bot, User } from 'lucide-react';
import SourceSelector from './SourceSelector';
import { aiService } from '@/lib/ai/AIService';
import * as mockStorage from '@/lib/storage';

export default function AISidebar({ currentUser, currentDoc, onClose, embedded = false }) {
    const [messages, setMessages] = useState([
        { id: 'welcome', role: 'ai', content: '你好！我是您的 AI 助手。我可以帮您总结文档、回答问题，或者查询系统知识库。' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [sources, setSources] = useState([]); // Array of docs
    const [isSourceSelectorOpen, setIsSourceSelectorOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Initialize with current doc as source
    useEffect(() => {
        if (currentDoc) {
            setSources([{ ...currentDoc, type: 'user' }]);
        }
    }, [currentDoc]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    const handleAddSource = (doc) => {
        setSources(prev => [...prev, doc]);
        setIsSourceSelectorOpen(false);
    };

    const handleRemoveSource = (docId) => {
        setSources(prev => prev.filter(s => s.id !== docId));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setIsThinking(true);

        // Prepare Context
        let context = '';
        if (sources.length > 0) {
            context = sources.map(s => `Document: ${s.title}\nContent: ${s.content || ''}`).join('\n\n');
        }

        // Construct Prompt
        const prompt = `
You are a helpful AI assistant for a document editor.
User Query: "${userMsg.content}"

Context Documents:
${context}

Instructions:
1. Answer the user's query based on the provided Context Documents.
2. If the answer is not in the documents, use your general knowledge but mention that it's not from the context.
3. Be concise and professional.
`;

        try {
            let aiResponseText = '';
            const aiMsgId = Date.now() + 1;

            // Add initial empty AI message
            setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '' }]);

            await aiService.streamText(prompt, (chunk) => {
                aiResponseText += chunk;
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, content: aiResponseText } : msg
                ));
            });
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', content: `Error: ${error.message}` }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className={`${embedded ? 'w-full h-full border-none shadow-none' : 'w-96 bg-white border-l border-gray-200 shadow-xl'} flex flex-col z-30 flex-shrink-0`}>
            {/* Header - Only show if not embedded */}
            {!embedded && (
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-2 text-blue-700">
                        <Sparkles size={20} />
                        <h2 className="font-semibold">AI 助手</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/50 rounded-full text-gray-500">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Sources Area */}
            <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">知识来源 ({sources.length})</span>
                    <button
                        onClick={() => setIsSourceSelectorOpen(true)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Paperclip size={12} /> 添加来源
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                    {sources.map(source => (
                        <div key={source.id} className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${source.type === 'system' ? 'bg-purple-100 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-700'}`}>
                            {source.type === 'system' ? <Shield size={10} /> : <FileText size={10} />}
                            <span className="max-w-[100px] truncate" title={source.title}>{source.title}</span>
                            <button onClick={() => handleRemoveSource(source.id)} className="hover:text-red-500"><X size={10} /></button>
                        </div>
                    ))}
                    {sources.length === 0 && (
                        <span className="text-xs text-gray-400 italic">暂无上下文，请添加文档...</span>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === 'ai' ? 'bg-white border border-gray-200 shadow-sm text-gray-800' : 'bg-blue-600 text-white'}`}>
                            {msg.content ? msg.content : (
                                <div className="flex gap-1 py-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Auto-resize
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="输入问题，或使用 @ 引用文档..."
                        className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-[150px] py-2 px-2 text-sm custom-scrollbar"
                        rows={1}
                        style={{ minHeight: '40px' }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isThinking}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition mb-0.5 flex-shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 text-center flex justify-between px-2">
                    <span>Shift + Enter 换行</span>
                    <span>AI 可能会犯错，请核对重要信息。</span>
                </div>
            </form>

            <SourceSelector
                isOpen={isSourceSelectorOpen}
                onClose={() => setIsSourceSelectorOpen(false)}
                onSelect={handleAddSource}
                currentUser={currentUser}
                excludeIds={sources.map(s => s.id)}
            />
        </div>
    );
}

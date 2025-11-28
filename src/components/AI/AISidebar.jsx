import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Paperclip, FileText, Shield, Bot, User } from 'lucide-react';
import SourceSelector from './SourceSelector';
import * as mockStorage from '../../services/mockStorage';

export default function AISidebar({ currentUser, currentDoc, onClose, embedded = false }) {
    const [messages, setMessages] = useState([
        { id: 'welcome', role: 'ai', content: '你好！我是您的 AI 助手。我可以帮您总结文档、回答问题，或者查询系统知识库。' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [sources, setSources] = useState([]); // Array of docs
    const [isSourceSelectorOpen, setIsSourceSelectorOpen] = useState(false);
    const messagesEndRef = useRef(null);

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
        setIsThinking(true);

        // Mock AI Logic (RAG)
        setTimeout(() => {
            const response = generateMockResponse(userMsg.content, sources);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: response }]);
            setIsThinking(false);
        }, 1500);
    };

    // --- Mock RAG Logic ---
    const generateMockResponse = (query, contextDocs) => {
        const lowerQuery = query.toLowerCase();

        // 1. Check for specific keywords
        if (lowerQuery.includes('总结') || lowerQuery.includes('summary')) {
            if (contextDocs.length === 0) return '请先添加一些文档作为上下文，我才能帮您总结。';
            const doc = contextDocs[0];
            return `基于文档 **《${doc.title}》** 的总结：\n\n这是一个关于${doc.title}的文档。主要内容包括：\n1. 核心定义与范围\n2. 执行标准与流程\n3. 相关责任人\n\n(这是模拟的总结内容)`;
        }

        if (lowerQuery.includes('合规') || lowerQuery.includes('compliance')) {
            const sysDoc = mockStorage.getSystemKnowledge().find(d => d.id === 'sys_compliance');
            if (sysDoc) {
                return `根据 **系统知识库 - ${sysDoc.title}**：\n\n${sysDoc.content}\n\n建议您在编写文档时注意这些合规要求。`;
            }
        }

        // 2. Keyword matching in context
        const relevantDocs = contextDocs.filter(doc =>
            (doc.content || '').toLowerCase().includes(lowerQuery) ||
            (doc.title || '').toLowerCase().includes(lowerQuery)
        );

        if (relevantDocs.length > 0) {
            const docNames = relevantDocs.map(d => `《${d.title}》`).join('、');
            return `我在以下文档中找到了相关信息：${docNames}。\n\n具体内容似乎涉及到了您的查询关键词。建议您仔细阅读这些文档的第 2-3 章节。\n\n(模拟回复：已定位到相关文档)`;
        }

        // 3. Fallback
        return '抱歉，我在当前的上下文中没有找到相关信息。您可以尝试：\n1. 添加更多相关文档作为来源\n2. 检查系统知识库\n3. 换一个提问方式';
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
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="输入问题，或使用 @ 引用文档..."
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isThinking}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 text-center">
                    AI 可能会犯错，请核对重要信息。
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

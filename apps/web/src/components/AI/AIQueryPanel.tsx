"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, Globe, Database, Loader2, Bot, User, Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Copy, FileText, ExternalLink } from 'lucide-react';
import { aiService } from '@/lib/ai/AIService';
import KnowledgeBaseSelector, { type SearchScope } from './KnowledgeBaseSelector';
import type { SearchReference, Message } from '@/hooks/useConversationHistory';

interface AIQueryPanelProps {
    currentUser?: {
        uid: string;
        email?: string;
        displayName?: string;
    } | null;
    // 知识库搜索范围
    teamId?: string;
    knowledgeBaseId?: string;
    documentId?: string;
    searchScope?: 'all' | 'team' | 'knowledgeBase' | 'document';
    // 知识库选择器（ask-ai 页面使用）
    searchScopeValue?: SearchScope;
    onSearchScopeChange?: (scope: SearchScope) => void;
    // 外部传入的对话管理
    messages?: Message[];
    onAddMessage?: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
    onUpdateMessage?: (messageId: string, updates: Partial<Message>) => void;
    onReferencesUpdate?: (refs: SearchReference[]) => void;
}

// 快捷问题示例
const QUICK_QUESTIONS = [
    { icon: '🔥', text: '帮我总结知识库中的制度文档要点' },
    { icon: '🔥', text: '查询报销政策相关规定' },
    { icon: '🔥', text: '搜索最近更新的文档' },
    { icon: '🔥', text: '帮我整理会议记录模板' },
];

// 获取问候语
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
}

// 引用来源组件
function ReferenceList({ references, isExpanded, onToggle }: {
    references: SearchReference[];
    isExpanded: boolean;
    onToggle: () => void;
}) {
    if (references.length === 0) return null;

    return (
        <div className="mt-3 border-t border-gray-100 pt-3">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                引用 {references.length} 篇资料作为参考
            </button>

            {isExpanded && (
                <div className="mt-2 space-y-2">
                    {references.map((ref, idx) => {
                        const docId = ref.document_id || ref.metadata?.docId || ref.id;
                        const isSpreadsheet = ref.type === 'spreadsheet' || ref.metadata?.type === 'spreadsheet';
                        const teamId = ref.metadata?.team_id;
                        const kbId = ref.metadata?.knowledge_base_id;

                        // 构建跳转链接：优先跳转到知识库页面
                        let href: string;
                        if (teamId && kbId) {
                            const queryParam = isSpreadsheet ? 'sheet' : 'doc';
                            href = `/teams/${teamId}/kb/${kbId}?${queryParam}=${docId}`;
                        } else {
                            const basePath = isSpreadsheet ? '/spreadsheet' : '/editor';
                            href = `${basePath}/${docId}`;
                        }

                        return (
                            <a
                                key={ref.id || idx}
                                href={href}
                                className="flex items-start gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition"
                            >
                                <FileText size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-blue-800 truncate">
                                        {ref.metadata?.title || ref.title || '未知文档'}
                                        {isSpreadsheet && <span className="ml-1 text-xs text-gray-500">[表格]</span>}
                                    </div>
                                    {ref.chunk_text && (
                                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                            {ref.chunk_text.substring(0, 80)}...
                                        </div>
                                    )}
                                </div>
                                <ExternalLink size={12} className="text-blue-400 flex-shrink-0" />
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// 操作按钮组件
function MessageActions({ onCopy }: { onCopy: () => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition">
            <button
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition"
                title="有帮助"
            >
                <ThumbsUp size={14} />
            </button>
            <button
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                title="没帮助"
            >
                <ThumbsDown size={14} />
            </button>
            <button
                onClick={handleCopy}
                className={`p-1.5 rounded transition ${copied ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                title={copied ? "已复制" : "复制"}
            >
                <Copy size={14} />
            </button>
        </div>
    );
}

export default function AIQueryPanel({
    currentUser,
    teamId,
    knowledgeBaseId,
    documentId,
    searchScope = 'all',
    searchScopeValue,
    onSearchScopeChange,
    messages: externalMessages,
    onAddMessage,
    onUpdateMessage,
    onReferencesUpdate
}: AIQueryPanelProps) {
    // 内部状态（如果没有外部传入则使用内部状态）
    const [internalMessages, setInternalMessages] = useState<Message[]>([]);
    const messages = externalMessages || internalMessages;

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState('');
    const [currentReferences, setCurrentReferences] = useState<SearchReference[]>([]);
    const [expandedRefs, setExpandedRefs] = useState<Set<string>>(new Set());

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || '用户';
    const greeting = getGreeting();

    // 自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // 添加消息
    const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
        if (onAddMessage) {
            return onAddMessage(message);
        }
        const newMessage: Message = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        setInternalMessages(prev => [...prev, newMessage]);
        return newMessage;
    }, [onAddMessage]);

    // 更新消息
    const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
        if (onUpdateMessage) {
            onUpdateMessage(messageId, updates);
        } else {
            setInternalMessages(prev =>
                prev.map(msg => msg.id === messageId ? { ...msg, ...updates } : msg)
            );
        }
    }, [onUpdateMessage]);

    // 切换引用展开状态
    const toggleRefExpanded = (messageId: string) => {
        setExpandedRefs(prev => {
            const next = new Set(prev);
            if (next.has(messageId)) {
                next.delete(messageId);
            } else {
                next.add(messageId);
            }
            return next;
        });
    };

    // 复制消息内容
    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    // 处理发送消息
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = addMessage({
            role: 'user',
            content: input.trim()
        });

        const userContent = input.trim();
        setInput('');
        setIsLoading(true);

        let searchResults: SearchReference[] = [];

        try {
            // 执行语义搜索
            if (currentUser?.uid) {
                setIsSearching(true);
                setSearchStatus('🔍 正在搜索知识库...');

                try {
                    // 确定搜索范围参数
                    const scope = searchScopeValue?.type || searchScope;
                    const scopeTeamId = searchScopeValue?.teamId || teamId;
                    const scopeKBId = searchScopeValue?.knowledgeBaseId || knowledgeBaseId;
                    const scopeDocId = searchScopeValue?.documentId || documentId;

                    const searchRes = await fetch('/api/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: userContent,
                            userId: currentUser.uid,
                            teamId: scope === 'team' ? scopeTeamId : undefined,
                            knowledgeBaseId: scope === 'knowledgeBase' ? scopeKBId : undefined,
                            documentId: scope === 'document' ? scopeDocId : undefined,
                            topK: 5,
                            threshold: 0.3,
                            enableRerank: true
                        })
                    });

                    if (searchRes.ok) {
                        const data = await searchRes.json();
                        if (data.results?.length > 0) {
                            searchResults = data.results;
                            setCurrentReferences(searchResults);
                            onReferencesUpdate?.(searchResults);
                            setSearchStatus(`✅ 找到 ${data.results.length} 条相关内容`);
                        } else {
                            setSearchStatus('未找到直接相关内容');
                        }
                    }
                } catch (err) {
                    setSearchStatus('搜索出错');
                } finally {
                    setIsSearching(false);
                }
            }

            // 构建上下文
            const semanticContext = searchResults.length > 0
                ? searchResults.map(r => `📄 来源: ${r.metadata?.title || '未知'}\n${r.chunk_text}`).join('\n\n---\n\n')
                : '';

            // 构建 AI 提示
            const prompt = `
你是一个智能文档助手，帮助用户查询和理解知识库内容。

${semanticContext ? `【知识库相关内容】\n${semanticContext}\n\n` : ''}
用户问题: ${userContent}

请根据知识库内容回答用户问题。如果知识库中没有相关信息，请基于通用知识回答并说明。
请用中文回复，保持专业简洁。
`;

            // 创建 AI 消息
            const aiMessage = addMessage({
                role: 'ai',
                content: '',
                references: searchResults
            });

            // 流式生成回复
            let responseText = '';
            await aiService.streamText(prompt, (chunk: string) => {
                responseText += chunk;
                updateMessage(aiMessage.id, { content: responseText });
            });

            // 更新最终消息（包含引用）
            updateMessage(aiMessage.id, {
                content: responseText,
                references: searchResults
            });

        } catch (error) {
            console.error('AI 回复失败:', error);
            addMessage({
                role: 'ai',
                content: '❌ 抱歉，请求失败，请稍后重试。'
            });
        } finally {
            setIsLoading(false);
            setSearchStatus('');
        }
    };

    // 处理快捷问题点击
    const handleQuickQuestion = (question: string) => {
        setInput(question);
        textareaRef.current?.focus();
    };

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 是否处于对话模式（有消息记录）
    const isConversationMode = messages.length > 0;

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50">
            {isConversationMode ? (
                /* 对话模式 */
                <>
                    {/* 对话消息区域 */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* 搜索状态提示 */}
                            {messages.length > 0 && currentReferences.length > 0 && (
                                <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                                    搜索到 {currentReferences.length} 个知识库相关内容
                                </div>
                            )}

                            {messages.map(msg => (
                                <div key={msg.id} className={`flex gap-4 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai'
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                                    </div>
                                    <div className="max-w-[80%]">
                                        <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'ai'
                                            ? 'bg-white border border-gray-200 shadow-sm text-gray-800'
                                            : 'bg-blue-600 text-white'
                                            }`}>
                                            {msg.content || (
                                                <div className="flex gap-1.5 py-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* AI 消息的引用和操作 */}
                                        {msg.role === 'ai' && msg.content && (
                                            <>
                                                {/* 引用来源 */}
                                                {msg.references && msg.references.length > 0 && (
                                                    <ReferenceList
                                                        references={msg.references}
                                                        isExpanded={expandedRefs.has(msg.id)}
                                                        onToggle={() => toggleRefExpanded(msg.id)}
                                                    />
                                                )}

                                                {/* 操作按钮 */}
                                                <MessageActions onCopy={() => copyMessage(msg.content)} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* 搜索中提示 */}
                            {isSearching && (
                                <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg w-fit">
                                    <Search size={14} className="animate-pulse" />
                                    {searchStatus}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* 对话模式输入框 */}
                    <div className="border-t border-gray-200 bg-white p-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex gap-3 items-end bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition">
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="继续提问..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm outline-none"
                                    rows={1}
                                    style={{ minHeight: '40px', maxHeight: '120px' }}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex-shrink-0"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* 欢迎模式 - 居中布局 */
                <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-[calc(100vh-2rem)]">
                    {/* 问候语 */}
                    <h1 className="text-3xl font-bold text-blue-600 mb-8">
                        {greeting}，{userName}
                    </h1>

                    {/* 中心输入框 */}
                    <div className="w-full max-w-2xl">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`基于"${searchScopeValue?.label || '全部知识库'}"提问，shift+enter换行`}
                                className="w-full px-4 py-4 border-none focus:ring-0 resize-none text-sm outline-none"
                                rows={3}
                            />
                            {/* 工具栏 */}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                        <Paperclip size={14} />
                                        快速上传
                                    </button>
                                    {/* 知识库选择器 */}
                                    {currentUser?.uid && searchScopeValue && onSearchScopeChange && (
                                        <KnowledgeBaseSelector
                                            userId={currentUser.uid}
                                            value={searchScopeValue}
                                            onChange={onSearchScopeChange}
                                        />
                                    )}
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition">
                                        <Globe size={14} />
                                        全网
                                    </button>
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* 提示文字 */}
                        <p className="text-center text-xs text-gray-400 mt-3">
                            回答内容由AI生成，仅供参考
                        </p>
                    </div>

                    {/* 快捷问题标签 */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-3xl">
                        {QUICK_QUESTIONS.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuickQuestion(q.text)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-sm hover:bg-amber-100 transition"
                            >
                                <span>{q.icon}</span>
                                <span className="truncate max-w-[200px]">{q.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

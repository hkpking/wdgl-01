import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, X, Send, Paperclip, FileText, Shield, Bot, User, Search, Zap } from 'lucide-react';
import SourceSelector from './SourceSelector';
import { aiService } from '@/lib/ai/AIService';
import * as mockStorage from '@/lib/services/mockStorage';

// 意图识别（客户端版本）
const INTENT_PATTERNS = [
    { pattern: /如何|怎么|怎样|步骤|流程|操作|方法/i, intent: 'workflow_guide', hint: '请以清晰的步骤形式回答，使用编号列表展示操作流程。' },
    { pattern: /规定|制度|政策|标准|要求|规范/i, intent: 'policy_search', hint: '请准确引用相关制度条款，注明来源文档。' },
    { pattern: /总结|概括|摘要|归纳|概述/i, intent: 'summarization', hint: '请提供简洁的要点总结，使用项目符号列出关键信息。' },
    { pattern: /区别|不同|差异|对比|比较/i, intent: 'comparison', hint: '请以对比的形式组织回答，清晰展示异同点。' },
    { pattern: /什么是|是什么|定义|解释|含义/i, intent: 'definition', hint: '请给出准确定义，并提供必要的背景解释。' },
];

function classifyIntentClient(query) {
    for (const { pattern, intent, hint } of INTENT_PATTERNS) {
        if (pattern.test(query)) {
            return { intent, hint };
        }
    }
    return { intent: 'document_qa', hint: '' };
}

export default function AISidebar({ currentUser, currentDoc, onClose, embedded = false, teamId, knowledgeBaseId, searchScope = 'all' }) {
    const [messages, setMessages] = useState([
        { id: 'welcome', role: 'ai', content: '你好！我是您的 AI 助手。我可以帮您总结文档、回答问题，或查询您的知识库。\n\n💡 **提示**: 我会自动搜索您已保存的文档来回答问题，支持多轮对话记忆。' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState(''); // 搜索状态文本
    const [sources, setSources] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // 存储搜索结果用于渲染链接
    const [isSourceSelectorOpen, setIsSourceSelectorOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // 会话 ID（用于多轮对话）
    const sessionId = useMemo(() =>
        `${currentUser?.uid || 'guest'}_${Date.now()}`,
        [currentUser?.uid]
    );

    // 不再自动将当前文档添加为 source
    // 这样语义搜索就能正常工作了
    // useEffect(() => {
    //     if (currentDoc) {
    //         setSources([{ ...currentDoc, type: 'user' }]);
    //     }
    // }, [currentDoc]);

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

        // 优化后的上下文策略：
        // 1. 始终执行语义搜索
        // 2. 合并语义结果与手动来源
        let semanticResults = [];
        let contextSource = 'none';

        try {
            // 步骤0: 意图识别
            const intentResult = classifyIntentClient(userMsg.content);
            console.log(`[AI Sidebar] 意图识别: ${intentResult.intent}`);

            // 步骤1: 始终执行语义搜索
            if (currentUser?.uid) {
                try {
                    setIsSearching(true);
                    setSearchStatus('🔍 正在搜索知识库...');
                    console.log('[AI Sidebar] 执行语义搜索:', userMsg.content.substring(0, 50));

                    const searchRes = await fetch('/api/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: userMsg.content,
                            userId: currentUser.uid,
                            teamId: searchScope === 'team' ? teamId : undefined,
                            knowledgeBaseId: searchScope === 'knowledgeBase' ? knowledgeBaseId : undefined,
                            topK: 5,
                            threshold: 0.3,
                            enableRerank: true,
                            enableCache: true
                        })
                    });

                    if (searchRes.ok) {
                        const searchData = await searchRes.json();
                        semanticResults = searchData.results || [];
                        const cached = searchData.cached ? ' (缓存)' : '';
                        const reranked = searchData.reranked ? ' (已重排序)' : '';
                        setSearchStatus(`✅ 找到 ${semanticResults.length} 条相关内容${cached}${reranked}`);
                        console.log(`[AI Sidebar] 语义搜索返回 ${semanticResults.length} 条结果${cached}${reranked}`);
                        semanticResults.forEach((r, i) => {
                            const score = r.rerankScore !== undefined
                                ? `rerank: ${(r.rerankScore * 100).toFixed(1)}%`
                                : `相似度: ${(r.similarity * 100).toFixed(1)}%`;
                            console.log(`  [${i + 1}] "${r.metadata?.title}" (${score})`);
                        });
                    } else {
                        setSearchStatus('⚠️ 搜索未返回结果');
                        console.error('[AI Sidebar] 搜索请求失败:', searchRes.status);
                    }
                } catch (searchErr) {
                    setSearchStatus('❌ 搜索失败');
                    console.warn('[AI Sidebar] 语义搜索失败:', searchErr);
                } finally {
                    setIsSearching(false);
                }
            }

            // 步骤2: 构建语义搜索上下文
            const semanticContext = semanticResults.length > 0
                ? semanticResults.map(r => {
                    const typeIcon = r.type === 'spreadsheet' ? '📊' : '📄';
                    return `${typeIcon} 来源: ${r.metadata?.title || '未知'} (相似度: ${(r.similarity * 100).toFixed(0)}%)\n${r.chunk_text}`;
                }).join('\n\n---\n\n')
                : '';

            // 存储搜索结果用于渲染可点击链接
            setSearchResults(semanticResults);

            // 步骤3: 构建手动来源上下文
            const MAX_DOC_CHARS = 8000;
            const manualContext = sources.length > 0
                ? sources.map(s => {
                    const docContent = s.content || '';
                    const truncated = docContent.length > MAX_DOC_CHARS
                        ? docContent.substring(0, MAX_DOC_CHARS) + '\n...[内容已截断]'
                        : docContent;
                    return `📄 手动添加: ${s.title}\n${truncated}`;
                }).join('\n\n---\n\n')
                : '';

            // 步骤4: 合并上下文
            let context = '';
            if (semanticContext && manualContext) {
                context = `【知识库搜索结果】\n${semanticContext}\n\n===\n\n【手动添加的文档】\n${manualContext}`;
                contextSource = 'combined';
            } else if (semanticContext) {
                context = semanticContext;
                contextSource = 'semantic';
            } else if (manualContext) {
                context = manualContext;
                contextSource = 'manual';
            }

            // 步骤5: 截断过长上下文
            const MAX_CONTEXT_CHARS = 40000;
            if (context.length > MAX_CONTEXT_CHARS) {
                context = context.substring(0, MAX_CONTEXT_CHARS) + '\n...[上下文已截断]';
            }

            // 构建对话历史上下文（最近3轮对话）
            const recentHistory = messages
                .filter(m => m.id !== 'welcome')
                .slice(-6)  // 最近6条消息（3轮对话）
                .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content.slice(0, 500)}`)
                .join('\n');

            // Construct Prompt with Intent Hint
            const sourceInfo = {
                combined: '以下是通过知识库搜索和用户添加的参考文档：',
                semantic: '以下是通过知识库语义搜索找到的相关内容：',
                manual: '以下是用户手动添加的参考文档：',
                none: '（未找到相关知识库内容，将基于通用知识回答）'
            };

            const intentHint = intentResult.hint ? `\n回答风格提示: ${intentResult.hint}` : '';

            const prompt = `
You are a helpful AI assistant for a document editor with access to the user's knowledge base.
You are having a conversation with the user. Here is the recent conversation history:

${recentHistory ? `【对话历史】\n${recentHistory}\n\n` : ''}User's Current Query: "${userMsg.content}"

${sourceInfo[contextSource]}
${context}

Instructions:
1. Answer the user's query based on the provided context if available.
2. If the answer comes from the knowledge base, mention which document it's from.
3. If no context is provided or the answer is not in the context, use your general knowledge but mention "根据通用知识".
4. Be concise and professional.${intentHint}
5. Consider the conversation history to provide coherent responses.
6. 请用中文回复。
`;

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

            // 添加来源引用（如果有语义搜索结果）
            if (semanticResults.length > 0) {
                // 构建带类型图标的来源列表
                const uniqueSources = [];
                const seenIds = new Set();
                for (const r of semanticResults) {
                    if (!seenIds.has(r.document_id)) {
                        seenIds.add(r.document_id);
                        uniqueSources.push({
                            id: r.document_id,
                            title: r.metadata?.title || '未知',
                            type: r.type || 'document',
                            teamId: r.metadata?.team_id,
                            kbId: r.metadata?.knowledge_base_id
                        });
                    }
                }

                const sourcesRef = '\n\n---\n📚 **引用来源**: ' +
                    uniqueSources.map(s => {
                        const icon = s.type === 'spreadsheet' ? '📊' : '📄';
                        return `${icon}${s.title}`;
                    }).join('、');

                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, content: msg.content + sourcesRef, sources: uniqueSources } : msg
                ));
            }

        } catch (error) {
            console.error('[AI Sidebar] Error:', error);
            const errorMsg = error.message?.includes('token')
                ? '文档内容过长，请尝试移除部分知识来源后重试。'
                : `请求失败: ${error.message}`;
            setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', content: `❌ ${errorMsg}` }]);
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
                        <span className="text-xs text-gray-400 italic">🔍 自动搜索知识库 | 可手动添加文档补充</span>
                    )}
                </div>
            </div>

            {/* Search Status Bar */}
            {(isSearching || searchStatus) && (
                <div className={`px-4 py-2 text-xs border-b transition-all ${isSearching
                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                    : searchStatus.includes('✅')
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : searchStatus.includes('❌')
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                    <div className="flex items-center gap-2">
                        {isSearching && (
                            <Search size={12} className="animate-pulse" />
                        )}
                        <span>{searchStatus}</span>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === 'ai' ? 'bg-white border border-gray-200 shadow-sm text-gray-800' : 'bg-blue-600 text-white'}`}>
                            {msg.content ? (
                                <>
                                    {/* 消息内容（去掉引用来源部分，单独渲染） */}
                                    {msg.content.split('---\n📚 **引用来源**')[0]}

                                    {/* 可点击的来源标签 */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="text-xs text-gray-500 mb-2">📚 引用来源：</div>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, idx) => {
                                                    // 构建跳转 URL
                                                    let href = '';
                                                    if (source.type === 'spreadsheet') {
                                                        href = `/spreadsheet/${source.id}`;
                                                    } else if (source.teamId && source.kbId) {
                                                        href = `/teams/${source.teamId}/kb/${source.kbId}?doc=${source.id}`;
                                                    } else {
                                                        href = `/editor/${source.id}`;
                                                    }
                                                    const icon = source.type === 'spreadsheet' ? '📊' : '📄';

                                                    return (
                                                        <a
                                                            key={`${source.id}-${idx}`}
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs hover:bg-blue-100 transition-colors"
                                                            title={`打开 ${source.type === 'spreadsheet' ? '表格' : '文档'}: ${source.title}`}
                                                        >
                                                            <span>{icon}</span>
                                                            <span className="max-w-[120px] truncate">{source.title}</span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
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

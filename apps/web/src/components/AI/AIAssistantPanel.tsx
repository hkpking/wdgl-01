"use client";

import React, { useState, useCallback } from 'react';
import {
    Sparkles,
    MessageSquare,
    Wand2,
    Search,
    FileText,
    BarChart2,
    X,
    ChevronRight,
    Loader2,
    Send
} from 'lucide-react';

// AI 功能类型
type AIFeature = 'chat' | 'write' | 'analyze' | 'search';

interface AIAssistantPanelProps {
    isOpen: boolean;
    onClose: () => void;
    // 上下文
    documentTitle?: string;
    documentContent?: string;
    currentUser?: { uid: string; displayName?: string } | null;
    knowledgeBaseId?: string;
    // 回调
    onInsertContent?: (text: string) => void;
    // 配置
    availableFeatures?: AIFeature[];
}

interface QuickAction {
    id: string;
    label: string;
    icon: typeof Sparkles;
    prompt: string;
    feature: AIFeature;
}

const defaultQuickActions: QuickAction[] = [
    { id: 'summarize', label: '总结内容', icon: FileText, prompt: '请总结以下内容的关键要点：', feature: 'write' },
    { id: 'expand', label: '扩写内容', icon: Wand2, prompt: '请扩展以下内容，增加更多细节：', feature: 'write' },
    { id: 'polish', label: '润色文字', icon: Wand2, prompt: '请润色以下文字，使其更加流畅专业：', feature: 'write' },
    { id: 'translate', label: '翻译内容', icon: MessageSquare, prompt: '请将以下内容翻译成英文：', feature: 'write' },
    { id: 'explain', label: '解释概念', icon: Sparkles, prompt: '请解释以下概念：', feature: 'chat' },
    { id: 'analyze', label: '分析数据', icon: BarChart2, prompt: '请分析以下数据：', feature: 'analyze' },
];

/**
 * 统一的 AI 助手面板
 * 整合对话、写作、分析、搜索等 AI 功能
 */
export default function AIAssistantPanel({
    isOpen,
    onClose,
    documentTitle,
    documentContent,
    currentUser,
    knowledgeBaseId,
    onInsertContent,
    availableFeatures = ['chat', 'write', 'analyze', 'search']
}: AIAssistantPanelProps) {
    const [activeFeature, setActiveFeature] = useState<AIFeature>('chat');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

    // 功能标签配置
    const featureTabs = [
        { id: 'chat' as AIFeature, label: '对话', icon: MessageSquare },
        { id: 'write' as AIFeature, label: '写作', icon: Wand2 },
        { id: 'analyze' as AIFeature, label: '分析', icon: BarChart2 },
        { id: 'search' as AIFeature, label: '搜索', icon: Search },
    ].filter(tab => availableFeatures.includes(tab.id));

    // 当前功能的快捷操作
    const currentQuickActions = defaultQuickActions.filter(
        action => action.feature === activeFeature || activeFeature === 'chat'
    ).slice(0, 4);

    // 发送消息
    const handleSend = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // 构建上下文
            const contextInfo = documentTitle ? `当前文档：${documentTitle}\n` : '';
            const contentPreview = documentContent?.slice(0, 500) || '';

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: `你是一个智能助手。${contextInfo}` },
                        ...messages,
                        { role: 'user', content: userMessage }
                    ],
                    context: contentPreview,
                    knowledgeBaseId
                })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: 'assistant', content: data.content || data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，处理请求时出错了。' }]);
            }
        } catch (error) {
            console.error('AI 请求失败:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '网络错误，请稍后重试。' }]);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, messages, documentTitle, documentContent, knowledgeBaseId]);

    // 使用快捷操作
    const handleQuickAction = (action: QuickAction) => {
        const selectedText = window.getSelection()?.toString() || '';
        const contextText = selectedText || documentContent?.slice(0, 200) || '';
        setInputValue(`${action.prompt}\n\n${contextText}`);
    };

    // 插入 AI 回复到文档
    const handleInsert = (content: string) => {
        onInsertContent?.(content);
    };

    if (!isOpen) return null;

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-500" />
                    <span className="font-medium text-gray-900">AI 助手</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                    <X size={18} />
                </button>
            </div>

            {/* 功能标签 */}
            <div className="flex border-b border-gray-100">
                {featureTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveFeature(tab.id)}
                        className={`
                            flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm transition
                            ${activeFeature === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }
                        `}
                    >
                        <tab.icon size={14} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 快捷操作 */}
            {currentQuickActions.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400 mb-2">快捷操作</p>
                    <div className="grid grid-cols-2 gap-2">
                        {currentQuickActions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => handleQuickAction(action)}
                                className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 rounded transition"
                            >
                                <action.icon size={12} />
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center py-8">
                        <Sparkles size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">
                            有什么可以帮助你的？
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            试试快捷操作或输入问题
                        </p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`
                                p-3 rounded-lg text-sm
                                ${msg.role === 'user'
                                    ? 'bg-blue-50 text-blue-900 ml-4'
                                    : 'bg-gray-50 text-gray-700 mr-4'
                                }
                            `}
                        >
                            {msg.content}
                            {msg.role === 'assistant' && onInsertContent && (
                                <button
                                    onClick={() => handleInsert(msg.content)}
                                    className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <ChevronRight size={12} />
                                    插入到文档
                                </button>
                            )}
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Loader2 size={14} className="animate-spin" />
                        思考中...
                    </div>
                )}
            </div>

            {/* 输入区域 */}
            <div className="p-3 border-t border-gray-100">
                <div className="flex gap-2">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="输入问题或指令..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

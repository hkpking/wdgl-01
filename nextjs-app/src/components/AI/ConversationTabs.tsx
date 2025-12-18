"use client";

import React, { useState } from 'react';
import { History, Plus, MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import type { Conversation } from '@/hooks/useConversationHistory';

interface ConversationTabsProps {
    conversations: Conversation[];
    currentConversationId: string | null;
    onSwitchConversation: (id: string) => void;
    onNewConversation: () => void;
    onDeleteConversation?: (id: string) => void;
    currentTitle?: string;
}

export default function ConversationTabs({
    conversations,
    currentConversationId,
    onSwitchConversation,
    onNewConversation,
    onDeleteConversation,
    currentTitle
}: ConversationTabsProps) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return '昨天';
        } else if (diffDays < 7) {
            return `${diffDays} 天前`;
        } else {
            return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white">
            {/* 历史对话按钮 */}
            <div className="relative">
                <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition ${isHistoryOpen
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <History size={16} />
                    历史对话
                </button>

                {/* 历史对话下拉列表 */}
                {isHistoryOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => { setIsHistoryOpen(false); setMenuOpenId(null); }}
                        />
                        <div className="absolute top-full left-0 mt-1 w-72 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                            <div className="p-2 border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase">
                                    最近 {conversations.length} 个对话
                                </span>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {conversations.length === 0 ? (
                                    <div className="p-4 text-center text-gray-400 text-sm">
                                        暂无历史对话
                                    </div>
                                ) : (
                                    conversations.map(conv => (
                                        <div
                                            key={conv.id}
                                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition ${conv.id === currentConversationId
                                                    ? 'bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <button
                                                onClick={() => {
                                                    onSwitchConversation(conv.id);
                                                    setIsHistoryOpen(false);
                                                }}
                                                className="flex-1 text-left min-w-0"
                                            >
                                                <div className={`text-sm font-medium truncate ${conv.id === currentConversationId ? 'text-blue-700' : 'text-gray-900'
                                                    }`}>
                                                    {conv.title}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {formatTime(conv.updatedAt)} · {conv.messages.length} 条消息
                                                </div>
                                            </button>

                                            {/* 删除按钮 */}
                                            {onDeleteConversation && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteConversation(conv.id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* 新对话按钮 */}
            <button
                onClick={onNewConversation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
                <Plus size={16} />
                新对话
            </button>

            {/* 分隔线 */}
            <div className="h-4 w-px bg-gray-200" />

            {/* 当前对话标题 */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800 truncate">
                    {currentTitle || '新对话'}
                </span>
            </div>
        </div>
    );
}

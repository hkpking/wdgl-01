"use client";

import React from 'react';
import { FileText, Plus, ChevronRight } from 'lucide-react';
import type { KnowledgeBase } from '@/types/team';

interface KBCardProps {
    kb: KnowledgeBase;
    onClick: () => void;
    recentDocs?: { title: string; updatedAt: string }[];
}

export default function KBCard({ kb, onClick, recentDocs = [] }: KBCardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} 分钟前`;
        if (diffHours < 24) return `${diffHours} 小时前`;
        if (diffDays < 7) return `${diffDays} 天前`;
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    };

    return (
        <button
            onClick={onClick}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition group"
        >
            <div className="flex items-start gap-3">
                {/* 图标 */}
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {kb.icon || '📚'}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700">
                            {kb.name}
                        </h3>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 flex-shrink-0" />
                    </div>

                    {kb.description && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                            {kb.description}
                        </p>
                    )}

                    {/* 最近文档 */}
                    {recentDocs.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {recentDocs.slice(0, 3).map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="text-gray-300">·</span>
                                    <span className="truncate flex-1">{doc.title}</span>
                                    <span className="text-gray-400">{formatDate(doc.updatedAt)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
}

// 新建知识库卡片
export function CreateKBCard({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full h-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-600"
        >
            <Plus size={24} />
            <span className="text-sm font-medium">新建知识库</span>
        </button>
    );
}

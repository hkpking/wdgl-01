"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, FileText, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import type { SearchReference } from '@/hooks/useConversationHistory';

interface ReferencePanelProps {
    isOpen: boolean;
    onClose: () => void;
    references: SearchReference[];
    totalCount?: number;
    isLoading?: boolean;
}

export default function ReferencePanel({
    isOpen,
    onClose,
    references,
    totalCount,
    isLoading = false
}: ReferencePanelProps) {
    const router = useRouter();

    const handleDocumentClick = (ref: SearchReference) => {
        const docId = ref.document_id || ref.metadata?.docId || ref.id;
        router.push(`/editor/${docId}`);
    };

    // 格式化时间
    const formatTime = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    };

    if (!isOpen) return null;

    return (
        <aside className="w-80 border-l border-gray-200 bg-white flex flex-col h-full">
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">
                    搜索到 {totalCount || references.length} 篇资料
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                >
                    <X size={18} />
                </button>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 text-center text-gray-400">
                        <div className="animate-pulse space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-gray-100 h-20 rounded-lg" />
                            ))}
                        </div>
                    </div>
                ) : references.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <FileText size={40} className="mx-auto mb-3 opacity-30" />
                        <p>暂无相关资料</p>
                    </div>
                ) : (
                    <div className="p-2 space-y-2">
                        {references.map((ref, index) => (
                            <button
                                key={ref.id || index}
                                onClick={() => handleDocumentClick(ref)}
                                className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition group"
                            >
                                {/* 标题 */}
                                <div className="flex items-start gap-2 mb-1">
                                    <FileText size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-700">
                                        {ref.metadata?.title || ref.title || '无标题'}
                                    </span>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 ml-auto flex-shrink-0" />
                                </div>

                                {/* 摘要 */}
                                {ref.chunk_text && (
                                    <p className="text-sm text-gray-500 line-clamp-2 ml-6">
                                        {ref.chunk_text.substring(0, 100)}...
                                    </p>
                                )}

                                {/* 相似度 */}
                                {ref.similarity !== undefined && (
                                    <div className="flex items-center gap-2 mt-2 ml-6">
                                        <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                                            相关度 {Math.round(ref.similarity * 100)}%
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}

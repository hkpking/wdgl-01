"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, Loader2, Clock, ArrowRight } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
    id: string;
    document_id?: string;  // 主要使用这个字段
    title: string;
    chunk_text?: string;
    content?: string;
    updatedAt?: string;
    metadata?: {
        title?: string;
        docId?: string;
    };
    similarity?: number;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
    folderId?: string | null;
    teamId?: string;           // 团队搜索范围
    knowledgeBaseId?: string;  // 知识库搜索范围
    searchScope?: 'all' | 'folder' | 'team' | 'knowledgeBase';
    onResultClick?: (docId: string) => void;  // 自定义点击行为
}

export default function SearchModal({
    isOpen,
    onClose,
    userId,
    folderId,
    teamId,
    knowledgeBaseId,
    searchScope = 'all',
    onResultClick
}: SearchModalProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const debouncedQuery = useDebounce(query, 300);

    // 自动聚焦输入框
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // 防抖搜索
    useEffect(() => {
        if (!debouncedQuery.trim() || !userId) {
            setResults([]);
            return;
        }

        const search = async () => {
            setIsSearching(true);
            try {
                const res = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: debouncedQuery,
                        userId,
                        folderId: searchScope === 'folder' ? folderId : undefined,
                        teamId: searchScope === 'team' ? teamId : undefined,
                        knowledgeBaseId: searchScope === 'knowledgeBase' ? knowledgeBaseId : undefined,
                        topK: 10,
                        threshold: 0.3,
                        enableRerank: true
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results || []);
                    setSelectedIndex(0);
                }
            } catch (error) {
                console.error('搜索失败:', error);
            } finally {
                setIsSearching(false);
            }
        };

        search();
    }, [debouncedQuery, userId, folderId, teamId, knowledgeBaseId, searchScope]);

    // 处理结果点击
    const handleResultClick = useCallback((result: SearchResult) => {
        const docId = result.document_id || result.metadata?.docId || result.id;
        console.log('[SearchModal] 跳转到文档:', docId, result);
        if (onResultClick) {
            onResultClick(docId);
        } else {
            router.push(`/editor/${docId}`);
        }
        onClose();
        setQuery('');
        setResults([]);
    }, [router, onClose, onResultClick]);

    // 键盘导航
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
        }
    };

    // 高亮关键词
    const highlightText = (text: string, keyword: string) => {
        if (!keyword.trim()) return text;
        const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark> : part
        );
    };

    // 格式化时间
    const formatTime = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
            {/* 遮罩层 */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* 搜索框容器 */}
            <div
                className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* 搜索输入区 */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                    <Search className="text-gray-400 flex-shrink-0" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            searchScope === 'folder' ? "在当前文件夹中搜索..." :
                                searchScope === 'team' ? "在团队中搜索..." :
                                    searchScope === 'knowledgeBase' ? "在知识库中搜索..." :
                                        "搜索文档..."
                        }
                        className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-400"
                        autoComplete="off"
                    />
                    {isSearching && <Loader2 className="text-blue-500 animate-spin flex-shrink-0" size={20} />}
                    {query && !isSearching && (
                        <button
                            onClick={() => { setQuery(''); setResults([]); }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* 搜索结果 */}
                {results.length > 0 && (
                    <div className="max-h-[50vh] overflow-y-auto">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                            相关文档
                        </div>
                        {results.map((result, index) => (
                            <button
                                key={result.id || index}
                                onClick={() => handleResultClick(result)}
                                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition ${index === selectedIndex
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <FileText className={`flex-shrink-0 mt-0.5 ${index === selectedIndex ? 'text-blue-600' : 'text-gray-400'}`} size={18} />
                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium truncate ${index === selectedIndex ? 'text-blue-900' : 'text-gray-900'}`}>
                                        {highlightText(result.metadata?.title || result.title || '无标题', query)}
                                    </div>
                                    {result.chunk_text && (
                                        <div className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                                            {highlightText(result.chunk_text.substring(0, 150), query)}
                                        </div>
                                    )}
                                    {result.updatedAt && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                            <Clock size={12} />
                                            {formatTime(result.updatedAt)}
                                        </div>
                                    )}
                                </div>
                                <ArrowRight className={`flex-shrink-0 ${index === selectedIndex ? 'text-blue-600' : 'text-gray-300'}`} size={16} />
                            </button>
                        ))}
                    </div>
                )}

                {/* 无结果提示 */}
                {query && !isSearching && results.length === 0 && (
                    <div className="py-12 text-center text-gray-400">
                        <Search size={40} className="mx-auto mb-3 opacity-30" />
                        <p>未找到相关文档</p>
                        <p className="text-sm mt-1">尝试使用其他关键词</p>
                    </div>
                )}

                {/* 底部提示 */}
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                        <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">↑↓</kbd> 导航</span>
                        <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Enter</kbd> 打开</span>
                        <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Esc</kbd> 关闭</span>
                    </div>
                    <span>{searchScope === 'folder' ? '搜索当前文件夹' : '搜索全部文档'}</span>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBoxProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    className?: string;
    showSemanticToggle?: boolean;
    fullWidth?: boolean;
}

export default function SearchBox({
    placeholder = "搜索...",
    onSearch,
    className = "",
    showSemanticToggle = false,
    fullWidth = true
}: SearchBoxProps) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchMode, setSearchMode] = useState<'local' | 'semantic'>('local');

    const debouncedQuery = useDebounce(query, 300);

    // 处理搜索
    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            onSearch?.('');
            return;
        }

        setIsSearching(true);
        try {
            onSearch?.(searchQuery);
        } finally {
            setIsSearching(false);
        }
    }, [onSearch]);

    // 防抖搜索
    React.useEffect(() => {
        handleSearch(debouncedQuery);
    }, [debouncedQuery, handleSearch]);

    // 清除搜索
    const handleClear = () => {
        setQuery('');
        onSearch?.('');
    };

    return (
        <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}>
            <div className="relative">
                {isSearching ? (
                    <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" size={16} />
                ) : (
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                )}
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-9 pr-8 py-2 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-300 transition ${searchMode === 'semantic' ? 'bg-purple-50' : ''}`}
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
            {showSemanticToggle && (
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => setSearchMode('local')}
                        className={`px-2 py-1 text-xs rounded ${searchMode === 'local' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                        📂 本地
                    </button>
                    <button
                        onClick={() => setSearchMode('semantic')}
                        className={`px-2 py-1 text-xs rounded ${searchMode === 'semantic' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                        ✨ 智能
                    </button>
                </div>
            )}
        </div>
    );
}

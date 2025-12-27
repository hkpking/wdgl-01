"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseGlobalSearchOptions {
    enabled?: boolean;
}

export function useGlobalSearch(options: UseGlobalSearchOptions = {}) {
    const { enabled = true } = options;
    const [isOpen, setIsOpen] = useState(false);

    // 打开搜索弹窗
    const openSearch = useCallback(() => {
        setIsOpen(true);
    }, []);

    // 关闭搜索弹窗
    const closeSearch = useCallback(() => {
        setIsOpen(false);
    }, []);

    // 切换搜索弹窗
    const toggleSearch = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // 监听 Ctrl+K / Cmd+K 快捷键
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K 或 Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggleSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, toggleSearch]);

    return {
        isOpen,
        openSearch,
        closeSearch,
        toggleSearch
    };
}

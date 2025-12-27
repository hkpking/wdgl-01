"use client";

import React, { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// 最近访问记录的类型
export interface RecentItem {
    id: string;
    title: string;
    type: 'document' | 'spreadsheet';
    teamId?: string;
    kbId?: string;
    accessedAt: string;
    path?: string; // 完整路径用于导航
}

const STORAGE_KEY = 'recent_items';
const MAX_ITEMS = 8;

/**
 * 获取最近访问记录
 */
export function getRecentItems(): RecentItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * 添加最近访问记录
 */
export function addRecentItem(item: Omit<RecentItem, 'accessedAt'>): void {
    if (typeof window === 'undefined') return;
    try {
        const items = getRecentItems();
        // 移除已存在的同ID记录
        const filtered = items.filter(i => i.id !== item.id);
        // 添加到最前面
        const newItem: RecentItem = {
            ...item,
            accessedAt: new Date().toISOString()
        };
        const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('保存最近访问记录失败:', error);
    }
}

/**
 * 清除最近访问记录
 */
export function clearRecentItems(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

interface RecentDocsProps {
    className?: string;
    maxItems?: number;
    onItemClick?: (item: RecentItem) => void;
}

/**
 * 最近访问组件
 */
export default function RecentDocs({
    className = '',
    maxItems = 5,
    onItemClick
}: RecentDocsProps) {
    const [items, setItems] = useState<RecentItem[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        setItems(getRecentItems().slice(0, maxItems));

        // 监听 storage 变化以同步多标签页
        const handleStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setItems(getRecentItems().slice(0, maxItems));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [maxItems]);

    if (items.length === 0) {
        return null;
    }

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins}分钟前`;
        if (diffHours < 24) return `${diffHours}小时前`;
        if (diffDays < 7) return `${diffDays}天前`;
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`${className}`}>
            {/* 标题 */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition"
            >
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    最近访问
                </span>
                <ChevronRight
                    size={12}
                    className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
            </button>

            {/* 列表 */}
            {isExpanded && (
                <div className="space-y-0.5 mt-1">
                    {items.map((item) => {
                        const Icon = item.type === 'spreadsheet' ? FileSpreadsheet : FileText;
                        const iconColor = item.type === 'spreadsheet' ? 'text-green-500' : 'text-blue-500';

                        const href = item.path || (
                            item.type === 'spreadsheet'
                                ? `/spreadsheet/${item.id}`
                                : `/editor/${item.id}`
                        );

                        return (
                            <Link
                                key={item.id}
                                href={href}
                                onClick={() => onItemClick?.(item)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 transition group"
                            >
                                <Icon size={14} className={`${iconColor} flex-shrink-0`} />
                                <span className="flex-1 text-sm text-gray-700 truncate">
                                    {item.title || '无标题'}
                                </span>
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                                    {formatTime(item.accessedAt)}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

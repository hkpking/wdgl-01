"use client";

import React from 'react';
import { Plus, Upload, Search } from 'lucide-react';

interface SidebarActionsProps {
    onCreateNew?: () => void;
    onUpload?: () => void;
    onOpenSearch?: () => void;
}

/**
 * 侧边栏快捷操作组件
 * - 新建按钮
 * - 上传按钮
 * - 搜索输入框
 */
export default function SidebarActions({ onCreateNew, onUpload, onOpenSearch }: SidebarActionsProps) {
    return (
        <div className="p-3 space-y-3">
            <div className="flex gap-2">
                <button
                    onClick={onCreateNew}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                    <Plus size={16} />
                    新建
                </button>
                <button
                    onClick={onUpload}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                >
                    <Upload size={16} />
                    上传
                </button>
            </div>

            {/* 搜索按钮 */}
            <button
                onClick={onOpenSearch}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
                <Search size={16} />
                <span className="flex-1 text-left">搜索...</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-gray-400 bg-gray-200 rounded">⌘K</kbd>
            </button>
        </div>
    );
}

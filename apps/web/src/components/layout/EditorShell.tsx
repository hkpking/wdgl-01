"use client";

/**
 * EditorShell - 统一的编辑器外壳布局
 * 
 * 提供 Shell-Content 架构的外壳组件：
 * - 左侧：可选的侧边栏插槽
 * - 右侧：内容插槽（可插入任何编辑器模块）
 */

import React, { useState, useCallback, ReactNode } from 'react';
import { PanelLeft, PanelLeftClose } from 'lucide-react';

export interface EditorShellProps {
    /** 侧边栏内容 */
    sidebar?: ReactNode;
    /** 主内容区域 */
    children: ReactNode;
    /** 侧边栏是否默认展开 */
    defaultSidebarOpen?: boolean;
    /** 侧边栏宽度 */
    sidebarWidth?: number;
    /** 是否允许折叠侧边栏 */
    collapsible?: boolean;
    /** 侧边栏折叠状态变化回调 */
    onSidebarToggle?: (isOpen: boolean) => void;
    /** 额外的类名 */
    className?: string;
}

export default function EditorShell({
    sidebar,
    children,
    defaultSidebarOpen = true,
    sidebarWidth = 280,
    collapsible = true,
    onSidebarToggle,
    className = '',
}: EditorShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(defaultSidebarOpen);

    const toggleSidebar = useCallback(() => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        onSidebarToggle?.(newState);
    }, [isSidebarOpen, onSidebarToggle]);

    return (
        <div className={`h-screen flex bg-gray-50 overflow-hidden ${className}`}>
            {/* 侧边栏 */}
            {sidebar && (
                <aside
                    className={`
                        bg-white border-r border-gray-200 flex flex-col shrink-0
                        transition-all duration-300 ease-in-out
                        ${isSidebarOpen ? '' : '-ml-[280px]'}
                    `}
                    style={{ width: sidebarWidth }}
                >
                    {/* 侧边栏头部（带折叠按钮） */}
                    {collapsible && (
                        <div className="h-12 flex items-center justify-end px-2 border-b border-gray-100">
                            <button
                                onClick={toggleSidebar}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                                title={isSidebarOpen ? '折叠侧边栏' : '展开侧边栏'}
                            >
                                {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                            </button>
                        </div>
                    )}

                    {/* 侧边栏内容 */}
                    <div className="flex-1 overflow-hidden">
                        {sidebar}
                    </div>
                </aside>
            )}

            {/* 侧边栏折叠时的展开按钮 */}
            {sidebar && !isSidebarOpen && collapsible && (
                <button
                    onClick={toggleSidebar}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded-r-lg shadow-sm hover:bg-gray-50 transition"
                    title="展开侧边栏"
                >
                    <PanelLeft size={16} className="text-gray-500" />
                </button>
            )}

            {/* 主内容区域 */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}

/**
 * EditorShellSidebar - 侧边栏辅助组件
 * 用于在 EditorShell 内部渲染标准化的侧边栏结构
 */
export interface EditorShellSidebarProps {
    /** 侧边栏标题 */
    title?: string;
    /** 标题右侧操作按钮 */
    actions?: ReactNode;
    /** 侧边栏内容 */
    children: ReactNode;
}

export function EditorShellSidebar({
    title,
    actions,
    children,
}: EditorShellSidebarProps) {
    return (
        <div className="h-full flex flex-col">
            {title && (
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-medium text-gray-900">{title}</h2>
                    {actions}
                </div>
            )}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}

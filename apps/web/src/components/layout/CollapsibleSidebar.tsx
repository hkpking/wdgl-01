"use client";

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollapsibleSidebarContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

const CollapsibleSidebarContext = createContext<CollapsibleSidebarContextType>({
    isCollapsed: false,
    toggleSidebar: () => { },
    setSidebarCollapsed: () => { }
});

export const useCollapsibleSidebar = () => useContext(CollapsibleSidebarContext);

interface CollapsibleSidebarProviderProps {
    children: ReactNode;
    defaultCollapsed?: boolean;
}

export function CollapsibleSidebarProvider({ children, defaultCollapsed = false }: CollapsibleSidebarProviderProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    const toggleSidebar = () => setIsCollapsed(prev => !prev);
    const setSidebarCollapsed = (collapsed: boolean) => setIsCollapsed(collapsed);

    return (
        <CollapsibleSidebarContext.Provider value={{ isCollapsed, toggleSidebar, setSidebarCollapsed }}>
            {children}
        </CollapsibleSidebarContext.Provider>
    );
}

interface CollapsibleSidebarProps {
    children: ReactNode;
    width?: number;
    collapsedWidth?: number;
    canCollapse?: boolean;  // 是否允许收起
}

export function CollapsibleSidebar({
    children,
    width = 256,
    collapsedWidth = 0,
    canCollapse = true
}: CollapsibleSidebarProps) {
    const { isCollapsed, toggleSidebar } = useCollapsibleSidebar();

    const effectiveCollapsed = canCollapse && isCollapsed;

    return (
        <div
            className="relative flex-shrink-0 transition-all duration-300 ease-in-out"
            style={{ width: effectiveCollapsed ? collapsedWidth : width }}
        >
            {/* 侧边栏内容 */}
            <div
                className={`h-full overflow-hidden transition-opacity duration-300 ${effectiveCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                style={{ width }}
            >
                {children}
            </div>

            {/* 收起/展开按钮 */}
            {canCollapse && (
                <button
                    onClick={toggleSidebar}
                    className={`absolute top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-gray-200 rounded-r-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition ${effectiveCollapsed ? 'left-0' : '-right-3'
                        }`}
                    title={effectiveCollapsed ? '展开侧边栏' : '收起侧边栏'}
                >
                    {effectiveCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            )}
        </div>
    );
}

// 简化版本：只有切换按钮
interface SidebarToggleButtonProps {
    className?: string;
}

export function SidebarToggleButton({ className = '' }: SidebarToggleButtonProps) {
    const { isCollapsed, toggleSidebar } = useCollapsibleSidebar();

    return (
        <button
            onClick={toggleSidebar}
            className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition ${className}`}
            title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
    );
}

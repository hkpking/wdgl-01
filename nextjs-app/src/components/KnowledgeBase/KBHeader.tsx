"use client";

import React from 'react';
import { Star, Share2, Settings, PanelLeft, PanelLeftClose } from 'lucide-react';

interface KBHeaderProps {
    title: string;
    subtitle?: string;
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    actions?: {
        onStar?: () => void;
        onShare?: () => void;
        onSettings?: () => void;
    };
    rightContent?: React.ReactNode;
}

/**
 * 知识库页面通用头部
 */
export default function KBHeader({
    title,
    subtitle,
    isSidebarCollapsed,
    onToggleSidebar,
    actions,
    rightContent
}: KBHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* 侧边栏切换 */}
                <button
                    onClick={onToggleSidebar}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                    title={isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
                >
                    {isSidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                </button>

                {/* 标题 */}
                <div>
                    <h1 className="text-sm font-medium text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* 默认操作按钮 */}
                {actions?.onStar && (
                    <button
                        onClick={actions.onStar}
                        className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-gray-100 rounded transition"
                        title="收藏"
                    >
                        <Star size={16} />
                    </button>
                )}
                {actions?.onShare && (
                    <button
                        onClick={actions.onShare}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition"
                        title="分享"
                    >
                        <Share2 size={16} />
                    </button>
                )}
                {actions?.onSettings && (
                    <button
                        onClick={actions.onSettings}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                        title="设置"
                    >
                        <Settings size={16} />
                    </button>
                )}

                {/* 自定义右侧内容 */}
                {rightContent}
            </div>
        </header>
    );
}

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, PanelLeftClose } from 'lucide-react';
import type { KnowledgeBase } from '@/types/team';

interface SidebarHeaderProps {
    mode?: 'default' | 'knowledgeBase';
    kb?: KnowledgeBase | null;
    onCollapse?: () => void;
}

/**
 * 侧边栏头部组件
 * - 默认模式: 显示品牌 Logo
 * - 知识库模式: 显示知识库名称和返回按钮
 */
export default function SidebarHeader({ mode = 'default', kb, onCollapse }: SidebarHeaderProps) {
    const router = useRouter();

    return (
        <div className="p-4 border-b border-gray-100">
            {mode === 'knowledgeBase' && kb ? (
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push(`/teams/${kb.teamId}`)}
                        className="flex items-center gap-2 hover:opacity-80 transition"
                    >
                        <span className="text-xl">{kb.icon || '📁'}</span>
                        <span className="font-semibold text-gray-900 truncate text-sm">{kb.name}</span>
                    </button>
                    {onCollapse && (
                        <button
                            onClick={onCollapse}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                            title="收起侧边栏"
                        >
                            <PanelLeftClose size={16} />
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="text-white" size={18} />
                    </div>
                    <span className="font-bold text-gray-900">制度管理系统</span>
                </div>
            )}
        </div>
    );
}

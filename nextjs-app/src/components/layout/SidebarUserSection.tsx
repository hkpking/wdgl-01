"use client";

import React from 'react';
import { LogOut } from 'lucide-react';

interface SidebarUserSectionProps {
    currentUser?: {
        uid: string;
        email?: string;
        displayName?: string;
    } | null;
    onLogout?: () => void;
}

/**
 * 侧边栏用户信息区域
 * - 用户头像
 * - 用户名和邮箱
 * - 登出按钮
 */
export default function SidebarUserSection({ currentUser, onLogout }: SidebarUserSectionProps) {
    return (
        <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                    {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {currentUser?.displayName || currentUser?.email?.split('@')[0] || '用户'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                        {currentUser?.email || ''}
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                    title="退出登录"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </div>
    );
}

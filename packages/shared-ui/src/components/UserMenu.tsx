/**
 * 用户菜单组件
 * 显示用户信息和操作菜单
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import type { UserMenuProps } from '../types';

export function UserMenu({
    user,
    onSignOut,
    onSettingsClick,
    className = '',
}: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        setIsOpen(false);
        onSignOut?.();
    };

    const handleSettings = () => {
        setIsOpen(false);
        onSettingsClick?.();
    };

    // 获取用户头像显示
    const avatarContent = user.avatarUrl ? (
        <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-8 h-8 rounded-full object-cover"
        />
    ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
                {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
        </div>
    );

    return (
        <div className={`relative ${className}`} ref={menuRef}>
            {/* 触发按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                {avatarContent}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    {user.displayName}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            {/* 下拉菜单 */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    {/* 用户信息 */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            {avatarContent}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {user.displayName}
                                </div>
                                {user.email && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 菜单项 */}
                    <div className="p-2">
                        <button
                            onClick={handleSettings}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">设置</span>
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">退出登录</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

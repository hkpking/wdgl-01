/**
 * 全局导航组件
 * 统一门户的顶部导航栏
 */
'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { UserMenu } from './UserMenu';
import type { GlobalNavProps } from './types';

export function GlobalNav({
    user,
    products,
    currentProductId,
    onProductChange,
    onSignOut,
    onSearch,
    showSearch = true,
    className = '',
    theme = 'light',
}: GlobalNavProps & { theme?: 'light' | 'teal' | 'pink' }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch?.(searchQuery.trim());
        }
    };

    // 主题样式配置
    const isTeal = theme === 'teal';
    const isPink = theme === 'pink';
    const isDarkTheme = isTeal || isPink;

    let bgColor = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800';
    if (isTeal) bgColor = 'bg-teal-600 border-teal-500';
    if (isPink) bgColor = 'bg-pink-600 border-pink-500';

    const textColor = isDarkTheme ? 'text-white' : 'text-gray-900 dark:text-gray-100';
    const iconColor = isDarkTheme ? 'text-white/80' : 'text-gray-600 dark:text-gray-400';
    const inputBg = isDarkTheme ? 'bg-black/10' : 'bg-gray-100 dark:bg-gray-800';
    const inputPlaceholder = isDarkTheme ? 'placeholder-white/50 text-white' : 'placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100';

    return (
        <header className={`${bgColor} border-b ${className} transition-colors duration-300`}>
            <div className="w-full px-4 sm:px-6 lg:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* 左侧：Logo */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <span className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-blue-600'}`}>W</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className={`text-lg font-bold tracking-tight ${textColor}`}>
                                    WDGL
                                </span>
                                <span className={`ml-1 text-xs font-medium opacity-80 ${textColor} px-1.5 py-0.5 rounded ${isDarkTheme ? 'bg-white/20' : 'bg-gray-200'}`}>
                                    Portal
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 右侧：搜索 + 通知 + 用户菜单 */}
                    <div className="flex items-center gap-4">
                        {showSearch && (
                            <div className="hidden lg:block w-64">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="relative group">
                                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? 'text-white/50 group-hover:text-white/80' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            placeholder="搜索..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-1.5 ${inputBg} border border-transparent rounded-full text-sm ${inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-white/30 transition-all`}
                                        />
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {/* 通知图标 */}
                            <button className={`relative p-2 rounded-full hover:bg-black/10 transition-colors ${iconColor}`}>
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white/50 rounded-full" />
                            </button>

                            {/* 用户菜单 */}
                            <div className={isDarkTheme ? '[&_button]:text-white' : ''}>
                                {user ? (
                                    <UserMenu
                                        user={user}
                                        onSignOut={onSignOut}
                                    />
                                ) : (
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                                        登录
                                    </button>
                                )}
                            </div>

                            {/* 移动端菜单按钮 */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`md:hidden p-2 rounded-lg hover:bg-black/10 transition-colors ${iconColor}`}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 移动端菜单 */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-3">
                    {showSearch && (
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkTheme ? 'text-white/50' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    placeholder="搜索..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 ${inputBg} border border-transparent rounded-lg text-sm ${inputPlaceholder}`}
                                />
                            </div>
                        </form>
                    )}
                </div>
            )}
        </header>
    );
}

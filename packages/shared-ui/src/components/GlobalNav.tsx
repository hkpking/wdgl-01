/**
 * 全局导航组件
 * 统一门户的顶部导航栏
 */
'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { ProductSwitcher } from './ProductSwitcher';
import { UserMenu } from './UserMenu';
import type { GlobalNavProps } from '../types';

export function GlobalNav({
    user,
    products,
    currentProductId,
    onProductChange,
    onSignOut,
    onSearch,
    showSearch = true,
    className = '',
}: GlobalNavProps) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch?.(searchQuery.trim());
        }
    };

    return (
        <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* 左侧：Logo + 产品切换 */}
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">W</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">
                                WDGL
                            </span>
                        </div>

                        {/* 产品切换器 */}
                        <ProductSwitcher
                            products={products}
                            currentProductId={currentProductId}
                            onProductChange={onProductChange}
                        />
                    </div>

                    {/* 中间：搜索框 */}
                    {showSearch && (
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="搜索..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 右侧：通知 + 用户菜单 */}
                    <div className="flex items-center gap-2">
                        {/* 通知图标 */}
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            {/* 通知徽章 */}
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* 用户菜单 */}
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

                        {/* 移动端菜单按钮 */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 移动端菜单 */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-3">
                    {showSearch && (
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="搜索..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg text-sm"
                                />
                            </div>
                        </form>
                    )}
                </div>
            )}
        </header>
    );
}

/**
 * 门户布局组件
 * 统一的应用外壳，包含全局导航和内容区域
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GlobalNav } from '@/components/shared/GlobalNav';
import type { Product, NavUser } from '@/components/shared/types';
import { getActiveProducts, getProductUrl } from '@/config/products';
import { useStorage } from '@/contexts/StorageContext';

interface PortalLayoutProps {
    children: React.ReactNode;
    currentProductId?: string;
}

/**
 * 门户布局
 * 包装应用页面，提供统一的导航和外观
 */
import { PortalSidebar } from '@/components/portal/PortalSidebar';

export function PortalLayout({
    children,
    currentProductId = 'docs'
}: PortalLayoutProps) {
    const router = useRouter();
    const { currentUser, signOut } = useStorage() as any;

    // 获取激活的产品列表
    const products: Product[] = getActiveProducts();

    // 转换用户格式
    const navUser: NavUser | null = currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
    } : null;

    // 处理产品切换
    const handleProductChange = (productId: string) => {
        // 修正：切换产品时，默认进入该产品的 dashboard
        const url = getProductUrl(productId, '/dashboard');
        router.push(url);
    };

    // 处理登出
    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    // 处理搜索
    const handleSearch = (query: string) => {
        console.log('搜索:', query);
        router.push(`/dashboard?search=${encodeURIComponent(query)}`);
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            {/* 全局导航 - Jeecg 风格粉色主题 */}
            <div className="relative z-50 shadow-md">
                <GlobalNav
                    user={navUser}
                    products={products}
                    currentProductId={currentProductId}
                    onProductChange={handleProductChange}
                    onSignOut={handleSignOut}
                    onSearch={handleSearch}
                    theme="pink" // 修改主题为粉色
                />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* 左侧侧边栏 */}
                <PortalSidebar />

                {/* 右侧内容区域 */}
                <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
                    {/* 主内容 */}
                    <main className="flex-1 overflow-auto p-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

/**
 * 应用中心页面
 * 显示所有可用产品
 */
export function AppCenter() {
    const router = useRouter();
    const products = getActiveProducts();

    const handleProductClick = (productId: string) => {
        const url = getProductUrl(productId, '/dashboard');
        router.push(url);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    应用中心
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    选择您要使用的应用
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-800 text-left"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                            <span className="text-white text-xl font-bold">
                                {product.name.charAt(0)}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {product.description}
                            </p>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

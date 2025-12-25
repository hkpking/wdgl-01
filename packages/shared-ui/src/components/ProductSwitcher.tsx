/**
 * 产品切换器组件
 * 显示可用产品列表，支持快速切换
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Grid3X3, ChevronDown, ExternalLink } from 'lucide-react';
import type { ProductSwitcherProps, Product } from '../types';

// 产品图标映射
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Grid3X3,
};

export function ProductSwitcher({
    products,
    currentProductId,
    onProductChange,
    className = '',
}: ProductSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentProduct = products.find(p => p.id === currentProductId);

    const handleProductClick = (product: Product) => {
        if (product.id !== currentProductId) {
            onProductChange?.(product.id);
        }
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* 触发按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Grid3X3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {currentProduct && (
                    <>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {currentProduct.name}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </>
                )}
            </button>

            {/* 下拉菜单 */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                            切换应用
                        </p>
                        <div className="space-y-1">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleProductClick(product)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${product.id === currentProductId
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                            {product.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium">{product.name}</div>
                                        {product.description && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {product.description}
                                            </div>
                                        )}
                                    </div>
                                    {product.id === currentProductId && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    )}
                                    {product.id !== currentProductId && (
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

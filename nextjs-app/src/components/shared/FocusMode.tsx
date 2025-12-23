"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2, Moon, Sun, X } from 'lucide-react';

interface FocusModeProps {
    isActive: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    title?: string;
    isDark?: boolean;
    onThemeToggle?: () => void;
}

/**
 * 专注模式包装器
 * 提供全屏无干扰的编辑体验
 */
export default function FocusMode({
    isActive,
    onToggle,
    children,
    title,
    isDark = false,
    onThemeToggle
}: FocusModeProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    // 监听 ESC 键退出专注模式
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isActive) {
                onToggle();
            }
            // F11 进入/退出专注模式
            if (e.key === 'F11') {
                e.preventDefault();
                onToggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, onToggle]);

    // 进入/退出动画
    useEffect(() => {
        if (isActive) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    if (!isActive) {
        return <>{children}</>;
    }

    return (
        <div
            className={`
                fixed inset-0 z-50 flex flex-col
                transition-all duration-300
                ${isDark ? 'bg-gray-900' : 'bg-white'}
                ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}
        >
            {/* 专注模式顶栏 */}
            <header
                className={`
                    flex items-center justify-between px-6 py-3 
                    transition-opacity duration-500
                    hover:opacity-100 opacity-0
                    ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
                `}
            >
                <div className="flex items-center gap-3">
                    {title && (
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {title}
                        </span>
                    )}
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        按 ESC 或 F11 退出专注模式
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* 主题切换 */}
                    {onThemeToggle && (
                        <button
                            onClick={onThemeToggle}
                            className={`
                                p-2 rounded-lg transition
                                ${isDark
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }
                            `}
                            title={isDark ? '切换到浅色' : '切换到深色'}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}

                    {/* 退出按钮 */}
                    <button
                        onClick={onToggle}
                        className={`
                            p-2 rounded-lg transition
                            ${isDark
                                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }
                        `}
                        title="退出专注模式"
                    >
                        <X size={18} />
                    </button>
                </div>
            </header>

            {/* 内容区域 */}
            <div className={`
                flex-1 overflow-auto
                ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
            `}>
                <div className="max-w-3xl mx-auto px-8 py-12">
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * 专注模式切换按钮
 */
export function FocusModeToggle({
    isActive,
    onClick,
    className = ''
}: {
    isActive: boolean;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                p-2 rounded-lg transition flex items-center gap-1
                ${isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }
                ${className}
            `}
            title={isActive ? '退出专注模式 (F11)' : '进入专注模式 (F11)'}
        >
            {isActive ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
    );
}

/**
 * 专注模式 Hook
 */
export function useFocusMode(initialState = false) {
    const [isActive, setIsActive] = useState(initialState);
    const [isDark, setIsDark] = useState(false);

    const toggle = useCallback(() => {
        setIsActive(prev => !prev);
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev);
    }, []);

    return {
        isActive,
        isDark,
        toggle,
        toggleTheme,
        setIsActive,
        setIsDark
    };
}

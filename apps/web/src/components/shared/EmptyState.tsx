"use client";

import React from 'react';
import { FileText, FolderPlus, Upload, Sparkles, LucideIcon } from 'lucide-react';

interface EmptyStateAction {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actions?: EmptyStateAction[];
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

/**
 * 空状态引导组件
 * 当列表为空时显示友好的引导提示
 */
export default function EmptyState({
    icon: Icon = FileText,
    title,
    description,
    actions = [],
    className = '',
    size = 'medium'
}: EmptyStateProps) {
    const sizeClasses = {
        small: {
            container: 'py-8',
            icon: 'w-10 h-10',
            iconInner: 20,
            title: 'text-base',
            desc: 'text-sm',
            button: 'px-3 py-1.5 text-sm'
        },
        medium: {
            container: 'py-12',
            icon: 'w-14 h-14',
            iconInner: 28,
            title: 'text-lg',
            desc: 'text-sm',
            button: 'px-4 py-2 text-sm'
        },
        large: {
            container: 'py-16',
            icon: 'w-20 h-20',
            iconInner: 40,
            title: 'text-xl',
            desc: 'text-base',
            button: 'px-5 py-2.5 text-base'
        }
    };

    const s = sizeClasses[size];

    return (
        <div className={`flex flex-col items-center justify-center text-center ${s.container} ${className}`}>
            {/* 图标 */}
            <div className={`${s.icon} rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mb-4`}>
                <Icon size={s.iconInner} className="text-blue-500" />
            </div>

            {/* 标题 */}
            <h3 className={`${s.title} font-semibold text-gray-800 mb-2`}>
                {title}
            </h3>

            {/* 描述 */}
            {description && (
                <p className={`${s.desc} text-gray-500 max-w-sm mb-6`}>
                    {description}
                </p>
            )}

            {/* 操作按钮 */}
            {actions.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                    {actions.map((action, index) => {
                        const ActionIcon = action.icon;
                        const isPrimary = action.variant === 'primary' || index === 0;

                        return (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`
                                    ${s.button} rounded-lg font-medium flex items-center gap-2 transition
                                    ${isPrimary
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {ActionIcon && <ActionIcon size={16} />}
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// 预设的空状态配置
export const EmptyStatePresets = {
    documents: {
        icon: FileText,
        title: '还没有文档',
        description: '创建第一个文档开始记录知识，或从 Word 文件导入'
    },
    folder: {
        icon: FolderPlus,
        title: '文件夹是空的',
        description: '在这里创建文档来组织你的内容'
    },
    search: {
        icon: Sparkles,
        title: '没有找到结果',
        description: '试试其他关键词，或检查搜索范围'
    },
    upload: {
        icon: Upload,
        title: '拖拽文件到这里',
        description: '支持 Word、PDF、Excel 等格式'
    }
};

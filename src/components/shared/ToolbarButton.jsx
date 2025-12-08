import React from 'react';

/**
 * 通用工具栏按钮组件
 * 支持两种视觉风格: 'default' (MenuBar白色) 和 'google-docs' (DocToolbar蓝色)
 */
export function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
    className = "",
    variant = 'default'
}) {
    const baseStyles = "transition-colors flex items-center justify-center";

    const variantStyles = {
        'default': `p-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
            }`,
        'google-docs': `p-1.5 rounded-[4px] min-w-[28px] h-[28px] ${isActive ? 'bg-[#e8f0fe] text-[#1a73e8]' : 'text-[#444746] hover:bg-[#f0f4f8]'
            }`
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            disabled={disabled}
            title={title}
            className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
        >
            {children}
        </button>
    );
}

/**
 * 工具栏分隔符
 * 支持两种视觉风格
 */
export function ToolbarSeparator({ variant = 'default' }) {
    const styles = {
        'default': 'w-px h-5 bg-gray-300 mx-1',
        'google-docs': 'w-[1px] h-[20px] bg-[#c7c7c7] mx-1 self-center'
    };

    return <div className={styles[variant]}></div>;
}

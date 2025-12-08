/**
 * 建议模式切换器组件
 * 提供编辑模式和建议模式的切换
 */
import React, { useState, useRef, useEffect } from 'react';
import { Edit3, MessageSquare, Check, X, ChevronDown } from 'lucide-react';

const EDIT_MODES = [
    { id: 'editing', label: '编辑', icon: Edit3, description: '直接编辑文档' },
    { id: 'suggesting', label: '建议', icon: MessageSquare, description: '修改将显示为建议' },
];

export default function EditModeSelector({
    mode = 'editing',
    onChange,
    currentUser,
    onAcceptAll,
    onRejectAll,
    hasSuggestions = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentMode = EDIT_MODES.find(m => m.id === mode) || EDIT_MODES[0];
    const Icon = currentMode.icon;

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 主按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition
                    ${mode === 'suggesting'
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
            >
                <Icon size={14} />
                <span>{currentMode.label}</span>
                <ChevronDown size={12} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 下拉菜单 */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {/* 模式选项 */}
                    {EDIT_MODES.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = mode === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onChange(item.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-start gap-3 px-3 py-2 text-left transition
                                    ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                <ItemIcon
                                    size={16}
                                    className={isActive ? 'text-blue-600 mt-0.5' : 'text-gray-400 mt-0.5'}
                                />
                                <div className="flex-1">
                                    <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-gray-500">{item.description}</div>
                                </div>
                                {isActive && <Check size={14} className="text-blue-600 mt-0.5" />}
                            </button>
                        );
                    })}

                    {/* 建议操作 */}
                    {hasSuggestions && (
                        <>
                            <div className="h-px bg-gray-200 my-1" />
                            <div className="px-3 py-1.5 text-xs text-gray-500 font-medium">
                                建议操作
                            </div>
                            <button
                                onClick={() => {
                                    onAcceptAll?.();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition"
                            >
                                <Check size={14} />
                                接受所有建议
                            </button>
                            <button
                                onClick={() => {
                                    onRejectAll?.();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
                            >
                                <X size={14} />
                                拒绝所有建议
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

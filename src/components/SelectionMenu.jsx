/**
 * AI 选中文本浮动菜单组件
 * 当用户选中文本时显示，提供 AI 快捷操作
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Sparkles,
    Wand2,
    ArrowRight,
    FileText,
    Languages,
    Loader2,
    ChevronDown
} from 'lucide-react';
import { aiService } from '../services/ai/AIService';
import { PromptRegistry } from '../services/ai/PromptRegistry';

const AI_ACTIONS = [
    { id: 'rewrite', label: '改写', icon: Wand2, prompt: PromptRegistry.POLISH },
    { id: 'continue', label: '续写', icon: ArrowRight, prompt: PromptRegistry.CONTINUE },
    { id: 'summarize', label: '总结', icon: FileText, prompt: PromptRegistry.SUMMARIZE },
    { id: 'translate', label: '翻译', icon: Languages, prompt: (text) => PromptRegistry.TRANSLATE(text, 'English') },
];

const MORE_ACTIONS = [
    { id: 'expand', label: '扩写', prompt: PromptRegistry.EXPAND },
    { id: 'shorten', label: '精简', prompt: PromptRegistry.SHORTEN },
    { id: 'formalize', label: '正式化', prompt: PromptRegistry.FORMALIZE },
    { id: 'simplify', label: '简化', prompt: PromptRegistry.SIMPLIFY },
    { id: 'bullets', label: '转列表', prompt: PromptRegistry.BULLET_POINTS },
];

export default function SelectionMenu({ editor }) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeAction, setActiveAction] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const menuRef = useRef(null);

    // 处理选择变化
    const handleSelectionChange = useCallback(() => {
        if (!editor) return;

        const { from, to, empty } = editor.state.selection;

        // 没有选中文本或正在加载时隐藏
        if (empty || isLoading) {
            setIsVisible(false);
            setShowMore(false);
            return;
        }

        const text = editor.state.doc.textBetween(from, to, ' ');

        // 文本太短不显示菜单
        if (text.trim().length < 3) {
            setIsVisible(false);
            return;
        }

        setSelectedText(text);

        // 计算菜单位置
        try {
            const { view } = editor;
            const coords = view.coordsAtPos(from);

            // 获取编辑器容器的位置
            const editorRect = view.dom.getBoundingClientRect();

            // 计算相对于视口的位置
            setPosition({
                top: coords.top - editorRect.top - 45, // 菜单高度 + 间距
                left: coords.left - editorRect.left,
            });

            setIsVisible(true);
        } catch (e) {
            // 忽略位置计算错误
        }
    }, [editor, isLoading]);

    // 监听选择变化
    useEffect(() => {
        if (!editor) return;

        editor.on('selectionUpdate', handleSelectionChange);

        // 点击外部关闭
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsVisible(false);
                setShowMore(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            editor.off('selectionUpdate', handleSelectionChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editor, handleSelectionChange]);

    // 执行 AI 操作
    const executeAction = useCallback(async (action) => {
        if (!editor || !selectedText || isLoading) return;

        setIsLoading(true);
        setActiveAction(action.id);

        try {
            const prompt = action.prompt(selectedText);
            const result = await aiService.generateText(prompt);

            if (result) {
                // 获取当前选区
                const { from, to } = editor.state.selection;

                // 替换选中的文本
                editor.chain()
                    .focus()
                    .setTextSelection({ from, to })
                    .insertContent(result.trim())
                    .run();
            }
        } catch (error) {
            console.error('AI Action failed:', error);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
            setIsVisible(false);
            setShowMore(false);
        }
    }, [editor, selectedText, isLoading]);

    if (!isVisible || !editor) return null;

    return (
        <div
            ref={menuRef}
            className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex items-center gap-0.5"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
        >
            {/* AI 图标 */}
            <div className="px-2 py-1.5 text-blue-500">
                <Sparkles size={14} />
            </div>

            <div className="w-px h-6 bg-gray-200" />

            {/* 主要操作 */}
            {AI_ACTIONS.map((action) => (
                <button
                    key={action.id}
                    onClick={() => executeAction(action)}
                    disabled={isLoading}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded transition flex items-center gap-1
                        ${isLoading && activeAction === action.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title={action.label}
                >
                    {isLoading && activeAction === action.id ? (
                        <Loader2 size={12} className="animate-spin" />
                    ) : (
                        <action.icon size={12} />
                    )}
                    <span className="hidden sm:inline">{action.label}</span>
                </button>
            ))}

            <div className="w-px h-6 bg-gray-200" />

            {/* 更多操作下拉 */}
            <div className="relative">
                <button
                    onClick={() => setShowMore(!showMore)}
                    disabled={isLoading}
                    className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 rounded transition flex items-center gap-0.5"
                    title="更多"
                >
                    <ChevronDown size={14} className={`transition ${showMore ? 'rotate-180' : ''}`} />
                </button>

                {showMore && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px]">
                        {MORE_ACTIONS.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => executeAction(action)}
                                disabled={isLoading}
                                className="w-full px-3 py-1.5 text-xs text-left text-gray-600 hover:bg-gray-100 transition"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

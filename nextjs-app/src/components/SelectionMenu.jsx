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
    ChevronDown,
    Send,
    X
} from 'lucide-react';
import { aiService } from '@/lib/ai/AIService';
import { PromptRegistry } from '@/lib/ai/PromptRegistry';

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
    const [selectionRange, setSelectionRange] = useState({ from: 0, to: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [activeAction, setActiveAction] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const menuRef = useRef(null);
    const customInputRef = useRef(null);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // 记录鼠标位置用于菜单定位
    useEffect(() => {
        const handleMouseUp = (e) => {
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };
        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    // 处理选择变化
    const handleSelectionChange = useCallback(() => {
        if (!editor) return;

        const { from, to, empty } = editor.state.selection;

        // 没有选中文本或正在加载时隐藏
        if (empty || isLoading) {
            if (!isLoading) {
                setIsVisible(false);
                setShowMore(false);
                setShowCustomInput(false);
            }
            return;
        }

        const text = editor.state.doc.textBetween(from, to, ' ');

        // 文本太短不显示菜单
        if (text.trim().length < 3) {
            setIsVisible(false);
            return;
        }

        setSelectedText(text);
        setSelectionRange({ from, to });

        // 优化菜单位置：跟随鼠标释放位置
        try {
            const { view } = editor;
            const editorRect = view.dom.getBoundingClientRect();

            // 使用鼠标位置计算，稍微偏上
            let top = lastMousePos.current.y - editorRect.top - 50;
            let left = lastMousePos.current.x - editorRect.left - 50;

            // 边界检查
            const menuWidth = 380; // 预估菜单宽度
            if (left + menuWidth > editorRect.width) {
                left = editorRect.width - menuWidth;
            }
            if (left < 0) left = 0;
            if (top < 10) top = 10;

            setPosition({ top, left });
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
                setShowCustomInput(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            editor.off('selectionUpdate', handleSelectionChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editor, handleSelectionChange]);

    // 聚焦自定义输入框
    useEffect(() => {
        if (showCustomInput && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [showCustomInput]);

    // 执行 AI 操作
    const executeAction = useCallback(async (action) => {
        if (!editor || !selectedText || isLoading) return;

        setIsLoading(true);
        setActiveAction(action.id);

        try {
            const prompt = action.prompt(selectedText);
            const result = await aiService.generateText(prompt);

            if (result) {
                // 使用保存的选区范围替换文本
                editor.chain()
                    .focus()
                    .setTextSelection({ from: selectionRange.from, to: selectionRange.to })
                    .insertContent(result.trim())
                    .run();

                // 选中新插入的文本，支持连续修改
                const newTo = selectionRange.from + result.trim().length;
                setTimeout(() => {
                    editor.chain()
                        .focus()
                        .setTextSelection({ from: selectionRange.from, to: newTo })
                        .run();
                    setSelectionRange({ from: selectionRange.from, to: newTo });
                    setSelectedText(result.trim());
                }, 50);
            }
        } catch (error) {
            console.error('AI Action failed:', error);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
            setShowMore(false);
        }
    }, [editor, selectedText, selectionRange, isLoading]);

    // 执行自定义指令
    const executeCustomPrompt = useCallback(async () => {
        if (!editor || !selectedText || isLoading || !customPrompt.trim()) return;

        setIsLoading(true);
        setActiveAction('custom');

        try {
            const fullPrompt = `请根据以下指令处理文本：\n\n指令：${customPrompt}\n\n原文：${selectedText}`;
            const result = await aiService.generateText(fullPrompt);

            if (result) {
                editor.chain()
                    .focus()
                    .setTextSelection({ from: selectionRange.from, to: selectionRange.to })
                    .insertContent(result.trim())
                    .run();

                // 选中新文本
                const newTo = selectionRange.from + result.trim().length;
                setTimeout(() => {
                    editor.chain()
                        .focus()
                        .setTextSelection({ from: selectionRange.from, to: newTo })
                        .run();
                    setSelectionRange({ from: selectionRange.from, to: newTo });
                    setSelectedText(result.trim());
                }, 50);
            }
        } catch (error) {
            console.error('Custom AI Action failed:', error);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
            setShowCustomInput(false);
            setCustomPrompt('');
        }
    }, [editor, selectedText, selectionRange, isLoading, customPrompt]);

    if (!isVisible || !editor) return null;

    return (
        <div
            ref={menuRef}
            className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-1.5"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
        >
            {/* 主菜单行 */}
            <div className="flex items-center gap-0.5">
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

                {/* 自定义指令按钮 */}
                <button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    disabled={isLoading}
                    className={`px-2 py-1.5 text-xs font-medium rounded transition flex items-center gap-1
                        ${showCustomInput ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'}
                        disabled:opacity-50
                    `}
                    title="自定义指令"
                >
                    <Wand2 size={12} />
                    <span className="hidden sm:inline">自定义</span>
                </button>

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
                        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px] z-10">
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

            {/* 自定义指令输入框 */}
            {showCustomInput && (
                <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-2">
                    <input
                        ref={customInputRef}
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                executeCustomPrompt();
                            } else if (e.key === 'Escape') {
                                setShowCustomInput(false);
                                setCustomPrompt('');
                            }
                        }}
                        placeholder="输入 AI 指令，如：翻译成日语..."
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                        disabled={isLoading}
                    />
                    <button
                        onClick={executeCustomPrompt}
                        disabled={isLoading || !customPrompt.trim()}
                        className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 transition"
                    >
                        {isLoading && activeAction === 'custom' ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Send size={14} />
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setShowCustomInput(false);
                            setCustomPrompt('');
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}


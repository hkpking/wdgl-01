/**
 * 查找替换浮层组件
 * 支持查找、替换、上下导航
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronUp, ChevronDown, Replace, ReplaceAll, CaseSensitive } from 'lucide-react';

export default function SearchReplace({
    editor,
    isOpen,
    onClose,
    mode = 'search' // 'search' or 'replace'
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [showReplace, setShowReplace] = useState(mode === 'replace');

    const searchInputRef = useRef(null);

    // 获取搜索结果
    const results = editor?.storage?.searchReplace?.results || [];
    const currentIndex = editor?.storage?.searchReplace?.currentIndex || 0;

    // 聚焦搜索框
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
            // 如果有选中文本，使用选中文本作为搜索词
            if (editor) {
                const { from, to } = editor.state.selection;
                if (from !== to) {
                    const selectedText = editor.state.doc.textBetween(from, to);
                    if (selectedText && selectedText.length < 100) {
                        setSearchTerm(selectedText);
                    }
                }
            }
        }
    }, [isOpen, editor]);

    // 更新搜索词
    useEffect(() => {
        if (editor && editor.commands.setSearchTerm) {
            editor.commands.setSearchTerm(searchTerm);
            if (searchTerm) {
                // 强制触发视图更新
                editor.view.dispatch(editor.state.tr);
            }
        }
    }, [searchTerm, editor]);

    // 更新大小写敏感
    useEffect(() => {
        if (editor && editor.commands.setCaseSensitive) {
            editor.commands.setCaseSensitive(caseSensitive);
            editor.view.dispatch(editor.state.tr);
        }
    }, [caseSensitive, editor]);

    // 键盘事件处理
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            handleClose();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                handlePrevious();
            } else {
                handleNext();
            }
        } else if (e.key === 'F3') {
            e.preventDefault();
            if (e.shiftKey) {
                handlePrevious();
            } else {
                handleNext();
            }
        }
    }, []);

    const handleClose = useCallback(() => {
        if (editor && editor.commands.clearSearch) {
            editor.commands.clearSearch();
            editor.view.dispatch(editor.state.tr);
        }
        setSearchTerm('');
        setReplaceTerm('');
        onClose();
    }, [editor, onClose]);

    const handleNext = useCallback(() => {
        if (editor && editor.commands.nextSearchResult) {
            editor.commands.nextSearchResult();
        }
    }, [editor]);

    const handlePrevious = useCallback(() => {
        if (editor && editor.commands.previousSearchResult) {
            editor.commands.previousSearchResult();
        }
    }, [editor]);

    const handleReplace = useCallback(() => {
        if (editor && editor.commands.replaceCurrentResult) {
            editor.commands.setReplaceTerm(replaceTerm);
            editor.chain().focus().replaceCurrentResult().run();
            // 更新搜索结果
            editor.view.dispatch(editor.state.tr);
        }
    }, [editor, replaceTerm]);

    const handleReplaceAll = useCallback(() => {
        if (editor && editor.commands.replaceAllResults) {
            editor.commands.setReplaceTerm(replaceTerm);
            editor.chain().focus().replaceAllResults().run();
            editor.view.dispatch(editor.state.tr);
        }
    }, [editor, replaceTerm]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed top-16 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-80"
            onKeyDown={handleKeyDown}
        >
            {/* 搜索行 */}
            <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="查找..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* 结果计数 */}
                {searchTerm && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        {results.length > 0
                            ? `${currentIndex + 1}/${results.length}`
                            : '无结果'
                        }
                    </span>
                )}

                {/* 导航按钮 */}
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={handlePrevious}
                        disabled={results.length === 0}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                        title="上一个 (Shift+Enter)"
                    >
                        <ChevronUp size={16} />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={results.length === 0}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                        title="下一个 (Enter)"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>

                {/* 大小写敏感 */}
                <button
                    onClick={() => setCaseSensitive(!caseSensitive)}
                    className={`p-1.5 rounded transition ${caseSensitive ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    title="区分大小写"
                >
                    <CaseSensitive size={14} />
                </button>

                {/* 展开替换 */}
                <button
                    onClick={() => setShowReplace(!showReplace)}
                    className={`p-1.5 rounded transition ${showReplace ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    title="替换 (Ctrl+H)"
                >
                    <Replace size={14} />
                </button>

                {/* 关闭按钮 */}
                <button
                    onClick={handleClose}
                    className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                    title="关闭 (Esc)"
                >
                    <X size={16} />
                </button>
            </div>

            {/* 替换行 */}
            {showReplace && (
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 relative">
                        <Replace size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={replaceTerm}
                            onChange={(e) => setReplaceTerm(e.target.value)}
                            placeholder="替换为..."
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 替换按钮 */}
                    <button
                        onClick={handleReplace}
                        disabled={results.length === 0}
                        className="px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition"
                        title="替换当前"
                    >
                        替换
                    </button>
                    <button
                        onClick={handleReplaceAll}
                        disabled={results.length === 0}
                        className="px-2 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
                        title="替换全部"
                    >
                        <ReplaceAll size={12} />
                        全部
                    </button>
                </div>
            )}
        </div>
    );
}

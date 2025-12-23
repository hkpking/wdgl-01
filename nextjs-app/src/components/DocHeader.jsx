import React, { useState, useRef, useEffect } from 'react';
import {
    Star, MessageSquare, Video, Lock,
    FileText, ChevronDown, Clock, Cloud,
    Image as ImageIcon, Link as LinkIcon, Table as TableIcon,
    Minus, SquareCode, MoreHorizontal, ChevronRight,
    Download, Printer, FileJson, Settings
} from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { uploadImage } from '@/lib/editor-utils';
import * as mockStorage from '@/lib/services/mockStorage';
import { useDocumentExport } from '@/hooks/useDocumentExport';
import SettingsModal from './SettingsModal';

export default function DocHeader({
    title,
    setTitle,
    status,
    saving,
    lastSaved,
    onBack,
    onShare,
    editor,
    onOpenVersionHistory,
    onImport, // New prop for import handler
    onInsertBlock, // New prop for block insertion
    content, // New prop for export fallback
    children // Accept children for custom buttons (like AI Assistant)
}) {
    const menus = ['文件', '编辑', '查看', '插入', '格式', '工具', '扩展程序', '帮助'];
    const [activeMenu, setActiveMenu] = useState(null);
    const [showTablePicker, setShowTablePicker] = useState(false);
    const [tableSize, setTableSize] = useState({ rows: 0, cols: 0 });
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const menuRef = useRef(null);
    const fileInputRef = useRef(null);
    const wordInputRef = useRef(null); // Ref for Word file input
    const currentUser = mockStorage.getCurrentUser();

    // Use custom hook for export
    const { exportAsPDF, exportAsMarkdown, exportAsWord } = useDocumentExport();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
                setShowTablePicker(false);
                setShowLinkInput(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const url = await uploadImage(file, currentUser?.uid);
                if (onInsertBlock) {
                    onInsertBlock('image', { src: url });
                } else if (editor) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            } catch (error) {
                console.error("Upload failed:", error);
                alert("图片上传失败");
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setActiveMenu(null);
        }
    };

    const handleWordUpload = (e) => {
        const file = e.target.files[0];
        if (file && onImport) {
            onImport(file);
            if (wordInputRef.current) {
                wordInputRef.current.value = '';
            }
            setActiveMenu(null);
        }
    };

    const addImageViaUrl = () => {
        const url = window.prompt('请输入图片 URL:');
        if (url) {
            if (onInsertBlock) {
                onInsertBlock('image', { src: url });
            } else if (editor) {
                editor.chain().focus().setImage({ src: url }).run();
            }
            setActiveMenu(null);
        }
    };

    const setLink = () => {
        if (linkUrl) {
            if (onInsertBlock) {
                // Block editor might not support inline links easily yet, or we insert a link block?
                // For now, maybe just alert or try to insert a process link if it matches?
                // Or if we have a 'paragraph' block with link support?
                // The current block editor is block-based.
                // Let's assume we can't easily do inline links in the block editor without more work.
                // But we can insert a 'process_link' block if that's what they mean?
                // Or maybe just skip for now or add a generic 'clause' with the link text?
                alert('当前编辑器暂不支持插入行内链接，请使用“流程挂载”功能');
            } else if (editor) {
                editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            }
            setLinkUrl('');
            setShowLinkInput(false);
            setActiveMenu(null);
        }
    };

    const handleDownloadPDF = () => {
        exportAsPDF();
        setActiveMenu(null);
    };

    const handleDownloadMarkdown = () => {
        exportAsMarkdown(editor, title, content); // Pass content as fallback
        setActiveMenu(null);
    };

    const handleDownloadWord = () => {
        exportAsWord(editor, title, content);
        setActiveMenu(null);
    };

    const renderFileMenu = () => (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-50 w-64 flex flex-col gap-1">
            <button
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                onClick={() => wordInputRef.current?.click()}
            >
                <FileText size={18} />
                <span>导入 Word 文档 (.docx)</span>
            </button>
            <div className="h-px bg-gray-200 my-1"></div>
            <div className="relative group">
                <button className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full">
                    <div className="flex items-center gap-3">
                        <Download size={18} />
                        <span>下载</span>
                    </div>
                    <ChevronRight size={14} />
                </button>
                <div className="absolute top-0 left-full ml-0.5 bg-white border border-gray-200 rounded shadow-lg p-1 hidden group-hover:block w-56">
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onClick={handleDownloadPDF}
                    >
                        <FileText size={18} />
                        <span>PDF 文档 (.pdf)</span>
                    </button>
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onClick={handleDownloadMarkdown}
                    >
                        <FileJson size={18} />
                        <span>Markdown (.md)</span>
                    </button>
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onClick={handleDownloadWord}
                    >
                        <FileText size={18} />
                        <span>Word 文档 (.docx)</span>
                    </button>
                </div>
            </div>
            <div className="h-px bg-gray-200 my-1"></div>
            <button
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                onClick={() => {
                    window.print();
                    setActiveMenu(null);
                }}
            >
                <Printer size={18} />
                <span>打印</span>
            </button>
        </div>
    );

    const renderInsertMenu = () => (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-50 w-64 flex flex-col gap-1">
            {/* Image */}
            <div className="relative group">
                <button className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full">
                    <div className="flex items-center gap-3">
                        <ImageIcon size={18} />
                        <span>图片</span>
                    </div>
                    <ChevronRight size={14} />
                </button>
                {/* Image Submenu */}
                <div className="absolute top-0 left-full ml-0.5 bg-white border border-gray-200 rounded shadow-lg p-1 hidden group-hover:block w-48">
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <span>上传电脑中的图片</span>
                    </button>
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onClick={addImageViaUrl}
                    >
                        <span>按网址</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div
                className="relative group"
                onMouseEnter={() => setShowTablePicker(true)}
                onMouseLeave={() => setShowTablePicker(false)}
            >
                <button className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full">
                    <div className="flex items-center gap-3">
                        <TableIcon size={18} />
                        <span>表格</span>
                    </div>
                    <ChevronRight size={14} />
                </button>

                {/* Table Picker Submenu */}
                {showTablePicker && (
                    <div className="absolute top-0 left-full ml-0.5 bg-white border border-gray-200 rounded shadow-lg p-3 z-50 w-64">
                        <div className="text-xs text-gray-600 mb-2 text-center font-medium">
                            {tableSize.rows > 0 && tableSize.cols > 0
                                ? `${tableSize.rows} x ${tableSize.cols} 表格`
                                : '选择表格大小'}
                        </div>
                        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
                            {Array.from({ length: 100 }, (_, i) => {
                                const row = Math.floor(i / 10) + 1;
                                const col = (i % 10) + 1;
                                const isHighlighted = row <= tableSize.rows && col <= tableSize.cols;

                                return (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 border border-gray-200 cursor-pointer transition-colors rounded-sm ${isHighlighted ? 'bg-blue-500 border-blue-500' : 'bg-white hover:bg-blue-50'
                                            }`}
                                        onMouseEnter={() => setTableSize({ rows: row, cols: col })}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onInsertBlock) {
                                                onInsertBlock('table', { rows: row, cols: col });
                                            } else if (editor) {
                                                editor.chain().focus().insertTable({
                                                    rows: row,
                                                    cols: col,
                                                    withHeaderRow: true
                                                }).run();
                                            }
                                            setActiveMenu(null);
                                            setShowTablePicker(false);
                                            setTableSize({ rows: 0, cols: 0 });
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Drawing */}
            <div className="relative group">
                <button className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full">
                    <div className="flex items-center gap-3">
                        <MoreHorizontal size={18} />
                        <span>绘图</span>
                    </div>
                    <ChevronRight size={14} />
                </button>
                <div className="absolute top-0 left-full ml-0.5 bg-white border border-gray-200 rounded shadow-lg p-1 hidden group-hover:block w-48">
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onClick={() => {
                            if (onInsertBlock) {
                                onInsertBlock('flowchart');
                            } else if (editor) {
                                editor.chain().focus().insertContent({
                                    type: 'flowchart',
                                    attrs: {
                                        xml: null,
                                        width: '100%',
                                        height: '500px',
                                    },
                                }).run();
                            }
                            setActiveMenu(null);
                        }}
                    >
                        <span>流程图</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full opacity-50 cursor-not-allowed">
                        <span>新建 (开发中)</span>
                    </button>
                </div>
            </div>

            <div className="h-px bg-gray-200 my-1"></div>

            {/* Link */}
            <button
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                onClick={() => setShowLinkInput(true)}
            >
                <LinkIcon size={18} />
                <span>链接</span>
            </button>

            {/* Horizontal Line */}
            <button
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                onClick={() => {
                    if (onInsertBlock) {
                        // Insert a separator block or just a generic one?
                        // For now, let's insert a rule block as it's visually distinct?
                        // Or just alert not supported yet.
                        alert('暂不支持插入水平线');
                    } else if (editor) {
                        editor.chain().focus().setHorizontalRule().run();
                    }
                    setActiveMenu(null);
                }}
            >
                <Minus size={18} />
                <span>水平线</span>
            </button>

            {/* Code Block */}
            <button
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                onClick={() => {
                    if (onInsertBlock) {
                        // Insert a code block? We don't have a code block type yet.
                        // Maybe insert a generic clause with code styling?
                        alert('暂不支持插入代码块');
                    } else if (editor) {
                        editor.chain().focus().toggleCodeBlock().run();
                    }
                    setActiveMenu(null);
                }}
            >
                <SquareCode size={18} />
                <span>代码块</span>
            </button>
        </div>
    );

    return (
        <header className="bg-white flex flex-col z-20 relative no-print">
            {/* Top Row: Logo, Title, Actions */}
            <div className="flex items-center px-4 pt-3 pb-1 gap-4">
                {/* Logo */}
                <div
                    onClick={onBack}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    <FileText size={32} className="text-blue-600" />
                </div>

                {/* Title & File Info */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg font-medium text-gray-800 border border-transparent hover:border-gray-400 focus:border-blue-500 focus:bg-white rounded px-2 py-0.5 outline-none transition-all w-64"
                            placeholder="无标题文档"
                            data-testid="doc-title-input"
                        />
                        <button className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-full">
                            <Star size={18} />
                        </button>

                        {/* Status Badge */}
                        {status && (
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}
                                data-testid="doc-status-badge"
                            >
                                {STATUS_LABELS[status]}
                            </span>
                        )}
                    </div>

                    {/* Menu Bar */}
                    <div className="flex items-center gap-1 mt-1 relative" ref={menuRef}>
                        {menus.map(menu => (
                            <div key={menu} className="relative">
                                <button
                                    className={`text-sm px-2 py-0.5 rounded hover:bg-gray-100 transition-colors ${activeMenu === menu ? 'bg-gray-100' : 'text-gray-700'}`}
                                    onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                                >
                                    {menu}
                                </button>
                                {activeMenu === '文件' && menu === '文件' && renderFileMenu()}
                                {activeMenu === '插入' && menu === '插入' && renderInsertMenu()}
                                {/* Placeholders for other menus */}
                                {activeMenu === menu && menu !== '文件' && menu !== '插入' && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-50 min-w-[150px]">
                                        <div className="text-xs text-gray-400 italic px-2">功能开发中...</div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <span
                            className="text-xs text-gray-500 ml-4 flex items-center gap-1 cursor-pointer hover:underline hover:text-gray-800 transition-colors"
                            onClick={onOpenVersionHistory}
                            title="查看版本记录"
                        >
                            {saving ? (
                                <>保存中...</>
                            ) : (
                                <>
                                    <Cloud size={14} />
                                    {lastSaved ? '已保存到云端' : '所有更改已保存'}
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {children}
                    <button
                        onClick={onOpenVersionHistory}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                        title="查看版本记录"
                    >
                        <Clock size={24} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <MessageSquare size={24} />
                    </button>
                    <button className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full transition-colors font-medium text-sm">
                        <Video size={20} />
                        <ChevronDown size={16} />
                    </button>
                    <button
                        onClick={onShare}
                        className="flex items-center gap-2 bg-[#c2e7ff] hover:shadow-md text-[#001d35] px-6 py-2 rounded-full transition-all font-medium text-sm"
                        data-testid="share-button"
                    >
                        <Lock size={18} />
                        <span>共享</span>
                    </button>

                    {/* Settings Button */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                        title="设置"
                    >
                        <Settings size={20} />
                    </button>

                    <div className="w-9 h-9 bg-purple-600 rounded-full text-white flex items-center justify-center text-sm font-medium border-2 border-white cursor-pointer">
                        U
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
            <input
                ref={wordInputRef}
                type="file"
                accept=".docx"
                onChange={handleWordUpload}
                className="hidden"
            />

            {/* Link Input Dialog (Modal style if needed, or inline) */}
            {showLinkInput && (
                <div className="absolute top-24 left-64 bg-white border border-gray-200 rounded shadow-lg p-4 z-50 w-80 flex flex-col gap-3">
                    <h3 className="font-medium text-sm">插入链接</h3>
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="粘贴或输入链接"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowLinkInput(false)}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                            取消
                        </button>
                        <button
                            onClick={setLink}
                            className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
                        >
                            应用
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

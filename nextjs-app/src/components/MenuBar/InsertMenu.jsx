/**
 * 插入菜单组件
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, ChevronDown, Image as ImageIcon, Link as LinkIcon,
    Table as TableIcon, Minus, SquareCode, MoreHorizontal
} from 'lucide-react';
import { ToolbarButton as Button } from '../shared';
import { useImageUpload } from '../../hooks/useImageUpload';

export function InsertMenu({ editor, currentUser }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showTablePicker, setShowTablePicker] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [tableSize, setTableSize] = useState({ rows: 0, cols: 0 });

    const menuRef = useRef(null);
    const { fileInputRef, handleImageUpload, triggerUpload, addImageViaUrl } = useImageUpload(editor, currentUser);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
                setShowTablePicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) return null;

    const handleSetLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    return (
        <div className="relative border-r border-gray-300 pr-2" ref={menuRef}>
            <Button
                onClick={() => setShowMenu(!showMenu)}
                title="插入"
                className={`flex items-center gap-1 px-3 ${showMenu ? 'bg-gray-200' : ''}`}
            >
                <Plus size={16} />
                <span className="font-medium text-sm">插入</span>
                <ChevronDown size={12} />
            </Button>

            {/* Hidden File Input for Image Upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {showMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-50 w-56 flex flex-col gap-1">

                    {/* Image */}
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            triggerUpload();
                            setShowMenu(false);
                        }}
                    >
                        <ImageIcon size={18} />
                        <span>图片 (上传)</span>
                    </button>
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            addImageViaUrl();
                            setShowMenu(false);
                        }}
                    >
                        <LinkIcon size={18} />
                        <span>图片 (URL)</span>
                    </button>

                    {/* Table */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setShowTablePicker(true)}
                        onMouseLeave={() => setShowTablePicker(false)}
                    >
                        <button
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <div className="flex items-center gap-3">
                                <TableIcon size={18} />
                                <span>表格</span>
                            </div>
                            <span className="text-xs text-gray-400">▶</span>
                        </button>

                        {showTablePicker && (
                            <div className="absolute top-0 left-full ml-1 bg-white border border-gray-200 rounded shadow-lg p-3 z-50 w-64">
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
                                                className={`w-4 h-4 border border-gray-200 cursor-pointer transition-colors rounded-sm ${isHighlighted ? 'bg-blue-500 border-blue-500' : 'bg-white hover:bg-blue-50'}`}
                                                onMouseEnter={() => setTableSize({ rows: row, cols: col })}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    editor.chain().focus().insertTable({
                                                        rows: row,
                                                        cols: col,
                                                        withHeaderRow: true
                                                    }).run();
                                                    setShowMenu(false);
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

                    {/* Link */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowLinkInput(!showLinkInput)}
                        >
                            <LinkIcon size={18} />
                            <span>链接</span>
                        </button>
                        {showLinkInput && (
                            <div className="absolute top-0 left-full ml-1 bg-white border border-gray-200 rounded shadow-lg p-2 flex gap-2 z-50 w-64" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="输入链接..."
                                    className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSetLink()}
                                    autoFocus
                                />
                                <button
                                    onClick={handleSetLink}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 whitespace-nowrap"
                                >
                                    确定
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-200 my-1"></div>

                    {/* Divider */}
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            editor.chain().focus().setHorizontalRule().run();
                            setShowMenu(false);
                        }}
                    >
                        <Minus size={18} />
                        <span>分割线</span>
                    </button>

                    {/* Code Block */}
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            editor.chain().focus().toggleCodeBlock().run();
                            setShowMenu(false);
                        }}
                    >
                        <SquareCode size={18} />
                        <span>代码块</span>
                    </button>

                    <div className="h-px bg-gray-200 my-1"></div>

                    {/* Flowchart */}
                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            editor.chain().focus().insertContent({
                                type: 'flowchart',
                                attrs: {
                                    data: { cells: [] },
                                    width: '100%',
                                    height: '500px',
                                },
                            }).run();
                            setShowMenu(false);
                        }}
                    >
                        <MoreHorizontal size={18} />
                        <span>流程图</span>
                    </button>
                </div>
            )}
        </div>
    );
}

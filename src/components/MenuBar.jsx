import React, { useState, useRef, useEffect } from 'react';
import {
    Bold, Italic, Strikethrough, Code, List, ListOrdered, CheckSquare,
    Quote, SquareCode, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    Type, ChevronDown, Heading1, Heading2, Heading3, Minus,
    Table as TableIcon, Plus, MoreHorizontal,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Highlighter, Palette, Baseline
} from 'lucide-react';
import { uploadImage } from '../utils/editor';
import * as mockStorage from '../services/mockStorage';

const COLORS = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
    '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
    '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'
];

export default function MenuBar({ editor }) {
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);
    const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
    const [showLineHeightMenu, setShowLineHeightMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [showHighlightMenu, setShowHighlightMenu] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // Insert Menu State
    const [showInsertMenu, setShowInsertMenu] = useState(false);
    const [showTablePicker, setShowTablePicker] = useState(false);
    const [tableSize, setTableSize] = useState({ rows: 0, cols: 0 });

    const fileInputRef = useRef(null);
    const insertMenuRef = useRef(null);
    const fontFamilyMenuRef = useRef(null);
    const fontSizeMenuRef = useRef(null);
    const lineHeightMenuRef = useRef(null);
    const colorMenuRef = useRef(null);
    const highlightMenuRef = useRef(null);
    const colorInputRef = useRef(null);
    const highlightInputRef = useRef(null);
    const currentUser = mockStorage.getCurrentUser();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (insertMenuRef.current && !insertMenuRef.current.contains(event.target)) {
                setShowInsertMenu(false);
                setShowTablePicker(false);
            }
            if (fontFamilyMenuRef.current && !fontFamilyMenuRef.current.contains(event.target)) {
                setShowFontFamilyMenu(false);
            }
            if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(event.target)) {
                setShowFontSizeMenu(false);
            }
            if (lineHeightMenuRef.current && !lineHeightMenuRef.current.contains(event.target)) {
                setShowLineHeightMenu(false);
            }
            if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
                setShowColorMenu(false);
            }
            if (highlightMenuRef.current && !highlightMenuRef.current.contains(event.target)) {
                setShowHighlightMenu(false);
            }
            if (showHeadingMenu && !event.target.closest('button[title="标题"]')) {
                setShowHeadingMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showHeadingMenu]);

    if (!editor) {
        return null;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            try {
                const url = await uploadImage(file, currentUser?.uid);
                editor.chain().focus().setImage({ src: url }).run();
            } catch (error) {
                console.error("Upload failed:", error);
                alert("图片上传失败");
                // Fallback to base64 if upload fails (optional, or just alert)
            }
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const addImage = () => {
        // Trigger file input directly for better UX, or keep the choice dialog
        // Let's use the file input for now as it's standard
        fileInputRef.current?.click();
    };

    const addImageViaUrl = () => {
        const url = window.prompt('请输入图片 URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    const Button = ({ onClick, isActive = false, disabled = false, title, children, className = "" }) => (
        <button
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            disabled={disabled}
            title={title}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 bg-white z-10 items-center">
            {/* History */}
            <div className="flex gap-1 border-r border-gray-300 pr-2">
                <Button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    title="撤销"
                >
                    <Undo size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    title="重做"
                >
                    <Redo size={18} />
                </Button>
            </div>

            {/* Text Style */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 relative">
                {/* Font Family */}
                <div className="relative" ref={fontFamilyMenuRef}>
                    <Button
                        onClick={() => setShowFontFamilyMenu(!showFontFamilyMenu)}
                        title="字体"
                        className="w-24 justify-between flex items-center"
                    >
                        <span className="truncate text-xs">
                            {editor.getAttributes('textStyle').fontFamily || '默认字体'}
                        </span>
                        <ChevronDown size={12} />
                    </Button>
                    {showFontFamilyMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[150px] max-h-60 overflow-y-auto">
                            {[
                                { name: '默认字体', value: '' },
                                { name: 'Arial', value: 'Arial' },
                                { name: 'Helvetica', value: 'Helvetica' },
                                { name: 'Times New Roman', value: 'Times New Roman' },
                                { name: 'Courier New', value: 'Courier New' },
                                { name: 'Georgia', value: 'Georgia' },
                                { name: 'Verdana', value: 'Verdana' },
                                { name: 'Comic Sans MS', value: 'Comic Sans MS' },
                                { name: '宋体', value: 'SimSun' },
                                { name: '黑体', value: 'SimHei' },
                                { name: '微软雅黑', value: 'Microsoft YaHei' },
                                { name: '楷体', value: 'KaiTi' },
                            ].map((font) => (
                                <button
                                    key={font.name}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        if (font.value) {
                                            editor.chain().focus().setFontFamily(font.value).run();
                                        } else {
                                            editor.chain().focus().unsetFontFamily().run();
                                        }
                                        setShowFontFamilyMenu(false);
                                    }}
                                    className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left text-sm ${editor.isActive('textStyle', { fontFamily: font.value }) ? 'bg-gray-100' : ''}`}
                                    style={{ fontFamily: font.value }}
                                >
                                    {font.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Font Size */}
                <div className="relative" ref={fontSizeMenuRef}>
                    <Button
                        onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                        title="字号"
                        className="w-16 justify-between flex items-center"
                    >
                        <span className="truncate text-xs">
                            {editor.getAttributes('fontSize').size || '默认'}
                        </span>
                        <ChevronDown size={12} />
                    </Button>
                    {showFontSizeMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[80px] max-h-60 overflow-y-auto">
                            {[
                                { name: '默认', value: '' },
                                { name: '12px', value: '12px' },
                                { name: '14px', value: '14px' },
                                { name: '16px', value: '16px' },
                                { name: '18px', value: '18px' },
                                { name: '20px', value: '20px' },
                                { name: '24px', value: '24px' },
                                { name: '30px', value: '30px' },
                                { name: '36px', value: '36px' },
                                { name: '48px', value: '48px' },
                                { name: '60px', value: '60px' },
                                { name: '72px', value: '72px' },
                            ].map((size) => (
                                <button
                                    key={size.name}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        if (size.value) {
                                            editor.chain().focus().setFontSize(size.value).run();
                                        } else {
                                            editor.chain().focus().unsetFontSize().run();
                                        }
                                        setShowFontSizeMenu(false);
                                    }}
                                    className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left text-sm ${editor.isActive('fontSize', { size: size.value }) ? 'bg-gray-100' : ''}`}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="粗体"
                >
                    <Bold size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="斜体"
                >
                    <Italic size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="删除线"
                >
                    <Strikethrough size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="行内代码"
                >
                    <Code size={18} />
                </Button>
            </div>

            {/* Colors & Highlight */}
            <div className="flex gap-1 border-r border-gray-300 pr-2">
                {/* Text Color */}
                <div className="relative" ref={colorMenuRef}>
                    <Button
                        onClick={() => setShowColorMenu(!showColorMenu)}
                        title="文字颜色"
                        className={editor.getAttributes('textStyle').color ? 'text-blue-600' : ''}
                    >
                        <Palette size={18} />
                        <div
                            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-gray-300"
                            style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                        />
                    </Button>

                    {showColorMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                            <div className="mb-2 pb-2 border-b border-gray-100">
                                <button
                                    onClick={() => {
                                        editor.chain().focus().unsetColor().run();
                                        setShowColorMenu(false);
                                    }}
                                    className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                                >
                                    <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-xs">A</div>
                                    <span>默认颜色 (黑色)</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-10 gap-1 mb-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            editor.chain().focus().setColor(color).run();
                                            setShowColorMenu(false);
                                        }}
                                        className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        colorInputRef.current?.click();
                                        setShowColorMenu(false);
                                    }}
                                    className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                                >
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500"></div>
                                    <span>自定义颜色...</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        ref={colorInputRef}
                        type="color"
                        className="hidden"
                        onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                    />
                </div>

                {/* Highlight Color */}
                <div className="relative" ref={highlightMenuRef}>
                    <Button
                        onClick={() => setShowHighlightMenu(!showHighlightMenu)}
                        title="背景高亮"
                        isActive={editor.isActive('highlight')}
                    >
                        <Highlighter size={18} />
                        <div
                            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-gray-300"
                            style={{ backgroundColor: editor.getAttributes('highlight').color || 'transparent' }}
                        />
                    </Button>

                    {showHighlightMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                            <div className="mb-2 pb-2 border-b border-gray-100">
                                <button
                                    onClick={() => {
                                        editor.chain().focus().unsetHighlight().run();
                                        setShowHighlightMenu(false);
                                    }}
                                    className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                                >
                                    <div className="w-4 h-4 rounded border border-gray-300 bg-white text-gray-400 flex items-center justify-center text-xs">/</div>
                                    <span>无背景色</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-10 gap-1 mb-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            editor.chain().focus().toggleHighlight({ color }).run();
                                            setShowHighlightMenu(false);
                                        }}
                                        className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        highlightInputRef.current?.click();
                                        setShowHighlightMenu(false);
                                    }}
                                    className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                                >
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500"></div>
                                    <span>自定义颜色...</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        ref={highlightInputRef}
                        type="color"
                        className="hidden"
                        onInput={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                        value={editor.getAttributes('highlight').color || '#ffff00'}
                    />
                </div>
            </div>

            {/* Alignment */}
            <div className="flex gap-1 border-r border-gray-300 pr-2">
                <Button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="左对齐"
                >
                    <AlignLeft size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="居中对齐"
                >
                    <AlignCenter size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="右对齐"
                >
                    <AlignRight size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    title="两端对齐"
                >
                    <AlignJustify size={18} />
                </Button>
            </div>

            {/* Line Height */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 relative" ref={lineHeightMenuRef}>
                <Button
                    onClick={() => setShowLineHeightMenu(!showLineHeightMenu)}
                    title="行高"
                    className="w-16 justify-between flex items-center"
                >
                    <Baseline size={18} />
                    <ChevronDown size={12} />
                </Button>
                {showLineHeightMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[80px]">
                        {[
                            { name: '1.0', value: '1.0' },
                            { name: '1.15', value: '1.15' },
                            { name: '1.5', value: '1.5' },
                            { name: '2.0', value: '2.0' },
                            { name: '2.5', value: '2.5' },
                            { name: '3.0', value: '3.0' },
                        ].map((lh) => (
                            <button
                                key={lh.name}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    editor.chain().focus().setLineHeight(lh.value).run();
                                    setShowLineHeightMenu(false);
                                }}
                                className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left text-sm ${editor.isActive({ lineHeight: lh.value }) ? 'bg-gray-100' : ''}`}
                            >
                                {lh.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Headings */}
            <div className="flex gap-1 border-r border-gray-300 pr-2 relative">
                <Button
                    onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                    isActive={editor.isActive('heading')}
                    title="标题"
                >
                    <div className="flex items-center gap-1">
                        <Type size={18} />
                        <ChevronDown size={14} />
                    </div>
                </Button>

                {showHeadingMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[120px]">
                        <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                editor.chain().focus().toggleHeading({ level: 1 }).run();
                                setShowHeadingMenu(false);
                            }}
                            className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
                        >
                            <Heading1 size={18} /> 标题 1
                        </button>
                        <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                editor.chain().focus().toggleHeading({ level: 2 }).run();
                                setShowHeadingMenu(false);
                            }}
                            className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
                        >
                            <Heading2 size={18} /> 标题 2
                        </button>
                        <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                editor.chain().focus().toggleHeading({ level: 3 }).run();
                                setShowHeadingMenu(false);
                            }}
                            className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-100' : ''}`}
                        >
                            <Heading3 size={18} /> 标题 3
                        </button>
                    </div>
                )}
            </div>

            {/* Lists */}
            <div className="flex gap-1 border-r border-gray-300 pr-2">
                <Button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="无序列表"
                >
                    <List size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="有序列表"
                >
                    <ListOrdered size={18} />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    isActive={editor.isActive('taskList')}
                    title="任务列表"
                >
                    <CheckSquare size={18} />
                </Button>
            </div>

            {/* Blocks */}
            <div className="flex gap-1 border-r border-gray-300 pr-2">
                <Button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="引用"
                >
                    <Quote size={18} />
                </Button>
            </div>

            {/* Insert Menu */}
            <div className="relative border-r border-gray-300 pr-2" ref={insertMenuRef}>
                <Button
                    onClick={() => setShowInsertMenu(!showInsertMenu)}
                    title="插入"
                    className={`flex items-center gap-1 px-3 ${showInsertMenu ? 'bg-gray-200' : ''}`}
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

                {showInsertMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-50 w-56 flex flex-col gap-1">

                        {/* Image */}
                        <button
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                addImage();
                                setShowInsertMenu(false);
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
                                setShowInsertMenu(false);
                            }}
                        >
                            <LinkIcon size={18} />
                            <span>图片 (URL)</span>
                        </button>

                        {/* Table (with submenu behavior) */}
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

                            {/* Table Picker Submenu */}
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
                                                    className={`w-4 h-4 border border-gray-200 cursor-pointer transition-colors rounded-sm ${isHighlighted ? 'bg-blue-500 border-blue-500' : 'bg-white hover:bg-blue-50'
                                                        }`}
                                                    onMouseEnter={() => setTableSize({ rows: row, cols: col })}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        editor.chain().focus().insertTable({
                                                            rows: row,
                                                            cols: col,
                                                            withHeaderRow: true
                                                        }).run();
                                                        setShowInsertMenu(false);
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
                                        onKeyDown={(e) => e.key === 'Enter' && setLink()}
                                        autoFocus
                                    />
                                    <button
                                        onClick={setLink}
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
                                setShowInsertMenu(false);
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
                                setShowInsertMenu(false);
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
                                setShowInsertMenu(false);
                            }}
                        >
                            <MoreHorizontal size={18} />
                            <span>流程图</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full opacity-50 cursor-not-allowed" title="开发中">
                            <MoreHorizontal size={18} />
                            <span>思维导图 (开发中)</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left text-sm w-full opacity-50 cursor-not-allowed" title="开发中">
                            <MoreHorizontal size={18} />
                            <span>流程图 (开发中)</span>
                        </button>

                    </div>
                )}
            </div>


        </div >
    );
}

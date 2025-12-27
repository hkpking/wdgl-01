import React, { useState, useRef, useEffect } from 'react';
import {
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered,
    Plus, Type, Image as ImageIcon, Table as TableIcon, GitGraph, AlertTriangle, Shield, Workflow, Layout, Grid,
    ChevronDown, Undo, Redo
} from 'lucide-react';

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

export default function EditorToolbar({ onInsertBlock }) {
    const [showInsertMenu, setShowInsertMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
    const insertMenuRef = useRef(null);
    const colorMenuRef = useRef(null);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (insertMenuRef.current && !insertMenuRef.current.contains(event.target)) {
                setShowInsertMenu(false);
            }
            if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
                setShowColorMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        // Keep focus in editor? 
        // With contentEditable, focus might be lost if we click a button.
        // Usually buttons should preventDefault on mousedown to avoid stealing focus.
    };

    const ToolbarButton = ({ onClick, isActive = false, title, children, className = "" }) => (
        <button
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent losing focus from contentEditable
                onClick(e);
            }}
            title={title}
            className={`p-1.5 rounded-[4px] transition-colors flex items-center justify-center min-w-[28px] h-[28px] ${isActive ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
                } ${className}`}
        >
            {children}
        </button>
    );

    const ToolbarSeparator = () => (
        <div className="w-[1px] h-[20px] bg-slate-300 mx-1 self-center"></div>
    );

    return (
        <div className="bg-white px-3 py-2 flex flex-wrap gap-0.5 items-center border-b border-slate-200 sticky top-0 z-30 shadow-sm">

            {/* Insert Menu */}
            <div className="relative" ref={insertMenuRef}>
                <button
                    onClick={() => setShowInsertMenu(!showInsertMenu)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-100 text-slate-700 text-sm font-medium mr-2"
                >
                    <Plus size={16} />
                    <span>插入</span>
                    <ChevronDown size={12} />
                </button>
                {showInsertMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 w-48 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">基础块</div>
                        <button onClick={() => { onInsertBlock('clause'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <Type size={14} /> 文本/条款
                        </button>
                        <button onClick={() => { onInsertBlock('heading'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <Type size={14} className="font-bold" /> 标题
                        </button>

                        <div className="h-px bg-slate-100 my-1"></div>
                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">功能块</div>

                        <button onClick={() => { onInsertBlock('risk'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <AlertTriangle size={14} className="text-amber-500" /> 风险点
                        </button>
                        <button onClick={() => { onInsertBlock('rule'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <Shield size={14} className="text-red-500" /> 制度规则
                        </button>
                        <button onClick={() => { onInsertBlock('process_link'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <GitGraph size={14} className="text-purple-500" /> 关联流程
                        </button>
                        <button onClick={() => { onInsertBlock('process_card'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <Layout size={14} className="text-indigo-500" /> 流程卡片
                        </button>
                        <button onClick={() => { onInsertBlock('architecture_matrix'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <Layout size={14} className="text-indigo-500" /> 架构矩阵图
                        </button>

                        <div className="h-px bg-slate-100 my-1"></div>
                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">媒体</div>

                        <button onClick={() => { onInsertBlock('image'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <ImageIcon size={14} /> 图片
                        </button>
                        <button onClick={() => { onInsertBlock('table'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <TableIcon size={14} /> 表格
                        </button>
                        <button onClick={() => { onInsertBlock('flowchart'); setShowInsertMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 text-sm">
                            <Workflow size={14} className="text-orange-500" /> 流程图
                        </button>
                    </div>
                )}
            </div>

            <ToolbarSeparator />

            <ToolbarButton onClick={() => execCommand('undo')} title="撤销">
                <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('redo')} title="重做">
                <Redo size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            <ToolbarButton onClick={() => execCommand('bold')} title="粗体">
                <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('italic')} title="斜体">
                <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('underline')} title="下划线">
                <Underline size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('strikeThrough')} title="删除线">
                <Strikethrough size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            <div className="relative" ref={colorMenuRef}>
                <ToolbarButton onClick={() => setShowColorMenu(!showColorMenu)} title="字体颜色">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-sm leading-none">A</span>
                        <div className="w-4 h-1 bg-black mt-0.5"></div>
                    </div>
                </ToolbarButton>
                {showColorMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded shadow-lg p-2 z-50 w-48 grid grid-cols-8 gap-1">
                        {COLORS.slice(0, 32).map((color) => (
                            <button
                                key={color}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execCommand('foreColor', color);
                                    setShowColorMenu(false);
                                }}
                                className="w-5 h-5 rounded-sm border border-slate-100 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ToolbarSeparator />

            <ToolbarButton onClick={() => execCommand('justifyLeft')} title="左对齐">
                <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('justifyCenter')} title="居中">
                <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('justifyRight')} title="右对齐">
                <AlignRight size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Note: execCommand 'insertOrderedList' works on contentEditable, but might conflict with our block structure if not careful. 
                For now, it will create lists INSIDE the block, which is acceptable for rich text within a block. 
            */}
            <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="无序列表">
                <List size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="有序列表">
                <ListOrdered size={16} />
            </ToolbarButton>

        </div>
    );
}

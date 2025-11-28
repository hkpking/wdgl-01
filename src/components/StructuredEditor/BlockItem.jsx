import React, { useState, useRef, useEffect } from 'react';
import {
    GripVertical, X, Image as ImageIcon, Workflow, Edit, Hash,
    FileText, AlertTriangle, Shield, GitGraph, Trash2,
    MoreHorizontal, Copy, Plus, AlignLeft, AlignCenter, AlignRight,
    Heading1, Heading2, Heading3, Type,
    Maximize, Download, Maximize2, Minimize2
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DrawioEditor from '../DrawioEditor';
import ArchitectureMatrix from './ArchitectureMatrix';
import ZoomableCanvas from './ZoomableCanvas';
import html2canvas from 'html2canvas';

// Simple Menu Component
const BlockMenu = ({ isOpen, onClose, position, onAction }) => {
    if (!isOpen) return null;

    const menuItems = [
        {
            label: '转换为',
            icon: <Type size={14} />,
            children: [
                { label: '正文', icon: <FileText size={14} />, action: 'turn-text' },
                { label: '标题 1', icon: <Heading1 size={14} />, action: 'turn-h1' },
                { label: '标题 2', icon: <Heading2 size={14} />, action: 'turn-h2' },
                { label: '标题 3', icon: <Heading3 size={14} />, action: 'turn-h3' },
            ]
        },
        {
            label: '对齐方式',
            icon: <AlignLeft size={14} />,
            children: [
                { label: '左对齐', icon: <AlignLeft size={14} />, action: 'align-left' },
                { label: '居中', icon: <AlignCenter size={14} />, action: 'align-center' },
                { label: '右对齐', icon: <AlignRight size={14} />, action: 'align-right' },
            ]
        },
        { type: 'divider' },
        { label: '在下方插入', icon: <Plus size={14} />, action: 'insert-below' },
        { label: '复制', icon: <Copy size={14} />, action: 'duplicate' },
        { type: 'divider' },
        { label: '删除', icon: <Trash2 size={14} />, action: 'delete', danger: true },
    ];

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onClose(); }}></div>
            <div
                className="absolute z-50 bg-white rounded-lg shadow-xl border border-slate-200 w-48 py-1 text-sm animate-in fade-in zoom-in-95 duration-100"
                style={{ top: position.y, left: position.x }}
                onClick={(e) => e.stopPropagation()}
            >
                {menuItems.map((item, index) => {
                    if (item.type === 'divider') {
                        return <div key={index} className="h-px bg-slate-100 my-1"></div>;
                    }

                    if (item.children) {
                        return (
                            <div key={index} className="group relative px-1">
                                <div className="flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-slate-700">
                                    <div className="flex items-center gap-2">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                    <MoreHorizontal size={12} className="text-slate-400" />
                                </div>
                                {/* Submenu */}
                                <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-xl border border-slate-200 w-32 py-1 hidden group-hover:block">
                                    {item.children.map((child, cIndex) => (
                                        <button
                                            key={cIndex}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAction(child.action);
                                                onClose();
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                        >
                                            {child.icon}
                                            <span>{child.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction(item.action);
                                onClose();
                            }}
                            className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 mx-1 rounded-sm ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700'}`}
                            style={{ width: 'calc(100% - 8px)' }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default function BlockItem({ block, isSelected, onSelect, onChange, onDelete, onDuplicate, onInsertAfter, readOnly }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDrawioOpen, setIsDrawioOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuButtonRef = useRef(null);
    const contentRef = useRef(null);
    const exportRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : (showMenu ? 50 : 'auto'),
        position: 'relative',
        marginLeft: `${(block.indent || 0) * 24}px`, // Visual indentation
    };

    // Style Logic
    let containerClass = "block-item group relative mb-2 transition-all duration-200"; // Reduced margin for tighter feel
    let contentClass = "outline-none p-2 rounded border border-transparent transition-colors"; // Reduced padding
    let sideBorder = null;

    if (isSelected) {
        contentClass += " bg-blue-50/50 border-blue-200 shadow-sm";
    } else {
        contentClass += " hover:bg-slate-50";
    }

    // Alignment
    const alignClass = block.meta?.align === 'center' ? 'text-center' : block.meta?.align === 'right' ? 'text-right' : 'text-left';
    contentClass += ` ${alignClass}`;

    if (block.type === 'heading') {
        contentClass += block.level === 1 ? " text-3xl font-bold mb-6 mt-4 text-slate-900" :
            block.level === 2 ? " text-2xl font-bold mt-5 mb-3 text-slate-800" :
                " text-xl font-bold mt-4 mb-2 text-slate-800";
    } else if (block.type === 'risk') {
        contentClass += " bg-amber-50/50 text-slate-800 border-amber-100";
        sideBorder = <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l" />;
    } else if (block.type === 'rule') {
        contentClass += " bg-red-50/50 text-slate-800 border-red-100";
        sideBorder = <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l" />;
    } else if (block.type === 'process_link') {
        contentClass += " bg-purple-50 text-purple-900 font-medium flex items-center gap-3 border border-purple-100 py-2";
    } else {
        contentClass += " text-slate-700 leading-relaxed text-base";
    }



    useEffect(() => {
        if (isSelected && contentRef.current) {
            // Focus and place cursor at end
            contentRef.current.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(contentRef.current);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [isSelected]);

    const handleContentChange = (e) => {
        if (readOnly) return;
        // Use innerHTML to preserve rich text
        onChange({ ...block, content: e.currentTarget.innerHTML });
    };

    const handleMenuAction = (action) => {
        switch (action) {
            case 'duplicate':
                onDuplicate && onDuplicate(block.id);
                break;
            case 'delete':
                if (window.confirm('确定要删除此块吗？')) onDelete(block.id);
                break;
            case 'insert-below':
                onInsertAfter && onInsertAfter('clause'); // Default to clause
                break;
            case 'turn-text':
                onChange({ ...block, type: 'clause', level: undefined });
                break;
            case 'turn-h1':
                onChange({ ...block, type: 'heading', level: 1 });
                break;
            case 'turn-h2':
                onChange({ ...block, type: 'heading', level: 2 });
                break;
            case 'turn-h3':
                onChange({ ...block, type: 'heading', level: 3 });
                break;
            case 'align-left':
                onChange({ ...block, meta: { ...block.meta, align: 'left' } });
                break;
            case 'align-center':
                onChange({ ...block, meta: { ...block.meta, align: 'center' } });
                break;
            case 'align-right':
                onChange({ ...block, meta: { ...block.meta, align: 'right' } });
                break;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={containerClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
        >
            {!readOnly && (
                <>
                    {/* Unified Handle (6-dots) */}
                    <div
                        ref={menuButtonRef}
                        className={`absolute -left-8 top-2 p-1 text-slate-300 cursor-grab active:cursor-grabbing hover:bg-slate-100 hover:text-slate-600 rounded transition-all ${isSelected || isHovered || showMenu ? 'opacity-100' : 'opacity-0'}`}
                        {...attributes}
                        {...listeners}
                        onClick={(e) => {
                            // Important: dnd-kit might swallow click if drag is detected.
                            // We rely on PointerSensor constraints in parent to allow small movements as clicks.
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                    >
                        <GripVertical size={18} />
                    </div>

                    {/* Block Menu */}
                    <BlockMenu
                        isOpen={showMenu}
                        onClose={() => setShowMenu(false)}
                        position={{ y: 30, x: -20 }} // Relative to handle, simplified
                        onAction={handleMenuAction}
                    />
                </>
            )}

            <div className="relative pl-3">
                {sideBorder}

                {block.type === 'process_link' ? (
                    <div className={contentClass}>
                        <GitGraph size={18} className="text-purple-500 flex-shrink-0" />
                        <div
                            contentEditable={!readOnly}
                            suppressContentEditableWarning
                            onBlur={handleContentChange}
                            className="flex-1 outline-none"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                        <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full ml-auto select-none cursor-pointer">
                            跳转
                        </span>
                    </div>
                ) : block.type === 'image' ? (
                    <div className={`${contentClass} flex flex-col items-center justify-center bg-slate-50 border-dashed border-2 border-slate-200 min-h-[150px]`}>
                        {block.meta?.src ? (
                            <div className="relative w-full flex flex-col items-center group/image">
                                <img src={block.meta.src} alt="Block Content" className="max-w-full rounded shadow-sm max-h-[400px] object-contain" />
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, caption: e.currentTarget.textContent } })}
                                    className="mt-2 text-sm text-slate-500 text-center outline-none border-b border-transparent focus:border-blue-300 pb-1"
                                >
                                    {block.meta.caption || '添加图片说明...'}
                                </div>
                                {!readOnly && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onChange({ ...block, meta: { ...block.meta, src: '' } });
                                        }}
                                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-slate-600 hover:text-red-500 opacity-0 group-hover/image:opacity-100 transition-opacity"
                                        title="移除图片"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400 py-4">
                                <ImageIcon size={32} className="mb-2 opacity-50" />
                                <span className="text-sm mb-3">点击上传或粘贴图片 URL</span>
                                {!readOnly && (
                                    <div className="flex gap-2">
                                        <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded text-sm hover:bg-slate-50 transition-colors">
                                            选择文件
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const url = URL.createObjectURL(file);
                                                        onChange({ ...block, meta: { ...block.meta, src: url } });
                                                    }
                                                }}
                                            />
                                        </label>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = window.prompt('请输入图片 URL:');
                                                if (url) onChange({ ...block, meta: { ...block.meta, src: url } });
                                            }}
                                            className="px-3 py-1.5 bg-white border border-slate-300 rounded text-sm hover:bg-slate-50 transition-colors"
                                        >
                                            输入 URL
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : block.type === 'table' ? (
                    <div className={`${contentClass} overflow-x-auto`}>
                        <table className="w-full border-collapse border border-slate-200 text-sm">
                            <tbody>
                                {block.meta.data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <td key={colIndex} className="border border-slate-200 p-0 min-w-[80px]">
                                                <div
                                                    contentEditable={!readOnly}
                                                    suppressContentEditableWarning
                                                    className="p-2 outline-none focus:bg-blue-50"
                                                    onBlur={(e) => {
                                                        const newData = [...block.meta.data];
                                                        newData[rowIndex][colIndex] = e.currentTarget.textContent;
                                                        onChange({ ...block, meta: { ...block.meta, data: newData } });
                                                    }}
                                                >
                                                    {cell}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : block.type === 'process_card' ? (
                    <div className={`${contentClass} overflow-hidden border border-slate-300 rounded-sm`}>
                        <div className="bg-slate-50 border-b border-slate-200 p-2 text-center font-bold text-slate-700">
                            流程基础信息卡片
                        </div>
                        <div className="grid grid-cols-4 text-sm">
                            {/* Row 1 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程名称</div>
                            <div className="p-2 border-b border-r border-slate-200 col-span-3">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, name: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.name}</div>
                            </div>

                            {/* Row 2 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程层级</div>
                            <div className="p-2 border-b border-r border-slate-200">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, level: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.level}</div>
                            </div>
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程架构编码</div>
                            <div className="p-2 border-b border-slate-200">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, code: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.code}</div>
                            </div>

                            {/* Row 3 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程定义</div>
                            <div className="p-2 border-b border-r border-slate-200">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, definition: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.definition}</div>
                            </div>
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程目的</div>
                            <div className="p-2 border-b border-slate-200">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, purpose: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.purpose}</div>
                            </div>

                            {/* Row 4 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程责任人</div>
                            <div className="p-2 border-b border-r border-slate-200">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, owner: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.owner}</div>
                            </div>
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">上一层流程名称</div>
                            <div className="p-2 border-b border-slate-200">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em] cursor-pointer hover:text-blue-600 hover:underline"
                                    title="点击跳转（未来功能）"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, parent: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.parent}</div>
                            </div>

                            {/* Row 5 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">包含下一层流程</div>
                            <div className="p-2 border-b border-slate-200 col-span-3">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, children: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.children}</div>
                            </div>

                            {/* Row 6 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程输入</div>
                            <div className="p-2 border-b border-slate-200 col-span-3">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, input: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.input}</div>
                            </div>

                            {/* Row 7 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程输出</div>
                            <div className="p-2 border-b border-slate-200 col-span-3">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, output: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.output}</div>
                            </div>

                            {/* Row 8 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程起点</div>
                            <div className="p-2 border-b border-slate-200 col-span-3">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, start: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.start}</div>
                            </div>

                            {/* Row 9 */}
                            <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程终点</div>
                            <div className="p-2 border-b border-slate-200 col-span-3">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, end: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.end}</div>
                            </div>

                            {/* Row 10 */}
                            <div className="p-2 bg-slate-50 border-r border-slate-200 font-medium text-slate-600">流程KPI</div>
                            <div className="p-2 border-slate-200 col-span-3">
                                <div
                                    contentEditable={!readOnly}
                                    suppressContentEditableWarning
                                    className="outline-none min-h-[1.5em]"
                                    onBlur={(e) => onChange({ ...block, meta: { ...block.meta, fields: { ...block.meta.fields, kpi: e.currentTarget.textContent } } })}
                                >{block.meta.fields?.kpi}</div>
                            </div>
                        </div>
                    </div>
                ) : block.type === 'architecture_matrix' ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white my-4">
                        <div className="bg-slate-50 border-b border-slate-200 p-2 text-center font-bold text-slate-700 flex justify-between items-center px-4">
                            <span>架构矩阵图 (Architecture Matrix)</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsCompact(!isCompact)}
                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${isCompact ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {isCompact ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                                    {isCompact ? '宽松视图' : '紧凑视图'}
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!exportRef.current) return;
                                        const exportContainer = exportRef.current.querySelector('.export-container');
                                        if (exportContainer) {
                                            try {
                                                const canvas = await html2canvas(exportContainer, {
                                                    backgroundColor: '#ffffff',
                                                    scale: 3, // Ultra High resolution
                                                    logging: false,
                                                    useCORS: true,
                                                    onclone: (clonedDoc) => {
                                                        const clonedContainer = clonedDoc.querySelector('.export-container');
                                                        if (clonedContainer) {
                                                            clonedContainer.style.width = '1600px';
                                                            clonedContainer.style.position = 'absolute';
                                                            clonedContainer.style.left = '0';
                                                            clonedContainer.style.top = '0';
                                                        }
                                                    }
                                                });
                                                const link = document.createElement('a');
                                                link.download = `${block.meta.root.title || '架构矩阵'}.png`;
                                                link.href = canvas.toDataURL('image/png');
                                                link.click();
                                            } catch (err) {
                                                console.error('Export failed:', err);
                                                alert('导出失败，请重试');
                                            }
                                        }
                                    }}
                                    className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    <Download size={14} /> 导出图片
                                </button>
                                <button
                                    onClick={() => setIsFullScreen(true)}
                                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                    <Maximize size={14} /> 全屏编辑
                                </button>
                            </div>
                        </div>

                        <div className="p-4 max-h-[400px] overflow-hidden relative">
                            {/* Preview Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 pointer-events-none z-10"></div>

                            {/* Scaled Preview */}
                            <div className="transform scale-75 origin-top-left w-[133%]">
                                <ArchitectureMatrix
                                    data={block.meta.root}
                                    onChange={(newRoot) => onChange({ ...block, meta: { ...block.meta, root: newRoot } })}
                                    readOnly={true}
                                    compact={isCompact}
                                />
                            </div>
                        </div>

                        {/* Hidden Export Container */}
                        <div className="export-container absolute -left-[9999px] top-0 bg-white p-8 w-max">
                            <ArchitectureMatrix
                                data={block.meta.root}
                                onChange={() => { }}
                                readOnly={true}
                                compact={isCompact}
                            />
                        </div>

                        {/* Full Screen */}
                        {isFullScreen && (
                            <ZoomableCanvas onClose={() => setIsFullScreen(false)}>
                                <div className="min-w-[1000px] p-8 bg-white shadow-sm rounded">
                                    <ArchitectureMatrix
                                        data={block.meta.root}
                                        onChange={(newRoot) => onChange({ ...block, meta: { ...block.meta, root: newRoot } })}
                                        compact={isCompact}
                                    />
                                </div>
                            </ZoomableCanvas>
                        )}
                    </div>
                ) : block.type === 'flowchart' ? (
                    <div
                        className={`${contentClass} flex flex-col items-center bg-white border border-slate-200 p-4 min-h-[150px] relative group/flowchart`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {block.meta.previewUrl ? (
                            <img
                                src={block.meta.previewUrl}
                                alt="Flowchart Preview"
                                className="max-w-full max-h-[500px] object-contain"
                            />
                        ) : block.meta.code ? (
                            <MermaidDiagram code={block.meta.code} />
                        ) : (
                            <div className="text-center text-slate-400 py-8 pointer-events-none">
                                <Workflow size={48} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">空白流程图</p>
                                <p className="text-xs mt-1">点击编辑开始创建</p>
                            </div>
                        )}

                        {/* Edit Overlay */}
                        <div className={`absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center transition-opacity ${isSelected || isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <button
                                onClick={() => setIsDrawioOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                            >
                                <Edit size={16} />
                                编辑流程图 (Draw.io)
                            </button>
                        </div>

                        <DrawioEditor
                            isOpen={isDrawioOpen}
                            onClose={() => setIsDrawioOpen(false)}
                            initialXml={block.meta.xml}
                            onSave={(xml, previewUrl) => {
                                onChange({
                                    ...block,
                                    meta: {
                                        ...block.meta,
                                        xml,
                                        previewUrl,
                                        // Clear mermaid code if switching to draw.io to avoid confusion?
                                        // Or keep it? Let's keep it for now but prioritize previewUrl in render.
                                    }
                                });
                            }}
                        />
                    </div>
                ) : (
                    <div className={contentClass}>
                        {block.type !== 'heading' && (
                            <input
                                type="text"
                                value={block.number || ''}
                                onChange={(e) => {
                                    if (readOnly) return;
                                    onChange({ ...block, number: e.target.value });
                                }}
                                className="font-mono text-slate-400 mr-2 bg-transparent border-none outline-none text-right focus:text-slate-600 focus:bg-slate-100 rounded px-1 min-w-[2rem]"
                                style={{ width: `${Math.max(2, (block.number || '').length + 1)}ch` }}
                                placeholder="#"
                                readOnly={readOnly}
                            />
                        )}
                        <div
                            ref={contentRef}
                            contentEditable={!readOnly}
                            suppressContentEditableWarning
                            onBlur={handleContentChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !block.content) {
                                    e.preventDefault();
                                    // Only delete if empty
                                    onDelete(block.id);
                                }
                            }}
                            className="flex-1 outline-none"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple Mermaid Component
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
});

function MermaidDiagram({ code }) {
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (containerRef.current && code) {
            containerRef.current.innerHTML = '';
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            try {
                mermaid.render(id, code).then(({ svg }) => {
                    if (containerRef.current) {
                        containerRef.current.innerHTML = svg;
                    }
                });
            } catch (error) {
                console.error('Mermaid error:', error);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<div class="text-red-500 text-sm p-2">流程图语法错误</div>`;
                }
            }
        }
    }, [code]);

    return <div ref={containerRef} className="w-full flex justify-center" />;
}

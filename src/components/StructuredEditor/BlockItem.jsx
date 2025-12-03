import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    GripVertical, Image as ImageIcon, Workflow, GitGraph, Trash2,
    Maximize, Download, Maximize2, Minimize2
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DrawioEditor from '../DrawioEditor';
import ArchitectureMatrix from './ArchitectureMatrix';
import ZoomableCanvas from './ZoomableCanvas';
import html2canvas from 'html2canvas';



import { aiService } from '../../services/ai/AIService';

export default function BlockItem({ block, isSelected, cursorPos, onSelect, onChange, onDelete, onDuplicate, onInsertAfter, readOnly, onSplit, onMerge, onFocusPrev, onFocusNext, getContext }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDrawioOpen, setIsDrawioOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isCompact, setIsCompact] = useState(false);

    const [ghostText, setGhostText] = useState('');
    const menuButtonRef = useRef(null);
    const contentRef = useRef(null);
    const exportRef = useRef(null);
    const debounceTimer = useRef(null);
    const activeRequestRef = useRef(null); // To track active AI request ID

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
        zIndex: isDragging ? 100 : 'auto',
        position: 'relative',
        marginLeft: `${(block.indent || 0) * 24}px`, // Visual indentation
    };

    // Style Logic
    // Seamless flow: no bottom margin for text blocks to mimic continuous text
    let containerClass = "block-item group relative mb-0 transition-all duration-200";

    // Content style: minimal padding, transparent border by default
    // We use min-h-[24px] to ensure empty lines are clickable/visible
    let contentClass = "outline-none px-1 py-0.5 rounded-sm border border-transparent transition-colors min-h-[24px]";
    let sideBorder = null;

    if (isSelected) {
        // Very subtle selection background, similar to native text selection but for the block
        contentClass += " bg-blue-50/50";
    } else {
        // No hover background for text blocks to maintain "clean paper" look
        // Only add hover effect for complex blocks if needed
    }

    // Alignment
    const alignClass = block.meta?.align === 'center' ? 'text-center' : block.meta?.align === 'right' ? 'text-right' : 'text-left';
    contentClass += ` ${alignClass}`;

    if (block.type === 'heading') {
        contentClass += block.level === 1 ? " text-3xl font-bold mb-6 mt-4 text-slate-900" :
            block.level === 2 ? " text-2xl font-bold mt-5 mb-3 text-slate-800" :
                " text-xl font-bold mt-4 mb-2 text-slate-800";
    } else if (block.type === 'risk') {
        contentClass += " bg-red-50/50 text-slate-800 border-red-100 pl-10 relative";
        // sideBorder = <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l" />;
        // Add icon inside content
    } else if (block.type === 'rule') {
        contentClass += " bg-blue-50/50 text-slate-800 border-blue-100 pl-10 relative";
        // sideBorder = <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l" />;
    } else if (block.type === 'process_link') {
        contentClass += " bg-purple-50 text-purple-900 font-medium flex items-center gap-3 border border-purple-100 py-2 my-2 rounded";
    } else {
        // Standard text: ensure line-height matches standard document flow
        contentClass += " text-slate-700 leading-7 text-base";
    }



    useEffect(() => {
        if (isSelected && contentRef.current) {
            // Focus and place cursor based on cursorPos prop
            contentRef.current.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(contentRef.current);

            if (cursorPos === 'start') {
                range.collapse(true); // Collapse to start
            } else {
                range.collapse(false); // Collapse to end (default)
            }

            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, [isSelected, cursorPos]); // Re-run if selection or position preference changes

    // ... (content change handler)

    const handleContentChange = (e) => {
        if (readOnly) return;
        const newContent = e.target.innerHTML;
        // Remove ghost text span if present in saved content
        const cleanContent = newContent.replace(/<span data-ghost="true".*?<\/span>/g, '');

        if (cleanContent !== block.content) {
            onChange({ ...block, content: cleanContent });
        }
    };

    // ... (Partial Accept logic)
    const handleKeyDown = (e) => {
        // Arrow Left: Go to prev block end if at start
        if (e.key === 'ArrowLeft') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(contentRef.current);
                preCaretRange.setEnd(range.startContainer, range.startOffset);

                if (preCaretRange.toString().length === 0) {
                    e.preventDefault();
                    onFocusPrev(block.id);
                }
            }
        }

        // Arrow Right: Go to next block start if at end
        if (e.key === 'ArrowRight') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const postCaretRange = range.cloneRange();
                postCaretRange.selectNodeContents(contentRef.current);
                postCaretRange.setStart(range.endContainer, range.endOffset);

                if (postCaretRange.toString().length === 0) {
                    e.preventDefault();
                    onFocusNext(block.id);
                }
            }
        }

        // Arrow Up: Go to prev block end (or keep default if not at top line)
        if (e.key === 'ArrowUp') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // Check if we are visually at the top line. 
                // Simple approximation: if text before caret is empty, we are definitely at start.
                // For multi-line, this is harder. 
                // Strategy: Let browser handle within-block nav. Only jump if we are at start?
                // Or try to detect if browser DIDN'T move cursor (meaning we hit edge)?
                // Reliable way: Check if we are at start.

                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(contentRef.current);
                preCaretRange.setEnd(range.startContainer, range.startOffset);

                if (preCaretRange.toString().length === 0) {
                    e.preventDefault();
                    onFocusPrev(block.id);
                }
            }
        }

        // Arrow Down: Go to next block start
        if (e.key === 'ArrowDown') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const postCaretRange = range.cloneRange();
                postCaretRange.selectNodeContents(contentRef.current);
                postCaretRange.setStart(range.endContainer, range.endOffset);

                if (postCaretRange.toString().length === 0) {
                    e.preventDefault();
                    onFocusNext(block.id);
                }
            }
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
                        className={`absolute -left-8 top-2 p-1 text-slate-300 cursor-grab active:cursor-grabbing hover:bg-slate-100 hover:text-slate-600 rounded transition-all ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'}`}
                        {...attributes}
                        {...listeners}
                        onClick={(e) => {
                            // Important: dnd-kit might swallow click if drag is detected.
                            // We rely on PointerSensor constraints in parent to allow small movements as clicks.
                            e.stopPropagation();
                        }}
                    >
                        <GripVertical size={18} />
                    </div>


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
                        {block.type === 'risk' && (
                            <div className="absolute left-3 top-2.5 text-red-500 select-none" contentEditable={false}>
                                <AlertTriangle size={18} />
                            </div>
                        )}
                        {block.type === 'rule' && (
                            <div className="absolute left-3 top-2.5 text-blue-500 select-none" contentEditable={false}>
                                <Shield size={18} />
                            </div>
                        )}
                        {block.type !== 'heading' && block.type !== 'risk' && block.type !== 'rule' && (
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
                            onKeyDown={handleKeyDown}
                            className="flex-1 outline-none"
                            dangerouslySetInnerHTML={{ __html: block.content + (ghostText && isSelected ? `<span data-ghost="true" class="text-gray-400 pointer-events-none select-none">${ghostText}</span>` : '') }}
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

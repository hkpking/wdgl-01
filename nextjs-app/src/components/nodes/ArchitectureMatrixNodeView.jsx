import React, { useState, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Maximize, Download, Maximize2, Minimize2 } from 'lucide-react';
import ArchitectureMatrix from '../StructuredEditor/ArchitectureMatrix';
import ZoomableCanvas from '../StructuredEditor/ZoomableCanvas';
import html2canvas from 'html2canvas';

export default function ArchitectureMatrixNodeView({ node, updateAttributes, editor }) {
    const [isCompact, setIsCompact] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const exportRef = useRef(null);
    const readOnly = !editor.isEditable;

    const root = node.attrs.root || {
        id: 'root',
        title: '13.0 管理业务变革与信息技术',
        type: 'root',
        layout: 'col',
        children: [
            {
                id: 'c1',
                title: '战略&IT规划管理',
                type: 'container',
                layout: 'row',
                children: [
                    { id: 'i1', title: '业务战略', type: 'card' },
                    { id: 'i2', title: '变革战略', type: 'card' },
                    { id: 'i3', title: '架构规划(4A)', type: 'card' }
                ]
            },
            {
                id: 'c2',
                title: '业务变革管理',
                type: 'container',
                layout: 'row',
                children: [
                    { id: 'i4', title: '管理业务变革项目', type: 'card' },
                    { id: 'i5', title: '业务变革运作', type: 'card' }
                ]
            }
        ]
    };

    const handleChange = (newRoot) => {
        updateAttributes({ root: newRoot });
    };

    return (
        <NodeViewWrapper className="block-item group relative mb-0.5 transition-all duration-200">
            <div className="relative pl-3" ref={exportRef}>
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
                                            link.download = `${root.title || '架构矩阵'}.png`;
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
                                data={root}
                                onChange={handleChange}
                                readOnly={true}
                                compact={isCompact}
                            />
                        </div>
                    </div>

                    {/* Hidden Export Container */}
                    <div className="export-container absolute -left-[9999px] top-0 bg-white p-8 w-max">
                        <ArchitectureMatrix
                            data={root}
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
                                    data={root}
                                    onChange={handleChange}
                                    compact={isCompact}
                                />
                            </div>
                        </ZoomableCanvas>
                    )}
                </div>
            </div>
        </NodeViewWrapper>
    );
}

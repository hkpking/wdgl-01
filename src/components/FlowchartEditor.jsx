import React, { useEffect, useRef, useState } from 'react';
import { Graph, Shape } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';
import { X, Save, ZoomIn, ZoomOut, RotateCcw, Trash2 } from 'lucide-react';

export default function FlowchartEditor({ isOpen, onClose, initialData, onSave }) {
    const containerRef = useRef(null);
    const stencilContainerRef = useRef(null);
    const graphRef = useRef(null);
    const stencilRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !containerRef.current || !stencilContainerRef.current) return;

        // Initialize Graph
        const graph = new Graph({
            container: containerRef.current,
            grid: true,
            mousewheel: {
                enabled: true,
                zoomAtMousePosition: true,
                modifiers: 'ctrl',
                minScale: 0.5,
                maxScale: 3,
            },
            connecting: {
                router: 'manhattan',
                connector: {
                    name: 'rounded',
                    args: {
                        radius: 8,
                    },
                },
                anchor: 'center',
                connectionPoint: 'anchor',
                allowBlank: false,
                snap: {
                    radius: 20,
                },
                createEdge() {
                    return new Shape.Edge({
                        attrs: {
                            line: {
                                stroke: '#A2B1C3',
                                strokeWidth: 2,
                                targetMarker: {
                                    name: 'block',
                                    width: 12,
                                    height: 8,
                                },
                            },
                        },
                        zIndex: 0,
                    });
                },
                validateConnection({ targetMagnet }) {
                    return !!targetMagnet;
                },
            },
            highlighting: {
                magnetAdsorbed: {
                    name: 'stroke',
                    args: {
                        attrs: {
                            fill: '#5F95FF',
                            stroke: '#5F95FF',
                        },
                    },
                },
            },
            resizing: true,
            rotating: true,
            selecting: {
                enabled: true,
                rubberband: true,
                showNodeSelectionBox: true,
            },
            snapline: true,
            keyboard: true,
            clipboard: true,
        });

        graphRef.current = graph;

        // Initialize Stencil
        const stencil = new Stencil({
            title: '图形库',
            target: graph,
            stencilGraphWidth: 200,
            stencilGraphHeight: 180,
            collapsable: true,
            groups: [
                {
                    title: '基础图形',
                    name: 'basic',
                },
                {
                    title: '流程图',
                    name: 'flowchart',
                    graphHeight: 250,
                    layoutOptions: {
                        columns: 2,
                        columnWidth: 80,
                        rowHeight: 55,
                    },
                },
            ],
            layoutOptions: {
                columns: 2,
                columnWidth: 80,
                rowHeight: 55,
            },
        });

        stencilRef.current = stencil;
        stencilContainerRef.current.appendChild(stencil.container);

        // Define Shapes
        const commonAttrs = {
            body: {
                fill: '#FFFFFF',
                stroke: '#5F95FF',
                strokeWidth: 1,
            },
            label: {
                text: 'Text',
                fill: '#333',
            },
        };

        const r1 = graph.createNode({
            shape: 'rect',
            width: 60,
            height: 40,
            attrs: {
                ...commonAttrs,
                label: { text: '矩形' },
            },
        });

        const c1 = graph.createNode({
            shape: 'circle',
            width: 50,
            height: 50,
            attrs: {
                ...commonAttrs,
                label: { text: '圆形' },
            },
        });

        const e1 = graph.createNode({
            shape: 'ellipse',
            width: 70,
            height: 40,
            attrs: {
                ...commonAttrs,
                label: { text: '椭圆' },
            },
        });

        const t1 = graph.createNode({
            shape: 'text-block',
            width: 60,
            height: 30,
            text: '文本',
            attrs: {
                body: { fill: 'none', stroke: 'none' },
                label: { fill: '#333' },
            },
        });

        // Flowchart Shapes
        const start = graph.createNode({
            shape: 'rect',
            width: 70,
            height: 40,
            attrs: {
                ...commonAttrs,
                body: { ...commonAttrs.body, rx: 20, ry: 20 },
                label: { text: '开始/结束' },
            },
        });

        const process = graph.createNode({
            shape: 'rect',
            width: 70,
            height: 40,
            attrs: {
                ...commonAttrs,
                label: { text: '过程' },
            },
        });

        const decision = graph.createNode({
            shape: 'polygon',
            width: 60,
            height: 60,
            points: '30,0 60,30 30,60 0,30',
            attrs: {
                ...commonAttrs,
                label: { text: '判断' },
            },
        });

        const data = graph.createNode({
            shape: 'polygon',
            width: 70,
            height: 40,
            points: '10,0 70,0 60,40 0,40',
            attrs: {
                ...commonAttrs,
                label: { text: '数据' },
            },
        });

        const document = graph.createNode({
            shape: 'path',
            width: 60,
            height: 50,
            path: 'M 0 0 L 60 0 L 60 40 Q 45 50 30 40 Q 15 30 0 40 Z',
            attrs: {
                ...commonAttrs,
                label: { text: '文档', refY: 0.4 },
            },
        });

        const database = graph.createNode({
            shape: 'path',
            width: 60,
            height: 50,
            path: 'M 0 10 Q 0 0 30 0 Q 60 0 60 10 L 60 40 Q 60 50 30 50 Q 0 50 0 40 Z M 0 10 Q 0 20 30 20 Q 60 20 60 10',
            attrs: {
                ...commonAttrs,
                label: { text: '数据库', refY: 0.5 },
            },
        });

        stencil.load([r1, c1, e1, t1], 'basic');
        stencil.load([start, process, decision, data, document, database], 'flowchart');

        // Load Data
        if (initialData && initialData.cells) {
            graph.fromJSON(initialData);
        }

        // Cleanup
        return () => {
            graph.dispose();
        };
    }, [isOpen]);

    const handleSave = () => {
        if (graphRef.current) {
            const data = graphRef.current.toJSON();
            onSave(data);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">流程图编辑器 (AntV X6)</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            <Save size={18} />
                            保存
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="border-b border-gray-200 p-2 flex gap-2 bg-gray-50">
                    <button onClick={() => graphRef.current?.zoom(0.1)} title="放大" className="p-1 hover:bg-gray-200 rounded"><ZoomIn size={18} /></button>
                    <button onClick={() => graphRef.current?.zoom(-0.1)} title="缩小" className="p-1 hover:bg-gray-200 rounded"><ZoomOut size={18} /></button>
                    <button onClick={() => graphRef.current?.zoomToFit({ padding: 20 })} title="适应画布" className="p-1 hover:bg-gray-200 rounded"><RotateCcw size={18} /></button>
                    <div className="w-px bg-gray-300 mx-1"></div>
                    <button onClick={() => {
                        const cells = graphRef.current?.getSelectedCells();
                        if (cells?.length) graphRef.current?.removeCells(cells);
                    }} title="删除选中" className="p-1 hover:bg-gray-200 rounded text-red-500"><Trash2 size={18} /></button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar (Stencil) */}
                    <div className="w-60 border-r border-gray-200 bg-gray-50 relative" ref={stencilContainerRef}>
                        {/* Stencil will be rendered here */}
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 relative bg-gray-100" ref={containerRef}>
                        {/* Graph will be rendered here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

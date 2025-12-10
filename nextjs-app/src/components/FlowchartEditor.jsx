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
            grid: {
                size: 10,
                visible: true,
                type: 'doubleMesh',
                args: [
                    { color: '#eee', thickness: 1 },
                    { color: '#ddd', thickness: 1, factor: 4 },
                ],
            },
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
                                stroke: '#5F95FF',
                                strokeWidth: 1.5,
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
            stencilGraphWidth: 220,
            stencilGraphHeight: 180,
            collapsable: true,
            groups: [
                {
                    title: '基础图形',
                    name: 'basic',
                    layoutOptions: { columns: 3, columnWidth: 65, rowHeight: 50 },
                },
                {
                    title: '流程图',
                    name: 'flowchart',
                    layoutOptions: { columns: 2, columnWidth: 90, rowHeight: 60 },
                },
                {
                    title: '箭头',
                    name: 'arrows',
                    layoutOptions: { columns: 3, columnWidth: 65, rowHeight: 50 },
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
                stroke: '#333333',
                strokeWidth: 1.5,
            },
            label: {
                text: '',
                fill: '#333',
                fontSize: 12,
            },
        };

        // --- Basic Shapes ---
        const text = graph.createNode({
            shape: 'text-block',
            width: 50,
            height: 30,
            text: '文本',
            attrs: {
                body: { fill: 'none', stroke: 'none' },
                label: { fill: '#333', fontSize: 14 },
            },
        });

        const rect = graph.createNode({
            shape: 'rect',
            width: 50,
            height: 40,
            attrs: commonAttrs,
        });

        const roundedRect = graph.createNode({
            shape: 'rect',
            width: 50,
            height: 40,
            attrs: {
                ...commonAttrs,
                body: { ...commonAttrs.body, rx: 5, ry: 5 },
            },
        });

        const circle = graph.createNode({
            shape: 'circle',
            width: 40,
            height: 40,
            attrs: commonAttrs,
        });

        const ellipse = graph.createNode({
            shape: 'ellipse',
            width: 50,
            height: 35,
            attrs: commonAttrs,
        });

        const triangle = graph.createNode({
            shape: 'polygon',
            width: 40,
            height: 40,
            points: '20,0 40,40 0,40',
            attrs: commonAttrs,
        });

        const rhombus = graph.createNode({
            shape: 'polygon',
            width: 40,
            height: 40,
            points: '20,0 40,20 20,40 0,20',
            attrs: commonAttrs,
        });

        const pentagon = graph.createNode({
            shape: 'polygon',
            width: 40,
            height: 40,
            points: '20,0 40,15 32,40 8,40 0,15',
            attrs: commonAttrs,
        });

        const hexagon = graph.createNode({
            shape: 'polygon',
            width: 40,
            height: 40,
            points: '10,0 30,0 40,20 30,40 10,40 0,20',
            attrs: commonAttrs,
        });

        const cloud = graph.createNode({
            shape: 'path',
            width: 50,
            height: 40,
            path: 'M 12.5 20 C 6.25 20 1.25 15 1.25 10 C 1.25 5 6.25 0 12.5 0 C 15 0 17.5 1.25 18.75 3.75 C 21.25 1.25 25 0 28.75 0 C 35 0 40 5 40 11.25 C 40 11.875 39.375 12.5 39.375 13.125 C 45 13.75 48.75 18.125 48.75 23.75 C 48.75 29.375 44.375 33.75 38.75 33.75 L 11.25 33.75 C 5 33.75 0 28.75 0 22.5 C 0 21.25 0.625 20 1.25 18.75 C 3.75 19.375 7.5 20 12.5 20 Z',
            attrs: commonAttrs,
        });

        // --- Flowchart Shapes ---
        const startEnd = graph.createNode({
            shape: 'rect',
            width: 80,
            height: 40,
            attrs: {
                ...commonAttrs,
                body: { ...commonAttrs.body, rx: 20, ry: 20 },
                label: { text: '开始/结束' },
            },
        });

        const process = graph.createNode({
            shape: 'rect',
            width: 80,
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
            width: 80,
            height: 40,
            points: '10,0 80,0 70,40 0,40',
            attrs: {
                ...commonAttrs,
                label: { text: '数据' },
            },
        });

        const document = graph.createNode({
            shape: 'path',
            width: 70,
            height: 50,
            path: 'M 0 0 L 70 0 L 70 40 Q 52.5 50 35 40 Q 17.5 30 0 40 Z',
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

        const manualInput = graph.createNode({
            shape: 'polygon',
            width: 80,
            height: 40,
            points: '0,10 80,0 80,40 0,40',
            attrs: {
                ...commonAttrs,
                label: { text: '手动输入' },
            },
        });

        const display = graph.createNode({
            shape: 'path',
            width: 80,
            height: 40,
            path: 'M 0 20 L 15 0 L 80 0 Q 70 20 80 40 L 15 40 Z',
            attrs: {
                ...commonAttrs,
                label: { text: '展示' },
            },
        });

        const delay = graph.createNode({
            shape: 'path',
            width: 80,
            height: 40,
            path: 'M 0 0 L 65 0 Q 80 20 65 40 L 0 40 Z',
            attrs: {
                ...commonAttrs,
                label: { text: '延时' },
            },
        });

        // --- Arrows ---
        const arrowLeft = graph.createNode({
            shape: 'path',
            width: 50,
            height: 30,
            path: 'M 20 0 L 20 10 L 50 10 L 50 20 L 20 20 L 20 30 L 0 15 Z',
            attrs: commonAttrs,
        });

        const arrowRight = graph.createNode({
            shape: 'path',
            width: 50,
            height: 30,
            path: 'M 0 10 L 30 10 L 30 0 L 50 15 L 30 30 L 30 20 L 0 20 Z',
            attrs: commonAttrs,
        });

        const arrowUp = graph.createNode({
            shape: 'path',
            width: 30,
            height: 50,
            path: 'M 10 50 L 10 20 L 0 20 L 15 0 L 30 20 L 20 20 L 20 50 Z',
            attrs: commonAttrs,
        });

        const arrowDown = graph.createNode({
            shape: 'path',
            width: 30,
            height: 50,
            path: 'M 10 0 L 20 0 L 20 30 L 30 30 L 15 50 L 0 30 L 10 30 Z',
            attrs: commonAttrs,
        });

        stencil.load([text, rect, roundedRect, circle, ellipse, triangle, rhombus, pentagon, hexagon, cloud], 'basic');
        stencil.load([startEnd, process, decision, data, document, database, manualInput, display, delay], 'flowchart');
        stencil.load([arrowLeft, arrowRight, arrowUp, arrowDown], 'arrows');

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
            <div className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                            <RotateCcw size={20} className="rotate-90" />
                        </span>
                        <h2 className="text-lg font-bold text-gray-800">流程图编辑器</h2>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            <Save size={18} />
                            保存更改
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="border-b border-gray-200 p-2 flex gap-1 bg-white items-center">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button onClick={() => graphRef.current?.zoom(0.1)} title="放大" className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ZoomIn size={18} /></button>
                        <button onClick={() => graphRef.current?.zoom(-0.1)} title="缩小" className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ZoomOut size={18} /></button>
                        <button onClick={() => graphRef.current?.zoomToFit({ padding: 20 })} title="适应画布" className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><RotateCcw size={18} /></button>
                    </div>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button onClick={() => {
                        const cells = graphRef.current?.getSelectedCells();
                        if (cells?.length) graphRef.current?.removeCells(cells);
                    }} title="删除选中" className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"><Trash2 size={18} /></button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar (Stencil) */}
                    <div className="w-64 border-r border-gray-200 bg-white relative flex flex-col" ref={stencilContainerRef}>
                        {/* Stencil will be rendered here */}
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 relative bg-gray-50" ref={containerRef}>
                        {/* Graph will be rendered here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect, useCallback, useRef, useImperativeHandle } from 'react';
import { Layout, AlertTriangle, Shield, GitGraph, Plus, Image as ImageIcon, Table as TableIcon, Workflow, Undo, Redo } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import BlockItem from './BlockItem';
import EditorToolbar from './EditorToolbar';

const StructuredEditor = React.forwardRef(({ blocks, onChange, readOnly, currentUser, docId }, ref) => {
    const [selectedId, setSelectedId] = useState(null);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const rightSidebarRef = useRef(null);

    const [activeTab, setActiveTab] = useState('properties');
    const [internalBlocks, setInternalBlocks] = useState(blocks || []);

    // History State
    const [history, setHistory] = useState([blocks || []]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => {
        if (blocks && blocks !== internalBlocks && historyIndex === 0 && history.length === 1) {
            setInternalBlocks(blocks);
            setHistory([blocks]);
        }
    }, [blocks]);

    const addToHistory = (newBlocks) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newBlocks);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setInternalBlocks(newBlocks);
        onChange(newBlocks);
    };

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInternalBlocks(history[newIndex]);
            onChange(history[newIndex]);
        }
    }, [historyIndex, history, onChange]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInternalBlocks(history[newIndex]);
            onChange(history[newIndex]);
        }
    }, [historyIndex, history, onChange]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        addBlock: (type, meta) => {
            // Use the internal addBlock function
            addBlock(type, meta);
        },
        openAITab: () => {
            setRightSidebarOpen(true);
            setActiveTab('ai');
        }
    }));

    const handleBlockChange = (updatedBlock) => {
        // Standardized Auto-Hierarchy Logic
        if (updatedBlock.number) {
            const dotCount = (updatedBlock.number.match(/\./g) || []).length;
            updatedBlock = { ...updatedBlock, indent: dotCount };
        }

        const newBlocks = internalBlocks.map(b =>
            b.id === updatedBlock.id ? updatedBlock : b
        );
        addToHistory(newBlocks);
    };

    const addBlock = (type, initialMeta = {}, afterId = null) => {
        const newBlock = {
            id: `NEW-${Math.floor(Math.random() * 10000)}`,
            type: type,
            number: '',
            content: type === 'process_link' ? '点击关联流程...' : (type === 'image' || type === 'table' || type === 'flowchart' || type === 'process_card' || type === 'architecture_matrix' ? '' : '新插入的条款内容...'),
            meta: type === 'image' ? { src: '', caption: '请输入图片说明', ...initialMeta } :
                type === 'table' ? { rows: 3, cols: 3, data: [['', '', ''], ['', '', ''], ['', '', '']], ...initialMeta } :
                    type === 'flowchart' ? { xml: null, previewUrl: null, code: '', ...initialMeta } :
                        type === 'process_card' ? {
                            fields: {
                                name: '', level: '', code: '',
                                definition: '', purpose: '',
                                owner: '', parent: '',
                                children: '', input: '',
                                output: '', start: '',
                                end: '', kpi: ''
                            },
                            ...initialMeta
                        } : type === 'architecture_matrix' ? {
                            root: {
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
                            },
                            ...initialMeta
                        } : { ...initialMeta }
        };

        // Insert logic
        let newBlocks;
        const targetId = afterId || selectedId;

        if (targetId) {
            const index = internalBlocks.findIndex(b => b.id === targetId);
            if (index !== -1) {
                newBlocks = [
                    ...internalBlocks.slice(0, index + 1),
                    newBlock,
                    ...internalBlocks.slice(index + 1)
                ];
            } else {
                newBlocks = [...internalBlocks, newBlock];
            }
        } else {
            newBlocks = [...internalBlocks, newBlock];
        }

        addToHistory(newBlocks);
        setSelectedId(newBlock.id);
    };

    const duplicateBlock = (id) => {
        const blockToDuplicate = internalBlocks.find(b => b.id === id);
        if (!blockToDuplicate) return;

        const newBlock = {
            ...blockToDuplicate,
            id: `NEW-${Math.floor(Math.random() * 10000)}`,
            meta: JSON.parse(JSON.stringify(blockToDuplicate.meta || {}))
        };

        const index = internalBlocks.findIndex(b => b.id === id);
        const newBlocks = [
            ...internalBlocks.slice(0, index + 1),
            newBlock,
            ...internalBlocks.slice(index + 1)
        ];

        addToHistory(newBlocks);
        setSelectedId(newBlock.id);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px movement required to start drag, allowing clicks to pass through
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = internalBlocks.findIndex((block) => block.id === active.id);
            const newIndex = internalBlocks.findIndex((block) => block.id === over.id);

            const newBlocks = arrayMove(internalBlocks, oldIndex, newIndex);
            addToHistory(newBlocks);
        }
    };

    const deleteBlock = (id) => {
        if (internalBlocks.length <= 1) {
            alert('文档至少需要保留一个内容块');
            return;
        }
        const newBlocks = internalBlocks.filter(b => b.id !== id);
        addToHistory(newBlocks);
        if (selectedId === id) {
            setSelectedId(null);
        }
    };

    const selectedBlock = internalBlocks.find(b => b.id === selectedId);
    const [showPageGuides, setShowPageGuides] = useState(false);

    const handleBackgroundClick = (e) => {
        if (readOnly) return;

        // Ignore clicks on blocks (bubbled up)
        if (e.target.closest('.block-item')) return;

        // If clicking on the scrollbar or something else interactive, ignore
        // (Browser scrollbars are usually not elements, but let's be safe)

        const lastBlock = internalBlocks[internalBlocks.length - 1];
        if (lastBlock) {
            // If last block is an empty text block, focus it
            if ((lastBlock.type === 'clause' || lastBlock.type === 'paragraph') && !lastBlock.content) {
                setSelectedId(lastBlock.id);
            } else {
                // Otherwise append new block
                addBlock('clause');
            }
        } else {
            addBlock('clause');
        }
    };

    return (
        <div className="flex h-full w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">

            {/* Left Sidebar */}
            <LeftSidebar
                blocks={internalBlocks}
                selectedId={selectedId}
                onSelect={setSelectedId}
                isOpen={leftSidebarOpen}
                onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 transition-all duration-300">
                {/* Toolbar */}
                {!readOnly && (
                    <EditorToolbar onInsertBlock={addBlock} />
                )}

                {/* Editor Area */}
                <div
                    className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100/50"
                    onClick={handleBackgroundClick}
                >
                    <div className="flex flex-col items-center min-h-full">
                        <div
                            className={`bg-white shadow-sm transition-all duration-300 relative h-fit ${showPageGuides ? 'w-[794px]' : 'w-full max-w-5xl'}`}
                            style={showPageGuides ? {
                                minHeight: '1123px',
                                // Continuous sheet with dashed page lines every 1123px (A4 height)
                                backgroundImage: 'linear-gradient(to bottom, transparent 1122px, #94a3b8 1122px, #94a3b8 1123px)',
                                backgroundSize: '100% 1123px',
                                padding: '40px 40px', // Approx 2.54cm margins
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                            } : {
                                minHeight: '800px',
                                padding: '48px'
                            }}
                        >
                            {showPageGuides && (
                                <div className="absolute top-2 right-[-120px] text-xs text-slate-400 font-mono select-none w-24">
                                    <p>A4 打印视图</p>
                                    <p className="text-[10px] opacity-70 mt-1">虚线为分页位置</p>
                                </div>
                            )}

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={internalBlocks.map(b => b.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {internalBlocks.map((block) => (
                                        <BlockItem
                                            key={block.id}
                                            block={block}
                                            isSelected={selectedId === block.id}
                                            onSelect={() => setSelectedId(block.id)}
                                            onChange={handleBlockChange}
                                            onDelete={deleteBlock}
                                            onDuplicate={duplicateBlock}
                                            onInsertAfter={(type) => addBlock(type || 'clause', {}, block.id)}
                                            readOnly={readOnly}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>

                            {internalBlocks.length === 0 && (
                                <div className="text-center text-slate-400 py-20">
                                    文档为空，请点击上方工具栏添加内容
                                </div>
                            )}

                            {/* Bottom padding for comfortable typing */}
                            <div className="h-32"></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Sidebar */}
            <RightSidebar
                block={selectedBlock}
                onChange={handleBlockChange}
                readOnly={readOnly}
                isOpen={rightSidebarOpen}
                onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                currentUser={currentUser}
                docId={docId}
            />
        </div>
    );
});

export default StructuredEditor;

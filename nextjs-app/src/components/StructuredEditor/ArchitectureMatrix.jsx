import React, { useState } from 'react';
import {
    Plus, Trash2, Layout, Grid, ChevronDown, ChevronRight,
    GripVertical, X
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Node Component
const SortableProcessNode = ({ node, path, onUpdate, onDelete, onAdd, readOnly, level = 0, compact = false }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: node.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex-auto min-w-[150px] max-w-full">
            <ProcessNode
                node={node}
                path={path}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAdd={onAdd}
                readOnly={readOnly}
                level={level}
                compact={compact}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
};

// Recursive Node Component
const ProcessNode = ({ node, path, onUpdate, onDelete, onAdd, readOnly, level = 0, compact = false, dragHandleProps }) => {
    // Styles based on type and level
    const isContainer = node.type === 'container' || node.type === 'root';

    // Level-based styling (8 Levels)
    const getLevelStyle = (lvl) => {
        const colors = [
            'bg-slate-200 border-slate-500',      // Level 0 (Root)
            'bg-blue-200 border-blue-500',        // Level 1
            'bg-emerald-200 border-emerald-500',  // Level 2
            'bg-amber-200 border-amber-500',      // Level 3
            'bg-purple-200 border-purple-500',    // Level 4
            'bg-rose-200 border-rose-500',        // Level 5
            'bg-cyan-200 border-cyan-500',        // Level 6
            'bg-indigo-200 border-indigo-500'     // Level 7+
        ];
        return colors[Math.min(lvl, colors.length - 1)];
    };

    // Container Style
    const levelStyle = getLevelStyle(level);
    const paddingClass = compact ? 'p-1.5' : 'p-4';
    const containerStyle = `${levelStyle} border-2 border-dashed rounded-lg ${paddingClass} relative transition-all ${node.collapsed ? 'h-auto' : 'h-full'} w-full`;

    // Card Style (Yellow Box)
    const cardStyle = "bg-yellow-50 border border-yellow-200 shadow-sm rounded-md p-3 relative hover:shadow-md transition-all";

    // Handle Layout Toggle
    const toggleLayout = () => {
        onUpdate(path, { ...node, layout: node.layout === 'row' ? 'col' : 'row' });
    };

    // Handle Collapse Toggle
    const toggleCollapse = () => {
        onUpdate(path, { ...node, collapsed: !node.collapsed });
    };

    if (isContainer) {
        return (
            <div
                className={`flex flex-col gap-2 ${containerStyle} group/container`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 flex-1">
                        {!readOnly && (
                            <div {...dragHandleProps} className="cursor-grab text-slate-400 hover:text-slate-600">
                                <GripVertical size={14} />
                            </div>
                        )}
                        <button onClick={toggleCollapse} className="text-slate-500 hover:text-slate-700">
                            {node.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <input
                            value={node.title}
                            onChange={(e) => onUpdate(path, { ...node, title: e.target.value })}
                            className={`bg-transparent font-bold text-slate-700 outline-none w-full ${compact ? 'text-sm' : 'text-base'}`}
                            readOnly={readOnly}
                        />
                    </div>

                    {!readOnly && (
                        <div className="flex gap-1 opacity-0 group-hover/container:opacity-100 transition-opacity">
                            <button onClick={toggleLayout} className="p-1 hover:bg-black/5 rounded text-slate-600" title={node.layout === 'row' ? "切换为纵向" : "切换为横向"}>
                                {node.layout === 'row' ? <Layout size={14} className="rotate-90" /> : <Layout size={14} />}
                            </button>
                            <button onClick={() => onDelete(path)} className="p-1 hover:bg-red-100 rounded text-red-500">
                                <Trash2 size={14} />
                            </button>
                            <button onClick={() => onAdd(path, 'container')} className="p-1 hover:bg-blue-100 rounded text-blue-500" title="添加子分组">
                                <Grid size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Children Area */}
                {!node.collapsed && (
                    <SortableContext
                        items={node.children?.map(c => c.id) || []}
                        strategy={node.layout === 'row' ? rectSortingStrategy : verticalListSortingStrategy}
                    >
                        <div className={`flex ${node.layout === 'row' ? 'flex-row flex-wrap' : 'flex-col'} gap-4 ${compact ? 'gap-2' : 'gap-4'}`}>
                            {node.children && node.children.map((child, index) => (
                                <SortableProcessNode
                                    key={child.id}
                                    node={child}
                                    path={[...path, index]}
                                    onUpdate={onUpdate}
                                    onDelete={onDelete}
                                    onAdd={onAdd}
                                    readOnly={readOnly}
                                    level={level + 1}
                                    compact={compact}
                                />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        );
    }

    // Leaf Node (Card)
    return (
        <div
            className={`${cardStyle} group/card h-full`}
        >
            <div className="flex items-start gap-2">
                {!readOnly && (
                    <div {...dragHandleProps} className="cursor-grab text-slate-300 hover:text-slate-500 mt-1">
                        <GripVertical size={12} />
                    </div>
                )}
                <textarea
                    value={node.title}
                    onChange={(e) => onUpdate(path, { ...node, title: e.target.value })}
                    className={`bg-transparent w-full resize-none outline-none text-slate-700 text-center ${compact ? 'text-xs' : 'text-sm'}`}
                    rows={compact ? 1 : 2}
                    readOnly={readOnly}
                />
            </div>

            {!readOnly && (
                <button
                    onClick={() => onDelete(path)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-50"
                >
                    <X size={12} />
                </button>
            )}
        </div>
    );
};

export default function ArchitectureMatrix({ data, onChange, readOnly, compact = false }) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Helper to update node at path
    const updateNode = (path, newNode) => {
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;

        // If updating root
        if (path.length === 0) {
            onChange(newNode);
            return;
        }

        // Navigate to parent
        for (let i = 0; i < path.length - 1; i++) {
            current = current.children[path[i]];
        }
        current.children[path[path.length - 1]] = newNode;
        onChange(newData);
    };

    // Helper to delete node at path
    const deleteNode = (path) => {
        if (path.length === 0) return;
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < path.length - 1; i++) {
            current = current.children[path[i]];
        }
        current.children.splice(path[path.length - 1], 1);
        onChange(newData);
    };

    // Helper to add child to node at path
    const addChild = (path, type) => {
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        // If path points to a child, we add to THAT child. 
        // But wait, the button is on the container header, so path points to the container itself.
        for (let i = 0; i < path.length; i++) {
            current = current.children[path[i]];
        }

        if (!current.children) current.children = [];

        const newId = `node-${Math.floor(Math.random() * 100000)}`;
        const newNode = {
            id: newId,
            title: type === 'container' ? '新分组' : '新流程',
            type: type,
            layout: 'row',
            children: []
        };

        current.children.push(newNode);
        onChange(newData);
    };

    // Handle Drag End
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        // Find paths for active and over nodes
        // This is tricky with recursive structure. 
        // We need a helper to find parent and index of a node ID.
        const findNodeParent = (root, id, path = []) => {
            if (root.children) {
                for (let i = 0; i < root.children.length; i++) {
                    if (root.children[i].id === id) return { parent: root, index: i, path: [...path, i] };
                    const result = findNodeParent(root.children[i], id, [...path, i]);
                    if (result) return result;
                }
            }
            return null;
        };

        const newData = JSON.parse(JSON.stringify(data));
        const activeInfo = findNodeParent(newData, active.id);
        const overInfo = findNodeParent(newData, over.id);

        if (activeInfo && overInfo && activeInfo.parent === overInfo.parent) {
            // Sorting within same container
            activeInfo.parent.children = arrayMove(activeInfo.parent.children, activeInfo.index, overInfo.index);
            onChange(newData);
        }
    };

    if (!data) return <div className="text-red-500">数据错误</div>;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="overflow-x-auto p-1">
                <ProcessNode
                    node={data}
                    path={[]}
                    onUpdate={updateNode}
                    onDelete={deleteNode}
                    onAdd={addChild}
                    readOnly={readOnly}
                    compact={compact}
                />
            </div>
        </DndContext>
    );
}

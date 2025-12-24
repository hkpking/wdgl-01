/**
 * DragDropWrappers - 拖拽相关组件
 * 
 * 从 FolderTree.jsx 拆分
 */

import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

export const DraggableWrapper = ({ id, type, itemId, children, disabled = false }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { type, id: itemId },
        disabled
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
};

export const DroppableFolder = ({ id, children, isOver }) => {
    const { setNodeRef } = useDroppable({ id, data: { type: 'folder', id } });

    return (
        <div ref={setNodeRef} className={isOver ? 'bg-blue-50 ring-2 ring-blue-300 rounded' : ''}>
            {children}
        </div>
    );
};

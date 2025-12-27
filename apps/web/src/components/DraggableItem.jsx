import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableItem({ id, data, children, className = '' }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : undefined,
        position: isDragging ? 'relative' : undefined,
        touchAction: 'none', // Important for touch devices
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`${className} ${isDragging ? 'shadow-xl ring-2 ring-blue-500 rounded-lg' : ''}`}
        >
            {children}
        </div>
    );
}

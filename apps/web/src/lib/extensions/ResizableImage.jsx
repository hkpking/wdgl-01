import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export default function ResizableImage({ node, updateAttributes, selected }) {
    const [width, setWidth] = useState(node.attrs.width || '100%');
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef(null);

    useEffect(() => {
        setWidth(node.attrs.width || '100%');
    }, [node.attrs.width]);

    const handleMouseDown = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const startWidth = imageRef.current ? imageRef.current.offsetWidth : 0;

        const handleMouseMove = (e) => {
            const currentX = e.clientX;
            const diffX = currentX - startX;
            let newWidth;

            if (direction === 'se' || direction === 'ne') {
                // Dragging right increases width
                newWidth = startWidth + diffX;
            } else {
                // Dragging left increases width (sw, nw)
                newWidth = startWidth - diffX;
            }

            // Limit minimum width
            if (newWidth > 50) {
                setWidth(`${newWidth}px`);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            if (imageRef.current) {
                updateAttributes({ width: `${imageRef.current.offsetWidth}px` });
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <NodeViewWrapper className="resizable-image-wrapper inline-block relative group leading-none">
            <div className={`relative inline-block ${selected ? 'ring-2 ring-blue-500' : ''}`}>
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    title={node.attrs.title}
                    style={{ width: width, maxWidth: '100%', height: 'auto', display: 'block' }}
                    className="transition-shadow"
                />

                {selected && (
                    <>
                        {/* Top Left */}
                        <div
                            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white cursor-nwse-resize z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'nw')}
                        />
                        {/* Top Right */}
                        <div
                            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white cursor-nesw-resize z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'ne')}
                        />
                        {/* Bottom Left */}
                        <div
                            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white cursor-nesw-resize z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'sw')}
                        />
                        {/* Bottom Right */}
                        <div
                            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white cursor-nwse-resize z-10"
                            onMouseDown={(e) => handleMouseDown(e, 'se')}
                        />
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}

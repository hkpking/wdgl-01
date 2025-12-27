import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

export default function ZoomableCanvas({ children, onClose }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setScale(s => Math.min(Math.max(s * delta, 0.1), 5));
        } else {
            // Pan with wheel
            setPosition(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
        }
    };

    const handleMouseDown = (e) => {
        // Allow dragging if clicking background or explicitly holding Space (common design tool behavior)
        // or if middle mouse button
        if (e.button === 1 || e.target === containerRef.current || e.target.closest('.canvas-bg')) {
            setIsDragging(true);
            setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const content = (
        <div
            className="fixed inset-0 z-[9999] bg-slate-100 overflow-hidden flex flex-col font-sans"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-50 flex gap-2 bg-white p-2 rounded-lg shadow-xl border border-slate-200">
                <div className="flex items-center gap-1 mr-2 text-slate-500 text-xs px-2 border-r border-slate-200">
                    <Move size={14} />
                    <span>按住拖动 / 滚轮缩放</span>
                </div>
                <button onClick={() => setScale(s => Math.min(s + 0.1, 5))} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="放大"><ZoomIn size={18} /></button>
                <button onClick={() => setScale(s => Math.max(s - 0.1, 0.1))} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="缩小"><ZoomOut size={18} /></button>
                <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="重置"><RotateCcw size={18} /></button>
                <div className="w-px bg-slate-200 mx-1"></div>
                <button onClick={onClose} className="p-1.5 hover:bg-red-50 text-red-500 rounded" title="关闭"><X size={18} /></button>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className="flex-1 canvas-bg cursor-grab active:cursor-grabbing flex items-center justify-center w-full h-full"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
            >
                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                    className="bg-white shadow-2xl rounded-lg p-8 min-w-[100px] min-h-[100px]"
                    onMouseDown={(e) => e.stopPropagation()} // Stop propagation to prevent dragging when interacting with content
                >
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}

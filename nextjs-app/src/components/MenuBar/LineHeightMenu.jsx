/**
 * 行高选择菜单组件
 */
import React, { useState, useEffect, useRef } from 'react';
import { Baseline, ChevronDown } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

const LINE_HEIGHTS = [
    { name: '1.0', value: '1.0' },
    { name: '1.15', value: '1.15' },
    { name: '1.5', value: '1.5' },
    { name: '2.0', value: '2.0' },
    { name: '2.5', value: '2.5' },
    { name: '3.0', value: '3.0' },
];

export function LineHeightMenu({ editor }) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2 relative" ref={menuRef}>
            <Button
                onClick={() => setShowMenu(!showMenu)}
                title="行高"
                className="w-16 justify-between flex items-center"
            >
                <Baseline size={18} />
                <ChevronDown size={12} />
            </Button>
            {showMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[80px]">
                    {LINE_HEIGHTS.map((lh) => (
                        <button
                            key={lh.name}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                                editor.chain().focus().setLineHeight(lh.value).run();
                                setShowMenu(false);
                            }}
                            className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left text-sm ${editor.isActive({ lineHeight: lh.value }) ? 'bg-gray-100' : ''}`}
                        >
                            {lh.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

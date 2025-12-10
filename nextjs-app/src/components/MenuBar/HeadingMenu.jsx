/**
 * 标题选择菜单组件
 */
import React, { useState, useRef, useEffect } from 'react';
import { Type, ChevronDown, Heading1, Heading2, Heading3 } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

export function HeadingMenu({ editor }) {
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const headingMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) {
                setShowHeadingMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) return null;

    const getCurrentHeading = () => {
        if (editor.isActive('heading', { level: 1 })) return 'H1';
        if (editor.isActive('heading', { level: 2 })) return 'H2';
        if (editor.isActive('heading', { level: 3 })) return 'H3';
        return '正文';
    };

    return (
        <div className="relative" ref={headingMenuRef}>
            <Button
                onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                title="标题"
                className="flex items-center gap-1"
            >
                <Type size={18} />
                <span className="text-xs">{getCurrentHeading()}</span>
                <ChevronDown size={12} />
            </Button>
            {showHeadingMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[120px]">
                    <button
                        onClick={() => {
                            editor.chain().focus().setParagraph().run();
                            setShowHeadingMenu(false);
                        }}
                        className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left ${editor.isActive('paragraph') ? 'bg-gray-100' : ''}`}
                    >
                        <Type size={14} />
                        <span className="text-sm">正文</span>
                    </button>
                    <button
                        onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 1 }).run();
                            setShowHeadingMenu(false);
                        }}
                        className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
                    >
                        <Heading1 size={14} />
                        <span className="text-lg font-bold">标题 1</span>
                    </button>
                    <button
                        onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 2 }).run();
                            setShowHeadingMenu(false);
                        }}
                        className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
                    >
                        <Heading2 size={14} />
                        <span className="text-base font-bold">标题 2</span>
                    </button>
                    <button
                        onClick={() => {
                            editor.chain().focus().toggleHeading({ level: 3 }).run();
                            setShowHeadingMenu(false);
                        }}
                        className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-100' : ''}`}
                    >
                        <Heading3 size={14} />
                        <span className="text-sm font-bold">标题 3</span>
                    </button>
                </div>
            )}
        </div>
    );
}

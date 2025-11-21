import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    Trash2, Merge, Split,
    Table as TableIcon, X
} from 'lucide-react';

const TableContextMenu = ({ editor, position, onClose }) => {
    const menuRef = useRef(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Prevent menu from going off-screen
    const style = {
        top: position.y,
        left: position.x,
    };

    // Adjust position if close to edge
    if (position.x + 200 > window.innerWidth) {
        style.left = position.x - 200;
    }
    if (position.y + 300 > window.innerHeight) {
        style.top = position.y - 300;
    }

    if (!editor) return null;

    const MenuItem = ({ icon: Icon, label, onClick, danger = false }) => (
        <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors ${danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                }`}
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent focus loss
                e.stopPropagation();
                onClick();
                onClose();
            }}
        >
            {Icon && <Icon size={16} />}
            <span className="flex-1">{label}</span>
        </button>
    );

    return (
        <div
            ref={menuRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
            style={style}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Insert Submenu */}
            <div className="relative" onMouseEnter={() => setActiveSubmenu('insert')}>
                <button className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 text-gray-700">
                    <TableIcon size={16} />
                    <span className="flex-1">插入...</span>
                    <span className="text-gray-400 text-xs">▶</span>
                </button>

                {activeSubmenu === 'insert' && (
                    <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[180px]">
                        <MenuItem
                            icon={ArrowUp}
                            label="在上方插入行"
                            onClick={() => editor.chain().focus().addRowBefore().run()}
                        />
                        <MenuItem
                            icon={ArrowDown}
                            label="在下方插入行"
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                        />
                        <MenuItem
                            icon={ArrowLeft}
                            label="在左侧插入列"
                            onClick={() => editor.chain().focus().addColumnBefore().run()}
                        />
                        <MenuItem
                            icon={ArrowRight}
                            label="在右侧插入列"
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                        />
                    </div>
                )}
            </div>

            {/* Delete Submenu */}
            <div className="relative" onMouseEnter={() => setActiveSubmenu('delete')}>
                <button className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 text-gray-700">
                    <Trash2 size={16} />
                    <span className="flex-1">删除...</span>
                    <span className="text-gray-400 text-xs">▶</span>
                </button>

                {activeSubmenu === 'delete' && (
                    <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[180px]">
                        <MenuItem
                            icon={X}
                            label="删除当前行"
                            onClick={() => editor.chain().focus().deleteRow().run()}
                        />
                        <MenuItem
                            icon={X}
                            label="删除当前列"
                            onClick={() => editor.chain().focus().deleteColumn().run()}
                        />
                        <div className="h-px bg-gray-200 my-1"></div>
                        <MenuItem
                            icon={Trash2}
                            label="删除整个表格"
                            danger
                            onClick={() => editor.chain().focus().deleteTable().run()}
                        />
                    </div>
                )}
            </div>

            <div className="h-px bg-gray-200 my-1"></div>

            {/* Merge/Split */}
            <MenuItem
                icon={Merge}
                label="合并单元格"
                onClick={() => editor.chain().focus().mergeCells().run()}
            />
            <MenuItem
                icon={Split}
                label="拆分单元格"
                onClick={() => editor.chain().focus().splitCell().run()}
            />

        </div>
    );
};

export default TableContextMenu;

import React, { useEffect, useRef, useState } from 'react';
import { Edit2, Trash2, FolderPlus, ChevronRight } from 'lucide-react';

interface FolderContextMenuProps {
    x: number;
    y: number;
    type: 'folder' | 'document' | 'spreadsheet';
    onClose: () => void;
    onRename: () => void;
    onDelete: () => void;
    onCreateSubfolder?: () => void; // 仅文件夹
}

export default function FolderContextMenu({
    x,
    y,
    type,
    onClose,
    onRename,
    onDelete,
    onCreateSubfolder
}: FolderContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [adjustedPosition, setAdjustedPosition] = useState({ x, y });

    useEffect(() => {
        // 点击外部关闭
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        // ESC 关闭
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        // 调整位置防止溢出
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let newX = x;
            let newY = y;

            if (x + rect.width > viewportWidth) {
                newX = viewportWidth - rect.width - 10;
            }
            if (y + rect.height > viewportHeight) {
                newY = viewportHeight - rect.height - 10;
            }

            setAdjustedPosition({ x: newX, y: newY });
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [x, y, onClose]);

    const menuItems = [
        {
            icon: Edit2,
            label: '重命名',
            onClick: () => { onRename(); onClose(); }
        },
        ...(type === 'folder' && onCreateSubfolder ? [{
            icon: FolderPlus,
            label: '新建子文件夹',
            onClick: () => { onCreateSubfolder(); onClose(); }
        }] : []),
        {
            icon: Trash2,
            label: '删除',
            onClick: () => { onDelete(); onClose(); },
            danger: true
        }
    ];

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-40"
            style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
        >
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 transition ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                        }`}
                >
                    <item.icon size={14} />
                    {item.label}
                </button>
            ))}
        </div>
    );
}

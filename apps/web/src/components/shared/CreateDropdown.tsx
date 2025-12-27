'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';

interface CreateDropdownProps {
    onCreateDocument: () => void;
    onCreateSpreadsheet: () => void;
}

/**
 * 新建下拉菜单 - 支持创建文档或表格
 */
export default function CreateDropdown({
    onCreateDocument,
    onCreateSpreadsheet,
}: CreateDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreateDocument = () => {
        setIsOpen(false);
        onCreateDocument();
    };

    const handleCreateSpreadsheet = () => {
        setIsOpen(false);
        onCreateSpreadsheet();
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus size={18} />
                <span>新建</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <button
                        onClick={handleCreateDocument}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <FileText size={20} className="text-blue-600" />
                        <div>
                            <div className="font-medium text-gray-900">文档</div>
                            <div className="text-xs text-gray-500">富文本编辑器</div>
                        </div>
                    </button>

                    <div className="h-px bg-gray-100 mx-2" />

                    <button
                        onClick={handleCreateSpreadsheet}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <FileSpreadsheet size={20} className="text-green-600" />
                        <div>
                            <div className="font-medium text-gray-900">表格</div>
                            <div className="text-xs text-gray-500">电子表格编辑器</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}

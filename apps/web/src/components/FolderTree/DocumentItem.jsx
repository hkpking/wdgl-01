/**
 * DocumentItem - 文档/表格项组件
 * 
 * 从 FolderTree.jsx 拆分
 */

import React, { useState, useEffect } from 'react';
import { FileText, FileSpreadsheet, GitBranch, MoreVertical } from 'lucide-react';
import { DraggableWrapper } from './DragDropWrappers';

export default function DocumentItem({
    doc,
    level,
    isActive,
    onSelect,
    onMenuClick,
    isDraggable = true,
    isRenaming = false,
    onRename
}) {
    const isSpreadsheet = doc.type === 'spreadsheet';
    const isFlowchart = doc.contentType === 'flowchart';

    // 图标和颜色选择
    const getIconInfo = () => {
        if (isFlowchart) return { Icon: GitBranch, color: 'text-purple-500' };
        if (isSpreadsheet) return { Icon: FileSpreadsheet, color: 'text-green-500' };
        return { Icon: FileText, color: 'text-gray-400' };
    };
    const { Icon, color: iconColor } = getIconInfo();

    // 获取文档类型
    const getDocType = () => {
        if (isFlowchart) return 'flowchart';
        if (isSpreadsheet) return 'spreadsheet';
        return 'document';
    };

    // Rename Logic
    const [tempValue, setTempValue] = useState(doc.title);
    useEffect(() => {
        if (isRenaming) setTempValue(doc.title);
    }, [isRenaming, doc.title]);

    const handleCommit = () => {
        onRename(doc.id, tempValue.trim(), getDocType());
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleCommit();
        else if (e.key === 'Escape') onRename(doc.id, null);
    };

    if (isRenaming) {
        const paddingLeft = `${level * 16 + 28}px`;
        return (
            <div className="flex items-center py-1.5 px-2" style={{ paddingLeft }}>
                <Icon size={14} className={`mr-2 ${iconColor} flex-shrink-0`} />
                <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleCommit}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm bg-white border border-blue-500 rounded px-1.5 py-0.5 outline-none min-w-0"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        );
    }

    const paddingLeft = `${level * 16 + 28}px`;
    const content = (
        <div
            className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-100 group ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
            style={{ paddingLeft }}
            onClick={() => onSelect(doc)}
        >
            <Icon size={14} className={`mr-2 ${iconColor} flex-shrink-0`} />
            <span className="flex-1 text-sm truncate select-none">{doc.title || '无标题'}</span>
            {doc.status === 'draft' && (
                <span className="text-xs text-gray-400 ml-1">草稿</span>
            )}
            <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onMenuClick(e, doc, getDocType());
                }}
            >
                <MoreVertical size={14} />
            </button>
        </div>
    );

    if (isDraggable) {
        const docType = getDocType();
        return (
            <DraggableWrapper id={`${docType}-${doc.id}`} type={docType} itemId={doc.id}>
                {content}
            </DraggableWrapper>
        );
    }

    return content;
}

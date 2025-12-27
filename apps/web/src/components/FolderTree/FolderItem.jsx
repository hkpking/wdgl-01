/**
 * FolderItem - 文件夹项组件（递归）
 * 
 * 从 FolderTree.jsx 拆分
 */

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreVertical } from 'lucide-react';
import { DraggableWrapper, DroppableFolder } from './DragDropWrappers';
import DocumentItem from './DocumentItem';

export default function FolderItem({
    folder,
    level = 0,
    isSelected,
    onSelect,
    onToggle,
    isExpanded,
    subFolders,
    folderDocs,
    onMenuClick,
    activeDocId,
    onSelectDocument,
    activeDropId,
    isDraggable = true,
    renamingItemId,
    onRename
}) {
    const isRenaming = renamingItemId === folder.id;
    const paddingLeft = `${level * 16 + 12}px`;
    const hasChildren = subFolders.length > 0 || folderDocs.length > 0;
    const isDropTarget = activeDropId === folder.id;

    // Rename Logic for Folder
    const [tempValue, setTempValue] = useState(folder.name);
    useEffect(() => {
        if (isRenaming) setTempValue(folder.name);
    }, [isRenaming, folder.name]);

    const handleCommit = () => {
        onRename(folder.id, tempValue.trim(), 'folder');
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleCommit();
        else if (e.key === 'Escape') onRename(folder.id, null);
    };

    let folderContent;
    if (isRenaming) {
        folderContent = (
            <div className="flex items-center py-2 px-2" style={{ paddingLeft }}>
                <div className="mr-1 w-3.5" />
                <div className="mr-2 text-yellow-500">
                    {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                </div>
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
    } else {
        folderContent = (
            <div
                className={`flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 group ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${isDropTarget ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
                style={{ paddingLeft }}
                onClick={() => onSelect(folder)}
            >
                <div
                    className="mr-1 p-0.5 rounded hover:bg-gray-200 text-gray-400"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) onToggle(folder.id);
                    }}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <div className="w-3.5" />
                    )}
                </div>

                <div className="mr-2 text-yellow-500">
                    {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                </div>

                <span className="flex-1 text-sm truncate select-none">{folder.name}</span>

                <button
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMenuClick(e, folder, 'folder');
                    }}
                >
                    <MoreVertical size={14} />
                </button>
            </div>
        );
    }

    const wrappedContent = isDraggable ? (
        <DraggableWrapper id={`folder-${folder.id}`} type="folder" itemId={folder.id}>
            <DroppableFolder id={folder.id} isOver={isDropTarget}>
                {folderContent}
            </DroppableFolder>
        </DraggableWrapper>
    ) : (
        <DroppableFolder id={folder.id} isOver={isDropTarget}>
            {folderContent}
        </DroppableFolder>
    );

    return (
        <div>
            {wrappedContent}

            {isExpanded && (
                <>
                    {subFolders.map(sub => (
                        <FolderItem
                            key={sub.id}
                            folder={sub}
                            level={level + 1}
                            isSelected={isSelected}
                            onSelect={onSelect}
                            onToggle={onToggle}
                            isExpanded={sub.isExpanded}
                            subFolders={sub.subFolders || []}
                            folderDocs={sub.documents || []}
                            onMenuClick={onMenuClick}
                            activeDocId={activeDocId}
                            onSelectDocument={onSelectDocument}
                            activeDropId={activeDropId}
                            isDraggable={isDraggable}
                            renamingItemId={renamingItemId}
                            onRename={onRename}
                        />
                    ))}
                    {folderDocs.map(doc => (
                        <DocumentItem
                            key={doc.id}
                            doc={doc}
                            level={level + 1}
                            isActive={activeDocId === doc.id}
                            onSelect={onSelectDocument}
                            onMenuClick={onMenuClick}
                            isDraggable={isDraggable}
                            isRenaming={renamingItemId === doc.id}
                            onRename={onRename}
                        />
                    ))}
                </>
            )}
        </div>
    );
}

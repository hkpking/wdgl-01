import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreVertical, Plus, Edit2, Trash2 } from 'lucide-react';

const FolderItem = ({ folder, level = 0, isSelected, onSelect, onToggle, isExpanded, subFolders, onAction }) => {
    const paddingLeft = `${level * 16 + 12}px`;

    const { setNodeRef, isOver } = useDroppable({
        id: folder.id,
        data: { type: 'folder', folder }
    });

    return (
        <div>
            <div
                ref={setNodeRef}
                className={`flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 group ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${isOver ? 'bg-blue-100 ring-2 ring-blue-300' : ''}`}
                style={{ paddingLeft }}
                onClick={() => onSelect(folder)}
            >
                <div
                    className="mr-1 p-0.5 rounded hover:bg-gray-200 text-gray-400"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(folder.id);
                    }}
                >
                    {subFolders.length > 0 ? (
                        isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <div className="w-3.5" />
                    )}
                </div>

                <div className="mr-2 text-yellow-500">
                    {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                </div>

                <span className="flex-1 text-sm truncate select-none">{folder.name}</span>

                {/* Actions Menu Trigger */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(e, folder);
                        }}
                    >
                        <MoreVertical size={14} />
                    </button>
                </div>
            </div>

            {isExpanded && subFolders.map(sub => (
                <FolderItem
                    key={sub.id}
                    folder={sub}
                    level={level + 1}
                    isSelected={isSelected}
                    onSelect={onSelect}
                    onToggle={onToggle}
                    isExpanded={sub.isExpanded}
                    subFolders={sub.subFolders || []}
                    onAction={onAction}
                />
            ))}
        </div>
    );
};

export default function FolderTree({ folders, selectedFolderId, onSelectFolder, onAction }) {
    const [expandedIds, setExpandedIds] = useState(new Set());

    // Build tree structure
    const buildTree = (items) => {
        const itemMap = {};
        const roots = [];

        items.forEach(item => {
            itemMap[item.id] = { ...item, subFolders: [], isExpanded: expandedIds.has(item.id) };
        });

        items.forEach(item => {
            if (item.parentId && itemMap[item.parentId]) {
                itemMap[item.parentId].subFolders.push(itemMap[item.id]);
            } else {
                roots.push(itemMap[item.id]);
            }
        });

        return roots;
    };

    const treeData = buildTree(folders);

    const handleToggle = (folderId) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedIds(newExpanded);
    };

    return (
        <div className="py-2 select-none">
            <div
                className={`flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100 ${!selectedFolderId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                onClick={() => onSelectFolder(null)}
            >
                <Folder size={18} className="mr-2 text-gray-400" />
                <span className="text-sm font-medium">全部文档</span>
            </div>

            <div className="mt-2">
                <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between items-center group">
                    <span>文件夹</span>
                    <button
                        className="hover:bg-gray-200 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(e, null, 'create');
                        }}
                        title="新建根文件夹"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                {treeData.map(folder => (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        isSelected={selectedFolderId === folder.id}
                        onSelect={(f) => onSelectFolder(f.id)}
                        onToggle={handleToggle}
                        isExpanded={folder.isExpanded}
                        subFolders={folder.subFolders}
                        onAction={(e, f) => onAction(e, f, 'menu')}
                    />
                ))}
            </div>
        </div>
    );
}

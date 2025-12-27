import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

const FolderItem = ({ folder, level = 0, selectedFolderId, onSelect, isExpanded, onToggle, subFolders, disabledIds = [] }) => {
    const paddingLeft = `${level * 16 + 12}px`;
    const isDisabled = disabledIds.includes(folder.id);

    return (
        <div>
            <div
                className={`flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 group ${selectedFolderId === folder.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ paddingLeft }}
                onClick={() => !isDisabled && onSelect(folder.id)}
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
            </div>

            {isExpanded && subFolders.map(sub => (
                <FolderItem
                    key={sub.id}
                    folder={sub}
                    level={level + 1}
                    selectedFolderId={selectedFolderId}
                    onSelect={onSelect}
                    isExpanded={sub.isExpanded}
                    onToggle={onToggle}
                    subFolders={sub.subFolders || []}
                    disabledIds={disabledIds}
                />
            ))}
        </div>
    );
};

export default function FolderSelector({ folders, currentFolderId, onSelect, onCancel, isOpen }) {
    const [selectedId, setSelectedId] = useState(currentFolderId);
    const [expandedIds, setExpandedIds] = useState(new Set());

    // Initialize expanded state on open
    useEffect(() => {
        if (isOpen) {
            setSelectedId(currentFolderId);
            // Expand all by default for easier selection, or just root
            const allIds = new Set(folders.map(f => f.id));
            setExpandedIds(allIds);
        }
    }, [isOpen, currentFolderId, folders]);

    if (!isOpen) return null;

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

    const handleConfirm = () => {
        onSelect(selectedId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">移动到...</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {/* Root Option */}
                    <div
                        className={`flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100 rounded ${selectedId === null ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        onClick={() => setSelectedId(null)}
                    >
                        <Folder size={18} className="mr-2 text-gray-400" />
                        <span className="text-sm font-medium">全部文档 (根目录)</span>
                    </div>

                    <div className="mt-2 pl-2">
                        {treeData.map(folder => (
                            <FolderItem
                                key={folder.id}
                                folder={folder}
                                selectedFolderId={selectedId}
                                onSelect={setSelectedId}
                                onToggle={handleToggle}
                                isExpanded={folder.isExpanded}
                                subFolders={folder.subFolders}
                                disabledIds={currentFolderId ? [currentFolderId] : []} // Disable current folder
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedId === currentFolderId}
                    >
                        移动
                    </button>
                </div>
            </div>
        </div>
    );
}

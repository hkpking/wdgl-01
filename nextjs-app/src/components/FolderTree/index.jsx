/**
 * FolderTree - 文件夹树主组件
 * 
 * 重构版：拆分为多个子组件
 * - DragDropWrappers: 拖拽相关
 * - DocumentItem: 文档/表格项
 * - FolderItem: 文件夹项（递归）
 */

import React, { useState, useCallback } from 'react';
import { Folder, FileText, FileSpreadsheet, Plus, Home } from 'lucide-react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core';
import { DroppableFolder } from './DragDropWrappers';
import FolderItem from './FolderItem';
import DocumentItem from './DocumentItem';

export default function FolderTree({
    folders,
    documents = [],
    selectedFolderId,
    activeDocId,
    onSelectFolder,
    onSelectDocument,
    onMenuClick,
    onMoveItem,
    onAction,
    showHome = false,
    onSelectHome,
    enableDragDrop = true,
    renamingItemId,
    onRename
}) {
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [activeDropId, setActiveDropId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);

    // 拖拽传感器
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // 构建树结构
    const buildTree = useCallback((folderItems, docItems) => {
        const itemMap = {};
        const roots = [];

        folderItems.forEach(item => {
            itemMap[item.id] = {
                ...item,
                subFolders: [],
                documents: [],
                isExpanded: expandedIds.has(item.id)
            };
        });

        folderItems.forEach(item => {
            if (item.parentId && itemMap[item.parentId]) {
                itemMap[item.parentId].subFolders.push(itemMap[item.id]);
            } else {
                roots.push(itemMap[item.id]);
            }
        });

        docItems.forEach(doc => {
            const folderId = doc.folderId;
            if (folderId && itemMap[folderId]) {
                itemMap[folderId].documents.push(doc);
            }
        });

        return { roots, itemMap };
    }, [expandedIds]);

    const { roots: treeData } = buildTree(folders, documents);
    const rootDocs = documents.filter(doc => !doc.folderId);

    const handleToggle = (folderId) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedIds(newExpanded);
    };

    // 兼容旧版 onAction
    const handleMenuClick = (e, item, type) => {
        if (onMenuClick) {
            onMenuClick(e, item, type);
        } else if (onAction) {
            onAction(e, item, 'menu');
        }
    };

    // 拖拽处理
    const handleDragStart = (event) => {
        const { active } = event;
        if (active.data?.current) {
            const { type, id } = active.data.current;
            setDraggedItem({ type, id, data: active.data.current });
        } else {
            const [type, id] = active.id.split('-');
            setDraggedItem({ type, id, data: active.data.current });
        }
    };

    const handleDragOver = (event) => {
        const { over } = event;
        if (over) {
            setActiveDropId(over.id);
        } else {
            setActiveDropId(null);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDropId(null);
        setDraggedItem(null);

        if (!over || !onMoveItem) return;

        let itemType, itemId;
        if (active.data?.current) {
            itemType = active.data.current.type;
            itemId = active.data.current.id;
        } else {
            const parts = active.id.split('-');
            itemType = parts[0];
            itemId = parts.slice(1).join('-');
        }

        const targetFolderId = over.id === 'root' ? null : over.id;
        if (itemType === 'folder' && itemId === targetFolderId) return;

        onMoveItem(itemId, itemType, targetFolderId);
    };

    const treeContent = (
        <div className="py-2 select-none">
            {/* 主页选项 */}
            {showHome && (
                <div
                    className={`flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100 ${!selectedFolderId && !activeDocId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    onClick={onSelectHome}
                >
                    <Home size={18} className="mr-2 text-gray-400" />
                    <span className="text-sm font-medium">主页</span>
                </div>
            )}

            {/* 全部文档选项 */}
            {!showHome && (
                <DroppableFolder id="root" isOver={activeDropId === 'root'}>
                    <div
                        className={`flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100 ${!selectedFolderId ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        onClick={() => onSelectFolder(null)}
                    >
                        <Folder size={18} className="mr-2 text-gray-400" />
                        <span className="text-sm font-medium">全部文档</span>
                    </div>
                </DroppableFolder>
            )}

            {/* 目录标题 */}
            <div className="mt-2">
                <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between items-center group">
                    <span>目录</span>
                    <button
                        className="hover:bg-gray-200 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onAction) onAction(e, null, 'create');
                            if (onMenuClick) onMenuClick(e, null, 'create-folder');
                        }}
                        title="新建文件夹"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* 文件夹树 */}
                {treeData.map(folder => (
                    <FolderItem
                        key={folder.id}
                        folder={folder}
                        isSelected={selectedFolderId === folder.id}
                        onSelect={(f) => onSelectFolder(f.id)}
                        onToggle={handleToggle}
                        isExpanded={folder.isExpanded}
                        subFolders={folder.subFolders}
                        folderDocs={folder.documents}
                        onMenuClick={handleMenuClick}
                        activeDocId={activeDocId}
                        onSelectDocument={onSelectDocument}
                        activeDropId={activeDropId}
                        isDraggable={enableDragDrop}
                        renamingItemId={renamingItemId}
                        onRename={onRename}
                    />
                ))}

                {/* 根目录文档 */}
                {rootDocs.map(doc => (
                    <DocumentItem
                        key={doc.id}
                        doc={doc}
                        level={0}
                        isActive={activeDocId === doc.id}
                        onSelect={onSelectDocument}
                        onMenuClick={handleMenuClick}
                        isDraggable={enableDragDrop}
                        isRenaming={renamingItemId === doc.id}
                        onRename={onRename}
                    />
                ))}

                {/* 空状态 */}
                {treeData.length === 0 && rootDocs.length === 0 && (
                    <div className="px-4 py-4 text-center text-sm text-gray-400">
                        暂无内容
                    </div>
                )}
            </div>
        </div>
    );

    if (enableDragDrop) {
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {treeContent}
                <DragOverlay>
                    {draggedItem && (
                        <div className="bg-white shadow-lg rounded px-3 py-2 text-sm border border-gray-200">
                            {draggedItem.type === 'folder' ? (
                                <div className="flex items-center gap-2">
                                    <Folder size={14} className="text-yellow-500" />
                                    <span>移动文件夹</span>
                                </div>
                            ) : draggedItem.type === 'spreadsheet' ? (
                                <div className="flex items-center gap-2">
                                    <FileSpreadsheet size={14} className="text-green-500" />
                                    <span>移动表格</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <FileText size={14} className="text-gray-400" />
                                    <span>移动文档</span>
                                </div>
                            )}
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        );
    }

    return treeContent;
}

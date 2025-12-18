import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, MoreVertical, Plus, Home } from 'lucide-react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';

// ==========================================
// 拖拽相关组件
// ==========================================

const DraggableWrapper = ({ id, type, children, disabled = false }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { type, id },
        disabled
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
};

const DroppableFolder = ({ id, children, isOver }) => {
    const { setNodeRef } = useDroppable({ id, data: { type: 'folder', id } });

    return (
        <div ref={setNodeRef} className={isOver ? 'bg-blue-50 ring-2 ring-blue-300 rounded' : ''}>
            {children}
        </div>
    );
};

// ==========================================
// 文档项组件
// ==========================================

const DocumentItem = ({ doc, level, isActive, onSelect, onMenuClick, isDraggable = true }) => {
    const paddingLeft = `${level * 16 + 28}px`;

    const content = (
        <div
            className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-100 group ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
            style={{ paddingLeft }}
            onClick={() => onSelect(doc)}
        >
            <FileText size={14} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-sm truncate select-none">{doc.title || '无标题'}</span>
            {doc.status === 'draft' && (
                <span className="text-xs text-gray-400 ml-1">草稿</span>
            )}
            {/* 更多按钮 */}
            <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onMenuClick(e, doc, 'document');
                }}
            >
                <MoreVertical size={14} />
            </button>
        </div>
    );

    if (isDraggable) {
        return (
            <DraggableWrapper id={`doc-${doc.id}`} type="document">
                {content}
            </DraggableWrapper>
        );
    }

    return content;
};

// ==========================================
// 文件夹项组件
// ==========================================

const FolderItem = ({
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
    isDraggable = true
}) => {
    const paddingLeft = `${level * 16 + 12}px`;
    const hasChildren = subFolders.length > 0 || folderDocs.length > 0;
    const isDropTarget = activeDropId === folder.id;

    const folderContent = (
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

            {/* 更多按钮 */}
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

    const wrappedContent = isDraggable ? (
        <DraggableWrapper id={`folder-${folder.id}`} type="folder">
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
                    {/* 子文件夹 */}
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
                        />
                    ))}
                    {/* 文件夹下的文档 */}
                    {folderDocs.map(doc => (
                        <DocumentItem
                            key={doc.id}
                            doc={doc}
                            level={level + 1}
                            isActive={activeDocId === doc.id}
                            onSelect={onSelectDocument}
                            onMenuClick={onMenuClick}
                            isDraggable={isDraggable}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

// ==========================================
// 主组件
// ==========================================

/**
 * 文件夹树组件
 * @param {Object} props
 * @param {Array} props.folders - 文件夹列表
 * @param {Array} props.documents - 文档列表
 * @param {string} props.selectedFolderId - 选中的文件夹 ID
 * @param {string} props.activeDocId - 当前文档 ID
 * @param {Function} props.onSelectFolder - 选择文件夹
 * @param {Function} props.onSelectDocument - 选择文档
 * @param {Function} props.onMenuClick - 菜单点击回调 (e, item, type: 'folder' | 'document')
 * @param {Function} props.onMoveItem - 移动项目回调 (itemId, itemType, targetFolderId)
 * @param {Function} props.onAction - 操作回调（兼容旧版）
 * @param {boolean} props.showHome - 是否显示主页
 * @param {Function} props.onSelectHome - 选择主页
 * @param {boolean} props.enableDragDrop - 是否启用拖拽
 */
export default function FolderTree({
    folders,
    documents = [],
    selectedFolderId,
    activeDocId,
    onSelectFolder,
    onSelectDocument,
    onMenuClick,
    onMoveItem,
    onAction, // 兼容旧版
    showHome = false,
    onSelectHome,
    enableDragDrop = true
}) {
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [activeDropId, setActiveDropId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);

    // 拖拽传感器
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px 后才开始拖拽
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
        const [type, id] = active.id.split('-');
        setDraggedItem({ type, id, data: active.data.current });
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

        const [itemType, itemId] = active.id.split('-');
        const targetFolderId = over.id === 'root' ? null : over.id;

        // 防止文件夹移动到自己或子文件夹
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

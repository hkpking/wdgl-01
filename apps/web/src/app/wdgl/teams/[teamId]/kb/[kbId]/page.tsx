"use client";

/**
 * KnowledgeBasePage - 知识库页面（重构版）
 * 
 * 从原始 876 行拆分为：
 * - useKBPageState: 状态管理
 * - kbPageHandlers: 业务逻辑
 * - 本文件: 组件渲染
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
    Plus, FolderPlus, FileText, ChevronRight, ChevronDown,
    Loader2, PanelLeft
} from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import SearchModal from '@/components/shared/SearchModal';
import FolderContextMenu from '@/components/FolderContextMenu';
import KBHomePanel from '@/components/KnowledgeBase/KBHomePanel';
import { getKBPermissions } from '@/types/team';
import type { KBFolder } from '@/types/team';

// 拆分的 Hook 和处理函数
import { useKBPageState } from '@/hooks/useKBPageState';
import { createKBPageHandlers } from '@/lib/utils/kbPageHandlers';

// 动态导入编辑器模块
const DocumentEditorModule = dynamic(() => import('@/components/Editor/DocumentEditorModule'), { ssr: false });
const SpreadsheetEditorModule = dynamic(() => import('@/components/Spreadsheet/SpreadsheetEditorModule'), { ssr: false });
const FlowchartEditorModule = dynamic(() => import('@/components/Flowchart/FlowchartEditorModule'), { ssr: false });

import { useParams, useSearchParams } from 'next/navigation';

export default function KnowledgeBasePage() {
    // 使用拆分后的状态管理 Hook
    const state = useKBPageState();
    const searchParams = useSearchParams();

    // 创建处理函数
    const handlers = useMemo(() => createKBPageHandlers(state), [state]);

    // 监听 URL 参数自动打开流程图
    // 注意：不要将 handlers 加入依赖，否则会导致无限循环
    useEffect(() => {
        const flowchartId = searchParams.get('flowchart');
        if (flowchartId && flowchartId !== state.activeFlowchartId) {
            handlers.openFlowchart(flowchartId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, state.activeFlowchartId]);

    const {
        teamId,
        kbId,
        router,
        currentUser,
        authLoading,
        userRole,
        kb,
        folders,
        allItems,
        recentDocs,
        isSysLoading,
        sidebarCollapsed,
        setSidebarCollapsed,
        selectedFolderId,
        setSelectedFolderId,
        expandedFolders,
        activeDocId,
        activeSheetId,
        sheetTitle,
        sheetInitialData,
        hasChanges,
        sheetHasChanges,
        contextMenu,
        setContextMenu,
        renamingItemId,
        setRenamingItemId,
        isSearchOpen,
        openSearch,
        closeSearch,
        handleOptimisticUpdate,
        invalidateKBContent,
        setHasChanges,
        setSheetHasChanges,
        setSheetTitle,
        // 流程图状态
        activeFlowchartId,
        flowchartData,
        flowchartHasChanges,
        setFlowchartHasChanges,
    } = state;

    const {
        handleCreateDoc,
        handleCreateSpreadsheet,
        handleCreateFlowchart,
        handleDeleteDoc,
        handleDeleteSpreadsheet,
        handleCreateFolder,
        handleDeleteFolder,
        handleRenameItem,
        handleMoveItem,
        handleMenuClick,
        openDoc,
        openSheet,
        openFlowchart,
        closeDoc,
        closeSheet,
        closeFlowchart,
        toggleFolderExpand,
        formatDate,
    } = handlers;

    // 监听流程图编辑器打开事件（从 handleCreateFlowchart 触发）
    useEffect(() => {
        const handleOpenFlowchartEvent = async (e: CustomEvent<{ folderId?: string | null }>) => {
            if (!currentUser?.uid) return;
            try {
                // 创建新的流程图文档
                const newDoc = {
                    title: '新建流程图',
                    content: '', // Draw.io XML
                    contentType: 'flowchart',
                    status: 'draft',
                    folderId: e.detail.folderId || selectedFolderId,
                    knowledgeBaseId: kbId,
                    teamId: teamId,
                };
                const savedDoc = await state.saveDocument(currentUser.uid, null, newDoc);
                if (savedDoc?.id) {
                    state.invalidateKBContent(kbId);
                    openFlowchart(savedDoc.id, savedDoc);
                }
            } catch (error) {
                console.error('创建流程图失败:', error);
                alert('创建流程图失败');
            }
        };
        window.addEventListener('openFlowchartEditor', handleOpenFlowchartEvent as unknown as EventListener);
        return () => window.removeEventListener('openFlowchartEditor', handleOpenFlowchartEvent as unknown as EventListener);
    }, [currentUser?.uid, selectedFolderId, kbId, teamId, state, openFlowchart]);

    // 保存流程图
    const handleSaveFlowchartContent = useCallback(async (data: { title: string; content: string; previewUrl: string }) => {
        if (!currentUser?.uid || !activeFlowchartId) return;
        try {
            await state.saveDocument(currentUser.uid, activeFlowchartId, {
                title: data.title,
                content: data.content,
                metadata: { previewUrl: data.previewUrl }
            });
            state.invalidateKBContent(kbId);
        } catch (error) {
            console.error('保存流程图失败:', error);
            throw error;
        }
    }, [currentUser?.uid, activeFlowchartId, kbId, state]);

    const permissions = getKBPermissions(userRole);

    // 构建文件夹树
    const buildTree = (parentId: string | null = null): KBFolder[] => {
        return folders.filter(f => f.parentId === parentId);
    };

    // 渲染文件夹节点
    const renderFolderNode = (folder: KBFolder, level: number = 0) => {
        const children = buildTree(folder.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;
        const folderItems = allItems.filter(d => d.folderId === folder.id);

        return (
            <div key={folder.id}>
                <div
                    className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                >
                    <button onClick={() => (hasChildren || folderItems.length > 0) && toggleFolderExpand(folder.id)} className="p-0.5">
                        {(hasChildren || folderItems.length > 0) ? (
                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        ) : (
                            <span className="w-3.5" />
                        )}
                    </button>
                    <button
                        onClick={() => setSelectedFolderId(folder.id)}
                        className="flex-1 flex items-center gap-2 text-sm text-left"
                    >
                        📁
                        <span className="truncate">{folder.name}</span>
                    </button>
                </div>
                {isExpanded && (
                    <>
                        {children.map(child => renderFolderNode(child, level + 1))}
                        {folderItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => item.type === 'spreadsheet' ? openSheet(item.id) : openDoc(item.id)}
                                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer group ${(item.type === 'document' && activeDocId === item.id) || (item.type === 'spreadsheet' && activeSheetId === item.id)
                                    ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                style={{ paddingLeft: `${(level + 1) * 12 + 24}px` }}
                            >
                                {item.type === 'spreadsheet' ? (
                                    <span className="text-green-500 mr-0.5 text-xs">📊</span>
                                ) : (
                                    <FileText size={12} className="text-gray-400 flex-shrink-0" />
                                )}
                                <span className="truncate flex-1">{item.title}</span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    };

    // 加载状态
    if (authLoading || isSysLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // 知识库不存在
    if (!kb) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">知识库不存在或无权访问</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* 应用侧边栏 */}
            {!sidebarCollapsed && (
                <AppSidebar
                    currentUser={currentUser}
                    onLogout={() => router.push('/login')}
                    onCreateDoc={handleCreateDoc}
                    onCreateSpreadsheet={handleCreateSpreadsheet}
                    onCreateFlowchart={handleCreateFlowchart}
                    onUpload={() => { }}
                    onOpenSearch={openSearch}
                    mode="knowledgeBase"
                    kb={kb}
                    kbFolders={folders}
                    kbDocuments={allItems}
                    activeKBDocId={activeDocId || activeSheetId || activeFlowchartId}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={setSelectedFolderId}
                    onSelectKBDoc={(id) => {
                        const item = allItems.find(i => i.id === id);
                        if (item?.type === 'spreadsheet') {
                            openSheet(id);
                        } else if ((item as any)?.contentType === 'flowchart') {
                            openFlowchart(id, item);
                        } else {
                            openDoc(id);
                        }
                    }}
                    onSelectKBHome={() => { closeDoc(); closeSheet(); closeFlowchart(); }}
                    onMenuClick={handleMenuClick}
                    onMoveItem={handleMoveItem}
                    onCollapse={() => setSidebarCollapsed(true)}
                    renamingItemId={renamingItemId}
                    onRenameItem={handleRenameItem}
                />
            )}

            {/* 收起按钮 */}
            {sidebarCollapsed && (
                <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="h-screen sticky top-0 flex items-center px-1 bg-gray-100 hover:bg-gray-200 border-r border-gray-200 transition"
                    title="展开侧边栏"
                >
                    <PanelLeft size={14} className="text-gray-500" />
                </button>
            )}

            {/* 右侧主内容 */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {activeDocId ? (
                    /* 文档编辑器 */
                    <DocumentEditorModule
                        key={activeDocId}
                        documentId={activeDocId}
                        initialDocument={allItems.find(d => d.id === activeDocId) as any}
                        currentUser={currentUser}
                        mode="embedded"
                        showBackButton={true}
                        onBack={closeDoc}
                        knowledgeBaseId={kbId}
                        teamId={teamId}
                        onDirtyChange={setHasChanges}
                        onTitleChange={(newTitle) => {
                            if (activeDocId) {
                                handleOptimisticUpdate(activeDocId, newTitle);
                            }
                        }}
                        onSaveSuccess={() => {
                            invalidateKBContent(kbId);
                        }}
                    />
                ) : activeSheetId ? (
                    /* 表格编辑器 */
                    <SpreadsheetEditorModule
                        key={activeSheetId}
                        spreadsheetId={activeSheetId}
                        initialSpreadsheet={{
                            id: activeSheetId,
                            title: sheetTitle,
                            data: sheetInitialData,
                            status: 'active',
                            userId: currentUser?.uid || '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            teamId: teamId,
                            knowledgeBaseId: kbId,
                            folderId: null
                        }}
                        userId={currentUser?.uid || ''}
                        currentUser={currentUser}
                        mode="embedded"
                        showBackButton={true}
                        onBack={closeSheet}
                        onDirtyChange={setSheetHasChanges}
                        onTitleChange={(newTitle) => {
                            setSheetTitle(newTitle);
                            if (activeSheetId) {
                                handleOptimisticUpdate(activeSheetId, newTitle);
                            }
                        }}
                        onSaveSuccess={() => {
                            invalidateKBContent(kbId);
                        }}
                    />
                ) : activeFlowchartId && flowchartData ? (
                    /* 流程图编辑器 */
                    <FlowchartEditorModule
                        key={activeFlowchartId}
                        flowchartId={activeFlowchartId}
                        initialData={flowchartData}
                        userId={currentUser?.uid || ''}
                        currentUser={currentUser}
                        mode="embedded"
                        showBackButton={true}
                        onBack={closeFlowchart}
                        onDirtyChange={setFlowchartHasChanges}
                        onSave={handleSaveFlowchartContent}
                        onTitleChange={(newTitle) => {
                            if (activeFlowchartId) {
                                handleOptimisticUpdate(activeFlowchartId, newTitle);
                            }
                        }}
                        onSaveSuccess={() => {
                            invalidateKBContent(kbId);
                        }}
                    />
                ) : (
                    /* 知识库首页 */
                    <KBHomePanel
                        kb={kb}
                        recentItems={recentDocs}
                        onOpenDoc={openDoc}
                        onOpenSheet={openSheet}
                        onDeleteDoc={handleDeleteDoc}
                        onDeleteSheet={handleDeleteSpreadsheet}
                        onCreateDoc={handleCreateDoc}
                        onCreateSpreadsheet={handleCreateSpreadsheet}
                        formatDate={formatDate}
                    />
                )}
            </main>

            {/* 搜索弹窗 */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={closeSearch}
                userId={currentUser?.uid}
                knowledgeBaseId={kbId}
                searchScope="knowledgeBase"
                onResultClick={(docId) => openDoc(docId)}
            />

            {/* 右键菜单 */}
            {contextMenu && (
                <FolderContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    type={contextMenu.type}
                    onClose={() => setContextMenu(null)}
                    onRename={() => {
                        setRenamingItemId(contextMenu.item.id);
                        setContextMenu(null);
                    }}
                    onDelete={() => {
                        if (contextMenu.type === 'folder') {
                            handleDeleteFolder(contextMenu.item.id);
                        } else if (contextMenu.type === 'spreadsheet') {
                            handleDeleteSpreadsheet(contextMenu.item.id, { stopPropagation: () => { } } as any);
                        } else {
                            handleDeleteDoc(contextMenu.item.id, { stopPropagation: () => { } } as any);
                        }
                        setContextMenu(null);
                    }}
                    onCreateSubfolder={contextMenu.type === 'folder' ? () => {
                        handleCreateFolder(contextMenu.item.id);
                        setContextMenu(null);
                    } : undefined}
                />
            )}
        </div>
    );
}

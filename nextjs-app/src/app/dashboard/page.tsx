"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, LogOut, FileText, FolderPlus, Edit2, Trash2, LayoutGrid, List as ListIcon } from 'lucide-react';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, closestCenter } from '@dnd-kit/core';
import DocumentList from '@/components/DocumentList';
import FolderTree from '@/components/FolderTree';
import FolderSelector from '@/components/FolderSelector';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useFolderManager } from '@/hooks/useFolderManager';
import { DOC_STATUS } from '@/lib/constants';
import { useStorage } from '@/contexts/StorageContext';
import type { Document, DocumentStatus } from '@/types/storage';
import { CreateFolderModal, RenameFolderModal, DeleteConfirmModal } from '@/components/modals';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();

    // 使用 Supabase 认证
    const storageContext = useStorage();
    const { currentUser, loading: authLoading, signOut, getAllDocuments, saveDocument, deleteDocument, moveDocument } = storageContext;

    // Managers
    const folderManager = useFolderManager(currentUser);
    const {
        folders, selectedFolderId, setSelectedFolderId, loadFolders,
        isCreateFolderModalOpen, setIsCreateFolderModalOpen,
        isRenameModalOpen, setIsRenameModalOpen,
        folderNameInput, setFolderNameInput,
        handleCreateFolder, handleRenameFolder, handleDeleteFolder,
        openCreateModal, openRenameModal, setFolderToDelete
    } = folderManager as any;

    // Document State
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('updatedAt');
    const [viewMode, setViewMode] = useState('grid');

    // Document Actions State
    const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
    const [moveDocId, setMoveDocId] = useState<string | null>(null);

    // UI State
    const [folderMenu, setFolderMenu] = useState<{ x: number; y: number; folder: any } | null>(null);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Load Documents
    const loadDocuments = useCallback(async () => {
        if (!currentUser?.uid) return;
        try {
            const docs = await getAllDocuments(currentUser.uid);
            setDocuments(docs || []);
        } catch (error) {
            console.error('加载文档失败:', error);
        }
    }, [currentUser?.uid, getAllDocuments]);

    // Initial Load
    useEffect(() => {
        if (!currentUser?.uid) return;

        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([loadFolders(), loadDocuments()]);
            } catch (error) {
                console.error('加载数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentUser?.uid, loadFolders, loadDocuments]);

    // Global Click Listener for Menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setFolderMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Document Actions ---
    const handleCreateDoc = async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        try {
            const newDoc = {
                title: '无标题文档',
                content: '',
                status: DOC_STATUS.DRAFT as DocumentStatus,
                contentType: 'html',
                folderId: selectedFolderId
            };
            const savedDoc = await saveDocument(currentUser!.uid, null, newDoc);
            if (savedDoc?.id) {
                router.push(`/editor/${savedDoc.id}`);
            }
        } catch (error) {
            console.error('创建文档失败:', error);
            alert('创建文档失败');
        }
    };

    const handleDeleteDoc = async () => {
        if (!deleteDocId || !currentUser) return;
        try {
            await deleteDocument(currentUser.uid, deleteDocId);
            setDeleteDocId(null);
            await loadDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert("删除失败");
        }
    };

    const handleMoveDoc = async (targetFolderId: string | null) => {
        if (!moveDocId || !currentUser) return;
        try {
            await moveDocument(currentUser.uid, moveDocId, targetFolderId);
            setMoveDocId(null);
            await loadDocuments();
        } catch (error) {
            alert('移动文档失败');
        }
    };

    const handleLogout = async () => {
        if (window.confirm('确定要退出吗?')) {
            await signOut();
            router.push('/login');
        }
    };

    // --- Folder Context Menu ---
    const handleFolderContextMenu = (e: React.MouseEvent, folder: any, type: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (type === 'create') {
            openCreateModal(null);
        } else if (type === 'menu') {
            setFolderMenu({
                x: e.clientX,
                y: e.clientY,
                folder
            });
        }
    };

    // --- Filter Logic ---
    const filteredDocs = documents
        .filter(doc => {
            const matchesSearch = (doc.title || '无标题').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || (doc.status || DOC_STATUS.DRAFT) === filterStatus;
            const matchesFolder = selectedFolderId ? doc.parentId === selectedFolderId : true;
            return matchesSearch && matchesStatus && matchesFolder;
        })
        .sort((a, b) => {
            if (sortBy === 'title') {
                return (a.title || '').localeCompare(b.title || '');
            }
            const timeA = a[sortBy] ? new Date(a[sortBy] as string).getTime() : 0;
            const timeB = b[sortBy] ? new Date(b[sortBy] as string).getTime() : 0;
            return timeB - timeA;
        });

    const currentFolder = folders.find((f: any) => f.id === selectedFolderId);
    const currentFolderName = selectedFolderId ? currentFolder?.name : '全部文档';

    // --- DnD ---
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const handleDragStart = (event: any) => setActiveDragId(event.active.id);
    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        setActiveDragId(null);
        if (over && active.id !== over.id) {
            const folderId = over.id;
            const docId = active.id;
            const doc = documents.find(d => d.id === docId);
            if (doc && doc.parentId !== folderId && currentUser) {
                try {
                    await moveDocument(currentUser.uid, docId, folderId);
                    await loadDocuments();
                } catch (error) {
                    console.error('Drag move failed:', error);
                }
            }
        }
    };

    // 注意：不再自动重定向到登录页，避免与 Login 页面形成循环
    // 如果用户未登录，只显示加载状态，让用户手动访问 /login

    // 认证加载中或未登录时显示加载状态
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // 未登录时显示提示，而不是自动重定向
    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">请先登录</p>
                    <a href="/login" className="text-blue-600 hover:underline">前往登录页面</a>
                </div>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <FileText className="text-white" size={20} />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">制度管理系统</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">{currentUser?.email || '演示模式'}</span>
                            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-800"><LogOut size={18} /></button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-8rem)] sticky top-24">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-700">目录导航</h2>
                            <button onClick={() => openCreateModal(null)} className="p-1 hover:bg-gray-100 rounded text-blue-600" title="新建文件夹">
                                <FolderPlus size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <FolderTree
                                folders={folders}
                                selectedFolderId={selectedFolderId}
                                onSelectFolder={setSelectedFolderId}
                                onAction={handleFolderContextMenu}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                {currentFolderName}
                                {selectedFolderId && <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{filteredDocs.length}</span>}
                            </h2>
                            <button onClick={handleCreateDoc} className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm">
                                <Plus size={18} /> 新建文档
                            </button>
                        </div>

                        <Breadcrumbs folders={folders} currentFolderId={selectedFolderId} onNavigate={setSelectedFolderId} />

                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="搜索当前目录..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                                >
                                    <option value="all">所有状态</option>
                                    <option value={DOC_STATUS.DRAFT}>草稿</option>
                                    <option value={DOC_STATUS.REVIEW}>待审核</option>
                                    <option value={DOC_STATUS.PUBLISHED}>已发布</option>
                                </select>
                                <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><LayoutGrid size={18} /></button>
                                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><ListIcon size={18} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Document List */}
                        {loading ? (
                            <div className="text-center py-20 text-gray-400">加载中...</div>
                        ) : (
                            <DocumentList
                                documents={filteredDocs}
                                viewMode={viewMode}
                                folders={folders}
                                searchTerm={searchTerm}
                                onDelete={setDeleteDocId}
                                onMove={setMoveDocId}
                            />
                        )}
                    </main>
                </div>

                {/* Modals */}
                {folderMenu && (
                    <div ref={menuRef} className="fixed bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-50 w-40" style={{ top: folderMenu.y, left: folderMenu.x }}>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2" onClick={() => { openCreateModal(folderMenu.folder.id); setFolderMenu(null); }}>
                            <FolderPlus size={14} /> 新建子文件夹
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2" onClick={() => { openRenameModal(folderMenu.folder); setFolderMenu(null); }}>
                            <Edit2 size={14} /> 重命名
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => { setFolderToDelete(folderMenu.folder); handleDeleteFolder(); setFolderMenu(null); }}>
                            <Trash2 size={14} /> 删除
                        </button>
                    </div>
                )}

                {isCreateFolderModalOpen && (
                    <CreateFolderModal
                        isOpen={isCreateFolderModalOpen}
                        folderName={folderNameInput}
                        onFolderNameChange={setFolderNameInput}
                        onCancel={() => setIsCreateFolderModalOpen(false)}
                        onCreate={handleCreateFolder}
                    />
                )}

                {isRenameModalOpen && (
                    <RenameFolderModal
                        isOpen={isRenameModalOpen}
                        folderName={folderNameInput}
                        onFolderNameChange={setFolderNameInput}
                        onCancel={() => setIsRenameModalOpen(false)}
                        onSave={handleRenameFolder}
                    />
                )}

                <DeleteConfirmModal
                    isOpen={!!deleteDocId}
                    onCancel={() => setDeleteDocId(null)}
                    onConfirm={handleDeleteDoc}
                />

                <FolderSelector isOpen={!!moveDocId} folders={folders} currentFolderId={documents.find(d => d.id === moveDocId)?.parentId || null} onSelect={handleMoveDoc} onCancel={() => setMoveDocId(null)} />

                <DragOverlay>
                    {activeDragId ? (
                        <div className="bg-white p-4 rounded-lg shadow-xl border border-blue-500 w-64 opacity-90">
                            <div className="flex items-center gap-2">
                                <FileText className="text-blue-600" size={20} />
                                <span className="font-medium truncate">{documents.find(d => d.id === activeDragId)?.title || '文档'}</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}

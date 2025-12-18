"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, LogOut, FileText, FolderPlus, Edit2, Trash2, LayoutGrid, List as ListIcon, Sparkles, Filter, X } from 'lucide-react';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, closestCenter } from '@dnd-kit/core';
import { useDebounce } from '@/hooks/useDebounce';
import DocumentList from '@/components/DocumentList';
import FolderTree from '@/components/FolderTree';
import FolderSelector from '@/components/FolderSelector';
import Breadcrumbs from '@/components/Breadcrumbs';
import AppSidebar from '@/components/layout/AppSidebar';
import SearchModal from '@/components/shared/SearchModal';
import { useFolderManager } from '@/hooks/useFolderManager';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { DOC_STATUS } from '@/lib/constants';
import { useStorage } from '@/contexts/StorageContext';
import type { Document, DocumentStatus } from '@/types/storage';
import { CreateFolderModal, RenameFolderModal, DeleteConfirmModal } from '@/components/modals';
import { Loader2 } from 'lucide-react';
import SearchFilterPanel from '@/components/SearchFilterPanel';

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

    // 全局搜索
    const { isOpen: isSearchOpen, openSearch, closeSearch } = useGlobalSearch();

    // Document State
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('updatedAt');
    const [viewMode, setViewMode] = useState('grid');

    // 语义搜索状态
    const [isSemanticSearching, setIsSemanticSearching] = useState(false);
    const [semanticResults, setSemanticResults] = useState<Document[]>([]);
    const [searchMode, setSearchMode] = useState<'local' | 'semantic'>('local');
    const [searchHint, setSearchHint] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 400);

    // 高级筛选状态
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        documentType: '',
        dateRange: '',
        department: '',
        status: '',
    });
    const hasActiveFilters = advancedFilters.documentType || advancedFilters.dateRange || advancedFilters.department || advancedFilters.status;

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

    // --- 语义搜索 Effect ---
    useEffect(() => {
        // 只有搜索词超过 2 个字符才触发语义搜索
        if (debouncedSearchTerm.length > 2 && searchMode === 'semantic') {
            setIsSemanticSearching(true);
            setSearchHint('正在进行智能搜索...');

            fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: debouncedSearchTerm,
                    userId: currentUser?.uid,
                    topK: 20,
                    enableRerank: true,
                    enableKnowledgeGraph: true,
                    filters: hasActiveFilters ? {
                        documentType: advancedFilters.documentType || undefined,
                        dateRange: advancedFilters.dateRange ? { range: advancedFilters.dateRange } : undefined,
                        department: advancedFilters.department || undefined,
                        status: advancedFilters.status || undefined,
                    } : undefined
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        // 将搜索结果转换为文档格式
                        const resultDocs = data.results.map((r: any) => ({
                            id: r.document_id,
                            title: r.metadata?.title || '未知标题',
                            content: r.chunk_text,
                            status: r.metadata?.status || DOC_STATUS.DRAFT,
                            parentId: r.metadata?.folder_id || null,
                            updatedAt: r.metadata?.updated_at,
                            createdAt: r.metadata?.created_at,
                            _score: r.rerankScore || r.hybridScore || r.similarity,
                            _highlight: r.chunk_text?.substring(0, 150)
                        }));
                        setSemanticResults(resultDocs);
                        setSearchHint(`找到 ${resultDocs.length} 个相关结果 (${data.timeMs}ms)`);
                    } else {
                        setSemanticResults([]);
                        setSearchHint('未找到相关内容，尝试换个关键词');
                    }
                })
                .catch(err => {
                    console.error('语义搜索失败:', err);
                    setSearchHint('搜索出错，已切换到本地搜索');
                    setSearchMode('local');
                })
                .finally(() => setIsSemanticSearching(false));
        } else if (debouncedSearchTerm.length <= 2) {
            setSemanticResults([]);
            setSearchHint('');
        }
    }, [debouncedSearchTerm, searchMode, currentUser?.uid]);

    // --- Filter Logic ---
    const filteredDocs = useMemo(() => {
        // 如果使用语义搜索且有结果，优先显示语义搜索结果
        if (searchMode === 'semantic' && semanticResults.length > 0 && debouncedSearchTerm.length > 2) {
            return semanticResults
                .filter(doc => {
                    const matchesStatus = filterStatus === 'all' || (doc.status || DOC_STATUS.DRAFT) === filterStatus;
                    const matchesFolder = selectedFolderId ? doc.parentId === selectedFolderId : true;
                    return matchesStatus && matchesFolder;
                });
        }

        // 否则使用本地搜索
        return documents
            .filter(doc => {
                const matchesSearch = searchTerm.length === 0 || (doc.title || '无标题').toLowerCase().includes(searchTerm.toLowerCase());
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
    }, [documents, semanticResults, searchTerm, debouncedSearchTerm, searchMode, filterStatus, selectedFolderId, sortBy]);

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
            <div className="min-h-screen bg-gray-50 flex">
                {/* 左侧导航 */}
                <AppSidebar
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    onCreateDoc={handleCreateDoc}
                    onUpload={() => alert('上传功能开发中...')}
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={setSelectedFolderId}
                    onOpenSearch={openSearch}
                />

                {/* 主内容区域 */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
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
                                {isSemanticSearching ? (
                                    <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 animate-spin" size={18} />
                                ) : searchMode === 'semantic' ? (
                                    <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" size={18} />
                                ) : (
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                )}
                                <input
                                    type="text"
                                    placeholder={searchMode === 'semantic' ? "智能搜索文档内容..." : "搜索文档标题..."}
                                    className={`w-full pl-10 pr-20 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${searchMode === 'semantic'
                                        ? 'bg-purple-50 border-purple-200 focus:ring-purple-500'
                                        : 'bg-gray-50 border-gray-200 focus:ring-blue-500'
                                        }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {/* 搜索模式切换按钮 */}
                                <button
                                    onClick={() => setSearchMode(searchMode === 'local' ? 'semantic' : 'local')}
                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded text-xs font-medium transition-all ${searchMode === 'semantic'
                                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                    title={searchMode === 'semantic' ? '切换到本地搜索' : '切换到智能搜索'}
                                >
                                    {searchMode === 'semantic' ? '✨ 智能' : '📂 本地'}
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* 高级筛选按钮 */}
                                <button
                                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${isFilterPanelOpen || hasActiveFilters
                                        ? 'bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Filter size={16} />
                                    筛选
                                    {hasActiveFilters && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {[advancedFilters.documentType, advancedFilters.dateRange, advancedFilters.department, advancedFilters.status].filter(Boolean).length}
                                        </span>
                                    )}
                                </button>
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

                        {/* 高级筛选面板 */}
                        <SearchFilterPanel
                            isOpen={isFilterPanelOpen}
                            onClose={() => setIsFilterPanelOpen(false)}
                            filters={advancedFilters}
                            onFiltersChange={setAdvancedFilters}
                        />

                        {/* 搜索提示 */}
                        {searchHint && (
                            <div className={`mb-4 px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${searchHint.includes('找到')
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : searchHint.includes('出错')
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}>
                                {isSemanticSearching ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : searchHint.includes('找到') ? (
                                    <Sparkles size={14} />
                                ) : (
                                    <Search size={14} />
                                )}
                                {searchHint}
                                {searchHint && !isSemanticSearching && (
                                    <button onClick={() => setSearchHint('')} className="ml-auto hover:bg-white/50 rounded p-0.5">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        )}

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
                    </div>
                </main>

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

            {/* 全局搜索弹窗 */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={closeSearch}
                userId={currentUser.uid}
                folderId={selectedFolderId}
                searchScope={selectedFolderId ? 'folder' : 'all'}
            />
        </DndContext>
    );
}

"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    Plus, FolderPlus, FileText, ChevronRight, ChevronDown, ChevronLeft,
    Loader2, Trash2, Clock, Search, Settings, Star, Share2, Save, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { useStorage } from '@/contexts/StorageContext';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useCollaboration } from '@/hooks/useCollaboration';
import { useFolderManager } from '@/hooks/useFolderManager';
import AppSidebar from '@/components/layout/AppSidebar';
import SearchModal from '@/components/shared/SearchModal';
import CollaborationStatus from '@/components/shared/CollaborationStatus';
import CollaborationToast, { useCollaborationToast } from '@/components/shared/CollaborationToast';
import * as kbService from '@/lib/services/kbService';
import * as teamService from '@/lib/services/teamService';
import { getKBDocuments } from '@/lib/services/api/documentService';
import type { KnowledgeBase, KBFolder, TeamMemberRole } from '@/types/team';
import { getKBPermissions } from '@/types/team';
import { DOC_STATUS } from '@/lib/constants';
import { importWordDoc } from '@/lib/utils/ImportHandler';
import FolderContextMenu from '@/components/FolderContextMenu';

// 动态导入编辑器组件
const DocHeader = dynamic(() => import('@/components/DocHeader'), { ssr: false });
const DocToolbar = dynamic(() => import('@/components/DocToolbar'), { ssr: false });
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });
const AISidebar = dynamic(() => import('@/components/AI/AISidebar'), { ssr: false });
const MagicCommand = dynamic(() => import('@/components/AI/MagicCommand'), { ssr: false });

interface Document {
    id: string;
    title: string;
    content: string;
    status: string;
    folderId: string | null;
    knowledgeBaseId: string | null;
    teamId: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function KnowledgeBasePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const teamId = params.teamId as string;
    const kbId = params.kbId as string;
    const storageContext = useStorage() as any;
    const { currentUser, loading: authLoading, saveDocument, getDocument, deleteDocument } = storageContext;
    const { isOpen: isSearchOpen, openSearch, closeSearch } = useGlobalSearch();

    // 文件夹管理（用于 AppSidebar）
    const folderManager = useFolderManager(currentUser) as any;
    const { folders: appFolders, selectedFolderId: appSelectedFolderId, setSelectedFolderId: setAppSelectedFolderId, loadFolders } = folderManager;

    // 数据状态
    const [kb, setKb] = useState<KnowledgeBase | null>(null);
    const [folders, setFolders] = useState<KBFolder[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [userRole, setUserRole] = useState<TeamMemberRole | null>(null);
    const [loading, setLoading] = useState(true);

    // UI 状态
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingDoc, setIsCreatingDoc] = useState(false);

    // 菜单状态
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        type: 'folder' | 'document';
        item: any;
    } | null>(null);
    const [renamingItem, setRenamingItem] = useState<{ id: string; type: 'folder' | 'document'; name: string } | null>(null);
    const [createSubfolderId, setCreateSubfolderId] = useState<string | null>(null);

    // 编辑器状态
    const [activeDocId, setActiveDocId] = useState<string | null>(null);
    const [docTitle, setDocTitle] = useState('');
    const [docContent, setDocContent] = useState('');
    const [docStatus, setDocStatus] = useState(DOC_STATUS.DRAFT);
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [isMagicCommandOpen, setIsMagicCommandOpen] = useState(false);

    const permissions = getKBPermissions(userRole);

    // 协作功能
    const collaborationUser = useMemo(() => currentUser ? {
        id: currentUser.uid,
        name: currentUser.displayName || currentUser.email || '匿名用户',
    } : null, [currentUser?.uid, currentUser?.displayName, currentUser?.email]);

    const { toasts, dismissToast, notifyUserJoined, notifyUserLeft } = useCollaborationToast();

    const {
        ydoc, provider, isConnected, connectedUsers, reconnect,
    } = useCollaboration(activeDocId || '', collaborationUser as any, {
        onUserJoined: notifyUserJoined,
        onUserLeft: notifyUserLeft,
    }) as any;

    const collaboration = useMemo(() => {
        if (!activeDocId || !ydoc || !provider || !collaborationUser || !isConnected) return undefined;
        try {
            if (typeof ydoc.getText !== 'function') return undefined;
        } catch { return undefined; }
        return { ydoc, provider, user: collaborationUser };
    }, [activeDocId, ydoc, provider, collaborationUser, isConnected]);

    // 从 URL 获取活动文档
    useEffect(() => {
        const docId = searchParams.get('doc');
        if (docId && docId !== activeDocId) {
            loadDocument(docId);
        }
    }, [searchParams]);

    // 加载数据
    useEffect(() => {
        if (kbId && teamId && currentUser?.uid) {
            loadData();
        }
    }, [kbId, teamId, currentUser?.uid]);

    const loadData = async () => {
        if (!kbId || !teamId || !currentUser?.uid) return;
        setLoading(true);
        try {
            const [kbData, foldersData, docsData, role] = await Promise.all([
                kbService.getKnowledgeBase(kbId),
                kbService.getKBFolders(kbId),
                getKBDocuments(kbId),
                teamService.getUserRoleInTeam(teamId, currentUser.uid)
            ]);
            setKb(kbData);
            setFolders(foldersData);
            setDocuments(docsData);
            setUserRole(role);
        } catch (error) {
            console.error('加载知识库数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 加载单个文档
    const loadDocument = async (docId: string) => {
        if (!currentUser?.uid) return;
        const doc = await getDocument(currentUser.uid, docId);
        if (doc) {
            setActiveDocId(docId);
            setDocTitle(doc.title);
            setDocContent(doc.content);
            setDocStatus(doc.status);
            setHasChanges(false);
        }
    };

    // 保存文档
    const handleSave = useCallback(async () => {
        if (!activeDocId || !hasChanges || !currentUser?.uid) return;
        setSaving(true);
        try {
            await saveDocument(currentUser.uid, activeDocId, {
                title: docTitle,
                content: docContent,
                status: docStatus,
                knowledgeBaseId: kbId,
                teamId: teamId,
            });
            setHasChanges(false);
            // 更新文档列表
            setDocuments(prev => prev.map(d =>
                d.id === activeDocId ? { ...d, title: docTitle, updatedAt: new Date().toISOString() } : d
            ));
        } catch (error) {
            console.error('保存失败:', error);
        } finally {
            setSaving(false);
        }
    }, [activeDocId, docTitle, docContent, docStatus, hasChanges, currentUser?.uid, kbId, teamId]);

    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    // 自动保存
    useEffect(() => {
        if (!hasChanges) return;
        const timer = setTimeout(handleSave, 30000);
        return () => clearTimeout(timer);
    }, [hasChanges, handleSave]);

    // 导入 Word 文档
    const handleImport = async (file: File) => {
        try {
            const html = await importWordDoc(file) as string;
            if (editorInstance) {
                editorInstance.commands.setContent(html);
            } else {
                setDocContent(html);
            }
            if (!docTitle || docTitle === '无标题文档') {
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                setDocTitle(fileName);
            }
            setHasChanges(true);
            alert('导入成功！');
        } catch (error) {
            console.error('[导入] 失败:', error);
            alert('导入失败，请确保文件是有效的 Word 文档');
        }
    };

    // 插入块（流程图、图片、表格等）
    const handleInsertBlock = (type: string, meta?: any) => {
        if (editorInstance) {
            if (type === 'flowchart') {
                editorInstance.chain().focus().insertContent({
                    type: 'flowchart',
                    attrs: { xml: null, previewUrl: null, width: '100%', height: '500px' }
                }).run();
            } else if (type === 'image' && meta?.src) {
                editorInstance.chain().focus().setImage({ src: meta.src }).run();
            } else if (type === 'table' && meta?.rows && meta?.cols) {
                editorInstance.chain().focus().insertTable({
                    rows: meta.rows,
                    cols: meta.cols,
                    withHeaderRow: true
                }).run();
            }
        }
    };

    // 创建文档
    const handleCreateDoc = async () => {
        if (!currentUser?.uid || isCreatingDoc) return;
        setIsCreatingDoc(true);
        try {
            const newDoc = {
                title: '无标题文档',
                content: '',
                status: DOC_STATUS.DRAFT,
                contentType: 'html',
                folderId: selectedFolderId,
                knowledgeBaseId: kbId,
                teamId: teamId,
            };
            const savedDoc = await saveDocument(currentUser.uid, null, newDoc);
            if (savedDoc?.id) {
                // 更新列表并打开文档
                setDocuments(prev => [savedDoc, ...prev]);
                openDoc(savedDoc.id);
            }
        } catch (error) {
            console.error('创建文档失败:', error);
            alert('创建文档失败');
        } finally {
            setIsCreatingDoc(false);
        }
    };

    // 打开文档
    const openDoc = (docId: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('doc', docId);
        window.history.pushState({}, '', url.toString());
        loadDocument(docId);
    };

    // 关闭文档
    const closeDoc = () => {
        if (hasChanges && !confirm('您有未保存的更改，确定要关闭吗？')) return;
        const url = new URL(window.location.href);
        url.searchParams.delete('doc');
        window.history.pushState({}, '', url.toString());
        setActiveDocId(null);
        setDocTitle('');
        setDocContent('');
        setHasChanges(false);
    };

    // 删除文档
    const handleDeleteDoc = async (docId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('确定要删除此文档吗？')) return;
        const success = await deleteDocument(currentUser.uid, docId);
        if (success) {
            setDocuments(prev => prev.filter(d => d.id !== docId));
            if (activeDocId === docId) {
                closeDoc();
            }
        }
    };

    // 创建文件夹
    const handleCreateFolder = async (parentId?: string) => {
        const folderName = prompt('请输入文件夹名称：');
        if (!folderName?.trim()) return;
        const folder = await kbService.createKBFolder(kbId, folderName.trim(), parentId || selectedFolderId || undefined);
        if (folder) {
            setFolders(prev => [...prev, folder]);
        }
    };

    // 菜单点击处理
    const handleMenuClick = (e: React.MouseEvent, item: any, type: 'folder' | 'document' | 'create-folder') => {
        if (type === 'create-folder') {
            handleCreateFolder();
            return;
        }
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            type,
            item
        });
    };

    // 重命名文件夹
    const handleRenameFolder = async (folderId: string, newName: string) => {
        const updated = await kbService.updateKBFolder(folderId, { name: newName });
        if (updated) {
            setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f));
        }
        setRenamingItem(null);
    };

    // 重命名文档
    const handleRenameDocument = async (docId: string, newTitle: string) => {
        const updated = await kbService.updateKBDocument(docId, { title: newTitle });
        if (updated) {
            setDocuments(prev => prev.map(d => d.id === docId ? { ...d, title: newTitle } : d));
        }
        setRenamingItem(null);
    };

    // 删除文件夹
    const handleDeleteFolder = async (folderId: string) => {
        if (!confirm('确定要删除此文件夹吗？文件夹下的文档将移到根目录。')) return;
        const success = await kbService.deleteKBFolder(folderId);
        if (success) {
            setFolders(prev => prev.filter(f => f.id !== folderId));
            // 将该文件夹下的文档移到根目录
            const docsInFolder = documents.filter(d => d.folderId === folderId);
            for (const doc of docsInFolder) {
                await kbService.updateKBDocument(doc.id, { folderId: null });
            }
            setDocuments(prev => prev.map(d => d.folderId === folderId ? { ...d, folderId: null } : d));
        }
    };

    // 移动项目（拖拽）
    const handleMoveItem = async (itemId: string, itemType: string, targetFolderId: string | null) => {
        if (itemType === 'document') {
            const updated = await kbService.updateKBDocument(itemId, { folderId: targetFolderId });
            if (updated) {
                setDocuments(prev => prev.map(d => d.id === itemId ? { ...d, folderId: targetFolderId } : d));
            }
        } else if (itemType === 'folder') {
            const updated = await kbService.moveKBFolder(itemId, targetFolderId);
            if (updated) {
                setFolders(prev => prev.map(f => f.id === itemId ? { ...f, parentId: targetFolderId } : f));
            }
        }
    };

    // 切换文件夹展开
    const toggleFolderExpand = (folderId: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderId)) next.delete(folderId);
            else next.add(folderId);
            return next;
        });
    };

    // 格式化时间
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
        }
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    };

    // 构建文件夹树
    const buildTree = (parentId: string | null = null): KBFolder[] => {
        return folders.filter(f => f.parentId === parentId);
    };

    // 最近更新的文档
    const recentDocs = [...documents]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!kb) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">知识库不存在或无权访问</p>
            </div>
        );
    }

    // 渲染文件夹节点
    const renderFolderNode = (folder: KBFolder, level: number = 0) => {
        const children = buildTree(folder.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;
        const folderDocs = documents.filter(d => d.folderId === folder.id);

        return (
            <div key={folder.id}>
                <div
                    className={`flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                >
                    <button onClick={() => (hasChildren || folderDocs.length > 0) && toggleFolderExpand(folder.id)} className="p-0.5">
                        {(hasChildren || folderDocs.length > 0) ? (
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
                        {folderDocs.map(doc => (
                            <div
                                key={doc.id}
                                onClick={() => openDoc(doc.id)}
                                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer group ${activeDocId === doc.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                style={{ paddingLeft: `${(level + 1) * 12 + 24}px` }}
                            >
                                <FileText size={12} className="text-gray-400 flex-shrink-0" />
                                <span className="truncate flex-1">{doc.title}</span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* 应用侧边栏 - 知识库模式 */}
            {!sidebarCollapsed && (
                <AppSidebar
                    currentUser={currentUser}
                    onLogout={() => router.push('/login')}
                    onCreateDoc={handleCreateDoc}
                    onUpload={() => { }}
                    onOpenSearch={openSearch}
                    mode="knowledgeBase"
                    kb={kb}
                    kbFolders={folders}
                    kbDocuments={documents}
                    activeKBDocId={activeDocId}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={setSelectedFolderId}
                    onSelectKBDoc={openDoc}
                    onSelectKBHome={() => setActiveDocId(null)}
                    onMenuClick={handleMenuClick}
                    onMoveItem={handleMoveItem}
                    onCollapse={() => setSidebarCollapsed(true)}
                />
            )}

            {/* 收起/展开按钮 */}
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
                    /* 编辑器模式 */
                    <>
                        {/* 编辑器头部 */}
                        <DocHeader
                            title={docTitle}
                            setTitle={(t: string) => { setDocTitle(t); setHasChanges(true); }}
                            status={docStatus}
                            saving={saving}
                            lastSaved={null}
                            onBack={closeDoc}
                            onShare={() => { }}
                            editor={editorInstance}
                            onOpenVersionHistory={() => { }}
                            onImport={handleImport}
                            onInsertBlock={handleInsertBlock}
                            content={docContent}
                        />

                        {/* 工具栏 */}
                        <DocToolbar
                            editor={editorInstance}
                            onSave={handleSave}
                            onAI={() => setIsAISidebarOpen(!isAISidebarOpen)}
                            onComment={() => { }}
                            onMagicCommand={() => setIsMagicCommandOpen(true)}
                        />

                        {/* 编辑区域 */}
                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 overflow-auto bg-white">
                                <div className="max-w-4xl mx-auto px-8 py-12">
                                    <RichTextEditor
                                        content={docContent}
                                        onChange={(c: string) => { setDocContent(c); setHasChanges(true); }}
                                        onEditorReady={setEditorInstance}
                                        editable={permissions.canEditDoc}
                                        collaboration={collaboration}
                                        placeholder="开始编写文档..."
                                    />
                                </div>
                            </div>

                            {/* AI 侧边栏 */}
                            {isAISidebarOpen && (
                                <AISidebar
                                    isOpen={isAISidebarOpen}
                                    onClose={() => setIsAISidebarOpen(false)}
                                    documentTitle={docTitle}
                                    documentContent={docContent}
                                    currentUser={currentUser}
                                    knowledgeBaseId={kbId}
                                    searchScope="knowledgeBase"
                                    onInsertContent={(text: string) => {
                                        if (editorInstance) {
                                            editorInstance.commands.insertContent(text);
                                            setHasChanges(true);
                                        }
                                    }}
                                />
                            )}
                        </div>

                        {/* Magic Command */}
                        {isMagicCommandOpen && editorInstance && (
                            <MagicCommand
                                editor={editorInstance}
                                onClose={() => setIsMagicCommandOpen(false)}
                            />
                        )}

                        {/* 协作状态 */}
                        {collaboration && (
                            <div className="fixed top-16 right-4 z-30">
                                <CollaborationStatus
                                    users={connectedUsers || []}
                                    isConnected={isConnected}
                                    onReconnect={reconnect}
                                />
                            </div>
                        )}

                        {/* 协作通知 */}
                        <CollaborationToast toasts={toasts} onDismiss={dismissToast} />
                    </>
                ) : (
                    /* 知识库首页模式 */
                    <>
                        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500">知识库主页</span>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600"><Star size={16} /></button>
                                <button className="p-2 text-gray-400 hover:text-gray-600"><Share2 size={16} /></button>
                                <button className="p-2 text-gray-400 hover:text-gray-600"><Settings size={16} /></button>
                            </div>
                        </header>

                        <div className="flex-1 overflow-auto p-6">
                            {/* 知识库信息 */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl">
                                    {kb.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{kb.name}</h2>
                                    <p className="text-gray-500">{kb.description || ''}</p>
                                </div>
                            </div>

                            {/* 最近更新 */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-4">最近更新</h3>
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-xs text-gray-500 border-b">
                                                <th className="px-4 py-3 font-medium">名称</th>
                                                <th className="px-4 py-3 font-medium">更新时间</th>
                                                <th className="px-4 py-3 font-medium w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentDocs.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-12 text-center text-gray-400">
                                                        暂无文档，点击左侧「新建」创建第一个文档
                                                    </td>
                                                </tr>
                                            ) : (
                                                recentDocs.map(doc => (
                                                    <tr
                                                        key={doc.id}
                                                        onClick={() => openDoc(doc.id)}
                                                        className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 group"
                                                    >
                                                        <td className="px-4 py-3 flex items-center gap-2">
                                                            <FileText size={16} className="text-gray-400" />
                                                            <span className="font-medium text-gray-900">{doc.title}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-500">
                                                            {formatDate(doc.updatedAt)}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={(e) => handleDeleteDoc(doc.id, e)}
                                                                className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
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
                        const newName = prompt(
                            contextMenu.type === 'folder' ? '请输入新的文件夹名称：' : '请输入新的文档标题：',
                            contextMenu.item?.name || contextMenu.item?.title
                        );
                        if (newName?.trim()) {
                            if (contextMenu.type === 'folder') {
                                handleRenameFolder(contextMenu.item.id, newName.trim());
                            } else {
                                handleRenameDocument(contextMenu.item.id, newName.trim());
                            }
                        }
                        setContextMenu(null);
                    }}
                    onDelete={() => {
                        if (contextMenu.type === 'folder') {
                            handleDeleteFolder(contextMenu.item.id);
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
        </div >
    );
}
